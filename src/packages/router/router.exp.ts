import * as path from "path";
import { getFileSegmants, isHTTPVerb } from "../../utils/common.ts";
import { parse } from "https://deno.land/x/swc@0.2.1/mod.ts";
import { ExportDeclaration } from "https://esm.sh/@swc/core@1.2.212/types.d.ts";

async function read(routeSegmants: string[]) {
  const modulePath = path.join(Deno.cwd(), "src", "routes", ...routeSegmants);
  for await (const dirEntry of Deno.readDir(modulePath)) {
    if (dirEntry.isDirectory) {
      await read([...routeSegmants, dirEntry.name]);
    } else {
      const [fileName] = getFileSegmants(dirEntry.name);

      if (isHTTPVerb(fileName) || fileName === "middleware") {
        const file = await Deno.readTextFile(path.join(modulePath, dirEntry.name));
        const ast = parse(file, {
          syntax: "typescript",
          target: "es2019",
        });

        if (ast.type !== "Module") {
          throw new Error("Not a module");
        }

        const defaultExportsDecl = ast.body.filter(
          (node) => node.type === "ExportDefaultDeclaration"
        );
        const defaultExportsExp = ast.body.filter(
          (node) => node.type === "ExportDefaultExpression"
        );
        const exportsDecl = ast.body.filter(
          (node) => node.type === "ExportDeclaration"
        ) as ExportDeclaration[];

        if (defaultExportsDecl.length < 1 && defaultExportsExp.length < 1) {
          throw new Error("No default export found");
        }

        const defaultExport = defaultExportsDecl[0] || defaultExportsExp[0];

        if (defaultExport.type === "ExportDefaultDeclaration") {
          if (defaultExport.decl.type !== "FunctionExpression") {
            throw new Error("Default export is not a function");
          }
          if (!defaultExport.decl.returnType)
            throw new Error("Return type must be Response");

          if (
            // @ts-ignore missing types
            defaultExport.decl.returnType.typeAnnotation?.typeName?.value !== "Response"
          ) {
            throw new Error("Return type must be Response");
          }
        }

        if (
          defaultExport.type === "ExportDefaultExpression" &&
          defaultExport.expression.type === "Identifier"
        ) {
          const defaultExportName = defaultExport.expression.value;
          const arrowFnVar = ast.body.find((node) => {
            if (
              (node.type === "VariableDeclaration" &&
                node.declarations[0].id.type === "Identifier" &&
                node.declarations[0].id.value === defaultExportName) ||
              (node.type === "FunctionDeclaration" &&
                node.identifier.value === defaultExportName)
            ) {
              return true;
            }
          });
          if (!arrowFnVar) {
            throw new Error("Default export is not a function");
          }

          const isFn = arrowFnVar.type === "FunctionDeclaration";
          const isVar = arrowFnVar.type === "VariableDeclaration";
          if (
            arrowFnVar.type !== "FunctionDeclaration" &&
            arrowFnVar.type !== "VariableDeclaration"
          ) {
            throw new Error("Default export is not a function");
          }

          if (isVar) {
            if (
              !arrowFnVar.declarations[0].init ||
              arrowFnVar.declarations[0].init.type !== "ArrowFunctionExpression"
            ) {
              throw new Error("Default export is not a function");
            }

            if (
              arrowFnVar.declarations[0].id.type !== "Identifier" ||
              // @ts-ignore missing types
              arrowFnVar.declarations[0].id.typeAnnotation?.typeAnnotation?.typeName
                ?.value !== "RequestHandler"
            ) {
              throw new Error("Default export must have RequestHandler type");
            }
          }

          if (isFn) {
            if (
              // @ts-ignore missing types
              arrowFnVar.returnType.typeAnnotation.typeName.value !== "Response"
            ) {
              throw new Error("Return type must be Response");
            }
          }
        }
      }
    }
  }
}

await read(["/"]);
