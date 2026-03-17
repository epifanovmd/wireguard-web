import { AnimatePresence, motion } from "motion/react";
import * as React from "react";

import { cn } from "../cn";
import { useCollapseContext } from "./CollapseContext";
import { collapseContentVariants } from "./collapseVariants";

export interface CollapseContentProps {
  children: React.ReactNode;
  className?: string;
  /** Extra className applied to the inner padding wrapper */
  innerClassName?: string;
}

export const CollapseContent: React.FC<CollapseContentProps> = ({
  children,
  className,
  innerClassName,
}) => {
  const { isOpen, triggerId, contentId, variant } = useCollapseContext();

  return (
    <AnimatePresence initial={false}>
      {isOpen && (
        <motion.div
          id={contentId}
          role="region"
          aria-labelledby={triggerId}
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
          className={cn(collapseContentVariants({ variant }), className)}
        >
          <div className={cn("pt-1", innerClassName)}>{children}</div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
CollapseContent.displayName = "Collapse.Content";
