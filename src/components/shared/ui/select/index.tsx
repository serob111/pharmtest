import * as React from "react";
import { useEffect, useRef, useState } from "react";

import type { SelectProps } from "./types";

import { SELECT_CLASSNAMES } from "./constants";
import { filterOptions, findSelectedOption, mergeRefs } from "./utils";
import { cn } from "../../../../lib/utils";
import Spinner from "../Spinner";

const scrollToSelectedOption = (
  listRef: React.RefObject<HTMLDivElement | null>,
  selectedOptionId: string | number,
): void => {
  if (listRef.current === null) return;

  const selectedElement = listRef.current.querySelector(
    `[data-option-id="${selectedOptionId}"]`,
  );

  if (selectedElement !== null) {
    selectedElement.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
    });
  }
};

export const Select = React.forwardRef<HTMLDivElement, SelectProps>(
  (
    {
      value,
      options,
      placeholder = "Select...",
      disabled = false,
      error = false,
      searchable = false,
      searchPlaceholder = "Search...",
      className,
      isLoadingMore,
      noOptions,
      icon,
      isShowClearBtn = false,
      isHideIconCheck = false,
      autoScrollToSelected = false,
      onChange,
      onSearchChange,
      onClear,
      onScrollEnd,
      renderOption,
    },
    ref,
  ) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const [searchValue, setSearchValue] = useState("");
    const [openUpward, setOpenUpward] = useState(false);

    const selectRef = useRef<HTMLDivElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const listRef = useRef<HTMLDivElement>(null);

    const selectedOption = React.useMemo(
      () => findSelectedOption(options, value),
      [options, value],
    );
    const filteredOptions = React.useMemo(
      () => filterOptions(options, searchValue),
      [options, searchValue],
    );

    useEffect(() => {
      if (isOpen && selectRef.current !== null) {
        const rect = selectRef.current.getBoundingClientRect();

        const dropdownRect = dropdownRef.current?.getBoundingClientRect();

        if (dropdownRect !== undefined) {
          const dropdownHeight = dropdownRect.height;

          const spaceBelow = window.innerHeight - rect.bottom;
          const spaceAbove = rect.top;

          if (spaceBelow < dropdownHeight && spaceAbove > dropdownHeight) {
            setOpenUpward(true);
          } else {
            setOpenUpward(false);
          }
        }
      }
    }, [isOpen, dropdownRef]);

    useEffect(() => {
      if (searchable && isOpen && inputRef.current !== null) {
        inputRef.current.focus();
      }
    }, [isOpen, searchable]);

    useEffect(() => {
      if (
        autoScrollToSelected &&
        isOpen &&
        selectedOption !== undefined &&
        searchValue === ""
      ) {
        const timer = setTimeout(() => {
          scrollToSelectedOption(listRef, selectedOption.id);
        }, 50);

        return () => {
          clearTimeout(timer);
        };
      }

      return undefined;
    }, [isOpen, selectedOption, searchValue, autoScrollToSelected]);

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent): void => {
        if (
          selectRef.current !== null &&
          !selectRef.current.contains(event.target as Node)
        ) {
          setIsOpen(false);
          setIsFocused(false);
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, []);

    const handleScroll = (e: React.UIEvent<HTMLDivElement>): void => {
      const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 50;

      if (isNearBottom) {
        onScrollEnd?.();
      }
    };
    return (
      <div
        ref={mergeRefs([selectRef, ref])}
        className={SELECT_CLASSNAMES.wrapper}
      >
        <button
          type="button"
          onClick={() => {
            if (!disabled) {
              setIsOpen(!isOpen);
            }
          }}
          onFocus={() => {
            if (!disabled) {
              setIsFocused(true);
            }
          }}
          onBlur={() => {
            if (!disabled) {
              setIsFocused(false);
            }
          }}
          className={cn(
            SELECT_CLASSNAMES.trigger,
            disabled
              ? SELECT_CLASSNAMES.triggerDisabled
              : error
                ? SELECT_CLASSNAMES.triggerError
                : SELECT_CLASSNAMES.triggerDefault,
            (isFocused || isOpen) &&
              "border-stroke-blue ring-2 ring-[color:var(--primitives-system-colors-ice-blue)]",
            className,
          )}
          disabled={disabled}
        >
          <div className="gap-2 flex items-center">
            {icon !== undefined && (
              <span
                style={{ fontSize: "20px" }}
                className="material-icons-outlined text-tokens-icons-default"
              >
                {icon}
              </span>
            )}
            <span
              className={cn(
                selectedOption === undefined
                  ? "text-tokens-text-secondary-text"
                  : "",
                disabled &&
                  selectedOption !== undefined &&
                  "text-tokens-text-main-text",
              )}
            >
              {selectedOption !== undefined ? selectedOption.name : placeholder}
            </span>
          </div>
          <div className="gap-2 flex items-center">
            {selectedOption !== undefined && isShowClearBtn && (
              <span
                style={{ fontSize: "20px" }}
                onClick={(e) => {
                  e.stopPropagation();
                  onClear?.();
                }}
                className="material-icons-outlined text-tokens-icons-default"
              >
                close
              </span>
            )}
            <span
              className={cn(
                "material-icons-outlined",
                SELECT_CLASSNAMES.chevron,
                isOpen && SELECT_CLASSNAMES.chevronOpen,
                disabled && SELECT_CLASSNAMES.chevronDisabled,
              )}
              style={{ fontSize: "20px" }}
            >
              expand_more
            </span>
          </div>
        </button>

        {isOpen && (
          <div
            className={cn(
              SELECT_CLASSNAMES.dropdown,
              openUpward && SELECT_CLASSNAMES.dropdownUpward,
            )}
            ref={dropdownRef}
          >
            {searchable && (
              <div className={SELECT_CLASSNAMES.searchWrapper}>
                <div className={SELECT_CLASSNAMES.searchIconWrapper}>
                  <span
                    style={{ fontSize: "20px" }}
                    className="material-icons-outlined text-tokens-icons-default"
                  >
                    search
                  </span>
                  <input
                    ref={inputRef}
                    type="text"
                    value={searchValue}
                    onChange={(e) => {
                      setSearchValue(e.target.value);
                      onSearchChange?.(e.target.value);
                    }}
                    placeholder={searchPlaceholder}
                    className={SELECT_CLASSNAMES.searchInput}
                  />
                </div>
              </div>
            )}

            <div
              ref={listRef}
              className={SELECT_CLASSNAMES.optionsList}
              onScroll={handleScroll}
            >
              {filteredOptions.length > 0 ? (
                <>
                  {filteredOptions.map((option) => (
                    <div
                      key={option.id}
                      data-option-id={option.id}
                      className={cn(
                        SELECT_CLASSNAMES.option,
                        option.id === value && SELECT_CLASSNAMES.optionSelected,
                      )}
                      onClick={() => {
                        onChange?.(option);
                        setIsOpen(false);
                        setSearchValue("");
                      }}
                    >
                      {renderOption !== undefined ? (
                        renderOption(option)
                      ) : (
                        <span>{option.name}</span>
                      )}
                      {option.id === value && !isHideIconCheck && (
                        <div className="p-0.5 flex items-center justify-center rounded-full bg-tokens-background-blue">
                          <span
                            style={{ fontSize: "16px" }}
                            className="material-icons-outlined text-white"
                          >
                            check
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                  {isLoadingMore === true && (
                    <div className="py-2 flex justify-center">
                      <Spinner />
                    </div>
                  )}
                </>
              ) : (
                (noOptions ?? (
                  <div className={SELECT_CLASSNAMES.noOptions}>
                    No items found
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    );
  },
);

Select.displayName = "Select";
