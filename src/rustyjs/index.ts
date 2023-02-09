enum Options {
  Some = "Some",
  None = "None",
}

type Option<T> =
  | {
      kind: Options.Some;
      value: T;
    }
  | {
      kind: Options.None;
    };

export const rjs = {
  Array: {
    get: <T>(arr: T[], index: number): Option<T> => {
      if (index >= arr.length) return { kind: Options.None };
      return { kind: Options.Some, value: arr[index] };
    },
  },
  Object: {
    get: <T>(obj: Record<string, T>, key: string): Option<T> => {
      if (!obj[key]) return { kind: Options.None };
      return { kind: Options.Some, value: obj[key] };
    },
  },
  unwrap<T>(wrapper: Option<T>) {
    return function (errorHandler: () => void) {
      if (wrapper.kind === Options.None) return errorHandler();
      return wrapper.value;
    };
  },
};
