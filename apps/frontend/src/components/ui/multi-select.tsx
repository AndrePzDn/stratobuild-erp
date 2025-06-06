import { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "./button";
import { Checkbox } from "./checkbox";
import { ChevronDown, X, Minus, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface DropMenuItem {
  label: string;
  value: string;
}

interface Props {
  items?: DropMenuItem[];
  checked?: string[];
  onCheckedChange?: (checked: string[]) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  maxDisplayItems?: number;
}

export default function MultiSelect({
  items = [],
  checked = [],
  onCheckedChange,
  placeholder = "Select options",
  className,
  disabled = false,
  maxDisplayItems = 3,
}: Props) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (
      containerRef.current &&
      !containerRef.current.contains(event.target as Node)
    ) {
      setIsMenuOpen(false);
    }
  }, []);

  useEffect(() => {
    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isMenuOpen, handleClickOutside]);

  const toggleValue = useCallback(
    (value: string) => {
      if (disabled) return;

      const newChecked = checked.includes(value)
        ? checked.filter((v) => v !== value)
        : [...checked, value];
      onCheckedChange?.(newChecked);
    },
    [checked, onCheckedChange, disabled],
  );

  const clearAll = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (disabled) return;
      onCheckedChange?.([]);
    },
    [onCheckedChange, disabled],
  );

  const selectAll = useCallback(() => {
    if (disabled) return;
    const allValues = items.map((item) => item.value);
    onCheckedChange?.(allValues);
  }, [items, onCheckedChange, disabled]);

  const selectedItems = items.filter((item) => checked.includes(item.value));
  const isAllSelected = items.length > 0 && checked.length === items.length;
  const isIndeterminate = checked.length > 0 && checked.length < items.length;

  const getDisplayText = () => {
    if (selectedItems.length === 0) return placeholder;

    if (selectedItems.length <= maxDisplayItems) {
      return selectedItems.map((item) => item.label).join(", ");
    }

    return `${selectedItems.length} items seleccionados`;
  };

  const toggleMenu = () => {
    if (!disabled) {
      setIsMenuOpen((prev) => !prev);
    }
  };

  return (
    <div className={cn("relative inline-block", className)} ref={containerRef}>
      <Button
        variant="outline"
        onClick={toggleMenu}
        disabled={disabled}
        className={cn(
          "justify-between w-full",
          disabled && "opacity-50 cursor-not-allowed",
        )}
        aria-expanded={isMenuOpen}
        aria-haspopup="listbox"
      >
        <span className="truncate text-left flex-1">{getDisplayText()}</span>
        <div className="flex items-center gap-1 ml-2">
          {selectedItems.length > 0 && !disabled && (
            <X
              className="h-4 w-4 hover:bg-muted rounded-sm p-0.5"
              onClick={clearAll}
            />
          )}
          <ChevronDown
            className={cn(
              "h-4 w-4 transition-transform duration-200",
              isMenuOpen && "rotate-180",
            )}
          />
        </div>
      </Button>

      {isMenuOpen && !disabled && (
        <div
          ref={menuRef}
          className="absolute top-full left-0 mt-1 z-[9999] bg-popover border border-border rounded-md shadow-lg p-1 w-full max-h-[200px] overflow-y-auto"
          role="listbox"
          aria-multiselectable="true"
        >
          {items.length === 0 ? (
            <div className="px-3 py-2 text-sm text-muted-foreground">
              No options available
            </div>
          ) : (
            <>
              {/* Select All Option */}
              <div
                className="flex items-center space-x-2 p-2 hover:bg-accent hover:text-accent-foreground rounded-sm cursor-pointer select-none border-b border-border mb-1"
                onClick={
                  isAllSelected ? () => onCheckedChange?.([]) : selectAll
                }
              >
                <div className="relative flex items-center justify-center w-4 h-4 border border-input rounded-sm bg-background">
                  {isAllSelected ? (
                    <Check className="h-3 w-3" />
                  ) : isIndeterminate ? (
                    <Minus className="h-3 w-3" />
                  ) : null}
                </div>
                <span className="text-sm font-medium flex-1">
                  {isAllSelected ? "Deseleccionar todo" : "Seleccionar todo"}
                </span>
              </div>

              {/* Individual Items */}
              {items.map((item) => (
                <div
                  key={item.value}
                  className="flex items-center space-x-2 p-2 hover:bg-accent hover:text-accent-foreground rounded-sm cursor-pointer select-none"
                  onClick={() => toggleValue(item.value)}
                  role="option"
                  aria-selected={checked.includes(item.value)}
                >
                  <Checkbox
                    checked={checked.includes(item.value)}
                    className="pointer-events-none"
                  />
                  <span className="text-sm flex-1">{item.label}</span>
                </div>
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
}
