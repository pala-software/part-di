export type Part<Type = any, Dependencies extends Part<any, any>[] = any> = {
  definition: Part<Type, any> | string;
  dependencies: [...Dependencies];
  (dependencies: {
    [Key in keyof Dependencies]: Resolved<Dependencies[Key]>;
  }): Type;
};

export type Resolved<T extends Part> =
  T extends Part<infer Type> ? Awaited<Type> : never;
