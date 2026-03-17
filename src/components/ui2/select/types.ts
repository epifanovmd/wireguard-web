import * as SelectPrimitive from "@radix-ui/react-select";
import * as React from "react";

import { type SelectTriggerProps } from "./primitives";

// ─── Option types ─────────────────────────────────────────────────────────────

export interface SelectOption<TValue extends string = string> {
  value: TValue;
  label: React.ReactNode;
  disabled?: boolean;
}

export interface SelectOptionGroup<TValue extends string = string> {
  group: string;
  options: SelectOption<TValue>[];
}

// ─── Shared trigger appearance ────────────────────────────────────────────────

export interface SelectTriggerAppearance {
  placeholder?: string;
  triggerSize?: SelectTriggerProps["size"];
  triggerClassName?: string;
}

// ─── Base root props (re-typed with generic value) ────────────────────────────

type RadixRootProps = React.ComponentPropsWithoutRef<typeof SelectPrimitive.Root>;

export interface SelectRootProps<TValue extends string = string>
  extends Omit<RadixRootProps, "value" | "defaultValue" | "onValueChange"> {
  value?: TValue;
  defaultValue?: TValue;
  onValueChange?: (value: TValue) => void;
}
