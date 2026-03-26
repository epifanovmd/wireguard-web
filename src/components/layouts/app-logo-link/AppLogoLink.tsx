import { cn } from "@components/ui";
import { Link } from "@tanstack/react-router";
import { ShieldCheck } from "lucide-react";
import { ComponentProps, FC } from "react";

interface AppLogoLinkProps extends ComponentProps<typeof Link> {
  size?: "sm" | "md";
  className?: string;
}

export const AppLogoLink: FC<AppLogoLinkProps> = ({
  size = "sm",
  className,
  ...rest
}) => (
  <Link to="/" className={cn("flex items-center gap-2.5", className)} {...rest}>
    <div
      className={cn(
        "bg-brand rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm",
        size === "sm" ? "w-7 h-7" : "w-10 h-10",
      )}
    >
      <ShieldCheck className="text-white" size={size === "sm" ? 15 : 22} />
    </div>
    <div>
      <p
        className={cn(
          "text-foreground font-semibold leading-none",
          size === "sm" ? "text-sm" : "text-xl",
        )}
      >
        WireGuard
      </p>
      <p
        className={cn(
          "text-muted-foreground mt-0.5",
          size === "sm" ? "text-[11px]" : "text-xs",
        )}
      >
        Панель управления
      </p>
    </div>
  </Link>
);
