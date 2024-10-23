import { useEffect, useRef, useState } from "react";

import { Input } from "@/components/ui/input";

export function AutocompleteInput({
  options,
  setValue,
  value,
}: {
  options: string[];
  setValue: (value: string) => void;
  value: string;
}) {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        inputRef.current &&
        !inputRef.current.contains(event.target as Node) &&
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
    setShowSuggestions(true);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setValue(suggestion);
    setShowSuggestions(false);
  };

  const filteredSuggestions = options.filter((option) =>
    option.toLowerCase().includes(value.toLowerCase()),
  );

  return (
    <div className="relative">
      <Input
        ref={inputRef}
        type="text"
        value={value}
        onChange={handleInputChange}
        onFocus={() => setShowSuggestions(true)}
        placeholder="Type to search..."
      />

      <ul
        ref={suggestionsRef}
        id="suggestions-list"
        className="absolute z-50 mt-1 max-h-60 w-full min-w-[8rem] overflow-y-auto overflow-x-hidden rounded-md border bg-popover text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95"
        role="listbox"
        hidden={!showSuggestions || filteredSuggestions.length == 0}
      >
        {filteredSuggestions.map((suggestion, index) => (
          <li
            key={index}
            onClick={() => handleSuggestionClick(suggestion)}
            className="cursor-pointer px-4 py-2 text-sm hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
            tabIndex={0}
          >
            {suggestion}
          </li>
        ))}
      </ul>
    </div>
  );
}
