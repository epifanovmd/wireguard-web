import * as PopoverPrimitive from "@radix-ui/react-popover";

import { PopoverArrow } from "./PopoverArrow";
import { PopoverContent } from "./PopoverContent";

export const Popover = Object.assign(PopoverPrimitive.Root, {
  Trigger: PopoverPrimitive.Trigger,
  Portal: PopoverPrimitive.Portal,
  Close: PopoverPrimitive.Close,
  Anchor: PopoverPrimitive.Anchor,
  Arrow: PopoverArrow,
  Content: PopoverContent,
});
