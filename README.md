# Part DI

Part DI is a TypeScript library that allows you to invert dependencies of
application components (called "parts") using dependency injection technique.
This enables you to choose and swap parts of your application also within other
parts.

## Creating parts

To create a part you need to call `createPart` function exported by this
package. Depending how you call the function, the resulting part can have an
implementation or be just an definition.

### Examples

Create a part with a default implementation:

```typescript
export const SumPart = createPart(
  // Name of the part
  "Sum",
  // Dependencies
  [],
  // Init function receiving dependencies
  () =>
    // Implementation
    (a: number, b: number): number =>
      a + b
);
```

Create a part as a definition:

```typescript
export const SumPart = createPart<
  // Interface
  (a: number, b: number) => number
>(
  // Name of the part
  "Sum"
);
```

Implement a part from definition with a dependency:

```typescript
export const RegularSumPart = createPart(
  // Definition
  SumPart,
  // Dependencies
  [MathLibraryPart],
  // Init function receiving dependencies
  ([math]) =>
    // Implementation
    (a, b) =>
      math.sum(a, b)
);
```

Extend a part:

```typescript
export const LoggingSumPart = createPart(
  // Definition
  RegularSumPart,
  // Dependencies
  [RegularSumPart],
  // Init function receiving dependencies
  ([sum]) =>
    // Implementation
    (a, b) => {
      console.log({ a, b, sum: sum(a, b) });
      return sum(a, b);
    }
);
```

## Using parts in an application

To use parts in an application you need to call `resolvePart` exported from this
package with a base part definition to resolve and an array of parts to use. The
array is evaluated sequentially in a way that the first part in the list takes
priority.

### Example

In this example an application is resolved and ran using parts defined in
section above. Application requires `SumPart` which is implemented by
`LoggingSumPart` as a priority in parts array. Because `LoggingSumPart` extends
`RegularSumPart` which is implemented by `OverrideSumPart` as a priority in the
parts array, the application calculates difference instead of sum, logs the
parameters and result, and finally logs the final result in the application.

```typescript
const ApplicationPart = createPart("Application", [SumPart], ([sum]) => ({
  calculate: (a: number, b: number): void => {
    console.log(sum(a, b));
  },
}));
const OverrideSumPart = createPart(RegularSum, [], (a, b) => a - b);
const application = resolvePart(ApplicationPart, [
  LoggingSumPart,
  OverrideSumPart,
]);

application.calculate(8, 5);
// Output: { a: 8, b: 5, sum: 3  }
// Output: 3
```
