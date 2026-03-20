import * as DialogPrimitive from "@radix-ui/react-dialog";

import { ModalBody } from "./ModalBody";
import { ModalContent } from "./ModalContent";
import { ModalDescription } from "./ModalDescription";
import { ModalFooter } from "./ModalFooter";
import { ModalHeader } from "./ModalHeader";
import { ModalOverlay } from "./ModalOverlay";
import { ModalTitle } from "./ModalTitle";

export const Modal = Object.assign(DialogPrimitive.Root, {
  Trigger: DialogPrimitive.Trigger,
  Portal: DialogPrimitive.Portal,
  Close: DialogPrimitive.Close,
  Overlay: ModalOverlay,
  Content: ModalContent,
  Header: ModalHeader,
  Body: ModalBody,
  Footer: ModalFooter,
  Title: ModalTitle,
  Description: ModalDescription,
});
