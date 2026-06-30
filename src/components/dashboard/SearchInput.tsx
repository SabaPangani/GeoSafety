"use client";

import { useEffect, useState } from "react";

interface SearchInputProps {
  /** The committed search value from the filter state. */
  value: string;
  /** Called with the debounced value once the user stops typing. */
  onChange: (value: string) => void;
  /** Debounce delay in milliseconds. */
  delay?: number;
  placeholder?: string;
}

/**
 * Controlled search box with local immediate state and a debounced push to the
 * filter state, so the transactions query doesn't refetch on every keystroke.
 */
export function SearchInput({
  value,
  onChange,
  delay = 300,
  placeholder,
}: SearchInputProps) {
  const [local, setLocal] = useState(value);
  const [committed, setCommitted] = useState(value);

  // Resync during render if the committed value changes from outside (e.g. a
  // filter reset) — the recommended alternative to a setState-in-effect.
  if (value !== committed) {
    setCommitted(value);
    setLocal(value);
  }

  // Push the local value to the filter state after the user pauses typing.
  useEffect(() => {
    if (local === value) {
      return;
    }
    const timer = setTimeout(() => onChange(local), delay);
    return () => clearTimeout(timer);
  }, [local, value, delay, onChange]);

  return (
    <input
      type="search"
      value={local}
      onChange={(event) => setLocal(event.target.value)}
      placeholder={placeholder}
      className="w-56 rounded-md border border-border bg-surface-2 px-3 py-1 text-sm text-text placeholder:text-dim focus:border-accent focus:outline-none"
    />
  );
}
