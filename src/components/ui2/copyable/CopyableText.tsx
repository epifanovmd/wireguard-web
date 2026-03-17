import { Check, Copy } from "lucide-react";
import * as React from "react";

import { cn } from "../cn";

export interface CopyableTextProps {
  text: string;
  displayText?: string;
  truncate?: boolean;
  className?: string;
}

export const CopyableText: React.FC<CopyableTextProps> = ({
  text,
  displayText,
  truncate = true,
  className,
}) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={cn(
        "inline-flex items-center gap-1.5 text-xs font-mono group cursor-pointer",
        className,
      )}
      title={text}
    >
      <span className={cn(truncate && "truncate max-w-[200px]")}>
        {displayText ?? text}
      </span>
      <span className="flex-shrink-0 text-muted-foreground group-hover:text-foreground transition-colors">
        {copied ? <Check size={12} className="text-success" /> : <Copy size={12} />}
      </span>
    </button>
  );
};
