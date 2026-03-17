import { Moon, Sun } from "lucide-react";
import * as React from "react";
import { memo } from "react";

import { useTheme } from "~@theme";

import { Button } from "./button";

export const ThemeToggle = memo(() => {
  const { toggleTheme } = useTheme();

  return (
    <Button
      variant="outline"
      size="md"
      onClick={toggleTheme}
      aria-label="Toggle theme"
      className="relative"
    >
      <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
    </Button>
  );
});
