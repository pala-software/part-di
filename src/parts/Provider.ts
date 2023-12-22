import { createPart } from "../functions";
import { Part } from "../types";

export const ProviderPart = createPart<() => Part[]>("PartProvider");
