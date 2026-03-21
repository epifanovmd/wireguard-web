import { type VariantProps } from "class-variance-authority";
import { Eye, EyeOff, Loader2, X } from "lucide-react";
import * as React from "react";

import { cn } from "../cn";
import { inputVariants } from "./inputVariants";

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size">,
    VariantProps<typeof inputVariants> {
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  clearable?: boolean;
  onClear?: () => void;
  loading?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type = "text",
      size,
      variant,
      leftIcon,
      rightIcon,
      clearable,
      onClear,
      loading,
      value,
      onChange,
      ...props
    },
    ref,
  ) => {
    const [showPassword, setShowPassword] = React.useState(false);
    const [internalValue, setInternalValue] = React.useState(value || "");
    const isPassword = type === "password";

    React.useEffect(() => {
      setInternalValue(value || "");
    }, [value]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setInternalValue(e.target.value);
      onChange?.(e);
    };

    const handleClear = () => {
      setInternalValue("");
      onClear?.();
      const event = {
        target: { value: "" },
      } as React.ChangeEvent<HTMLInputElement>;
      onChange?.(event);
    };

    const showClearButton = clearable && internalValue && !loading;
    const showPasswordToggle = isPassword && internalValue;

    return (
      <div className="relative w-full">
        {leftIcon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            {leftIcon}
          </div>
        )}
        <input
          type={isPassword && !showPassword ? "password" : "text"}
          className={cn(
            inputVariants({ size, variant }),
            leftIcon && "pl-10",
            (rightIcon || showClearButton || showPasswordToggle || loading) && "pr-10",
            className,
          )}
          ref={ref}
          value={value}
          onChange={handleChange}
          {...props}
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
          {loading && (
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          )}
          {!loading && showPasswordToggle && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              tabIndex={-1}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          )}
          {!loading && showClearButton && !isPassword && (
            <button
              type="button"
              onClick={handleClear}
              className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              tabIndex={-1}
            >
              <X className="h-4 w-4" />
            </button>
          )}
          {!loading && rightIcon && !showClearButton && !showPasswordToggle && (
            <div className="text-muted-foreground">{rightIcon}</div>
          )}
        </div>
      </div>
    );
  },
);
Input.displayName = "Input";

export { Input };
