export type OptionType = "boolean" | "multi";
export interface Option<T> {
  type: OptionType;
  values: T[];
  default: T;
}

export interface BooleanOption extends Option<boolean> {
  type: "boolean";
  values: [true, false];
  default: false;
}
