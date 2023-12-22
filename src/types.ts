export type Part<Type = any, Dependencies extends Part<any, any>[] = any> = {
  definition: Part<Type, any> | string;
  dependencies: [...Dependencies];
  (dependencies: {
    [Key in keyof Dependencies]: ReturnType<Dependencies[Key]>;
  }): Type;
};
