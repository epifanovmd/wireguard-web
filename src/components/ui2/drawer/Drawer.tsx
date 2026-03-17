import { Drawer as DrawerPrimitive } from "vaul";

import { DrawerContent } from "./DrawerContent";
import { DrawerDescription } from "./DrawerDescription";
import { DrawerFooter } from "./DrawerFooter";
import { DrawerHeader } from "./DrawerHeader";
import { DrawerOverlay } from "./DrawerOverlay";
import { DrawerTitle } from "./DrawerTitle";

export const Drawer = Object.assign(DrawerPrimitive.Root, {
  Trigger: DrawerPrimitive.Trigger,
  Portal: DrawerPrimitive.Portal,
  Close: DrawerPrimitive.Close,
  Overlay: DrawerOverlay,
  Content: DrawerContent,
  Header: DrawerHeader,
  Footer: DrawerFooter,
  Title: DrawerTitle,
  Description: DrawerDescription,
});
