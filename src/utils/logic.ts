// 조건에 따라 두 함수 중 하나 실행
export const ifElse =
  <T, R>(
    pred: (val: T) => boolean,
    onTrue: (val: T) => R,
    onFalse: (val: T) => R
  ) =>
  (val: T): R =>
    pred(val) ? onTrue(val) : onFalse(val);

// 조건이 true일 때만 실행
export const when =
  <T>(pred: (val: T) => boolean, fn: (val: T) => T) =>
  (val: T): T =>
    pred(val) ? fn(val) : val;

// 조건이 false일 때만 실행
export const unless =
  <T>(pred: (val: T) => boolean, fn: (val: T) => T) =>
  (val: T): T =>
    !pred(val) ? fn(val) : val;

// 여러 조건 중 첫 번째 만족하는 분기를 실행
export const cond =
  <T, R>(...pairs: Array<[(val: T) => boolean, (val: T) => R]>) =>
  (val: T): R | undefined => {
    for (const [pred, fn] of pairs) {
      if (pred(val)) return fn(val);
    }
    return undefined;
  };

type MatchResult<T, R> = {
  when: <U extends R>(
    predicate: (value: T) => boolean,
    fn: (value: T) => U
  ) => MatchResult<T, R | U>;
  otherwise: <U extends R>(fn: (value: T) => U) => U;
};

export const match = <T>(value: T): MatchResult<T, never> => ({
  when: <R>(predicate: (value: T) => boolean, fn: (value: T) => R) =>
    predicate(value)
      ? {
          when: () => ({ when: match(value).when, otherwise: () => fn(value) }),
          otherwise: () => fn(value),
        }
      : match(value),
  otherwise: <R>(fn: (value: T) => R): R => fn(value),
});
