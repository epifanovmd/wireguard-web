import * as React from "react";

export interface UseSelectStateResult {
  open: boolean;
  query: string;
  setQuery: (q: string) => void;
  handleOpen: (
    nextOpen: boolean,
    inputRef?: React.RefObject<HTMLInputElement | null>,
  ) => void;
}

export function useSelectState(search?: boolean): UseSelectStateResult {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");

  const handleOpen = React.useCallback(
    (
      nextOpen: boolean,
      inputRef?: React.RefObject<HTMLInputElement | null>,
    ) => {
      setOpen(nextOpen);
      if (!nextOpen) {
        setQuery("");
      } else if (search && inputRef) {
        setTimeout(() => inputRef.current?.focus(), 0);
      }
    },
    [search],
  );

  return { open, query, setQuery, handleOpen };
}
