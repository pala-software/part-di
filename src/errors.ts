import { getName } from "./functions";
import { Part } from "./types";

export class NotImplementedError extends Error {
  constructor(part: Part | string) {
    super("Could not find implementation for " + getName(part));
  }
}
