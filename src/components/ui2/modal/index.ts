// Context & types
export type { ConfirmOptions, ModalContextValue, ModalEntry, ModalOptions } from "./ModalContext";
export { ModalContext } from "./ModalContext";

// Provider & hook
export { ModalProvider } from "./ModalProvider";
export { useModal } from "./useModal";

// Compound component (Modal.Trigger, Modal.Content, etc.)
export { Modal } from "./Modal";

// Individual primitives (for direct use)
export { ModalBody } from "./ModalBody";
export type { ModalContentProps } from "./ModalContent";
export { ModalContent } from "./ModalContent";
export { ModalDescription } from "./ModalDescription";
export { ModalFooter } from "./ModalFooter";
export { ModalHeader } from "./ModalHeader";
export type { ModalOverlayProps } from "./ModalOverlay";
export { ModalOverlay } from "./ModalOverlay";
export { ModalTitle } from "./ModalTitle";

// Variants
export { modalContentVariants } from "./modalVariants";
