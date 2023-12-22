export type Part<Type = any, Dependencies extends Part[] = Part<any, any>[]> = {
  definition: Part | string;
  dependencies: Dependencies;
  (dependencies: {
    [Key in keyof Dependencies]: ReturnType<Dependencies[Key]>;
  }): Type;
};
