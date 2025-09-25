import type { ReactNode } from "react";

import * as React from "react";
import { useEffect, useRef, useState } from "react";

import type { SelectOption } from "../types";

import { SELECT_CLASSNAMES } from "../constants";
import { filterOptions, mergeRefs } from "../utils";
import { cn } from "../../../../../lib/utils";
import Spinner from "../../Spinner";

export type MultiSelectProps = {
  value?: Array<string | number>;
  options: SelectOption[];
  placeholder?: string;
  disabled?: boolean;
  error?: boolean;
  searchable?: boolean;
  searchPlaceholder?: string;
  searchValue?: string;
  className?: string;
  isLoadingMore?: boolean;
  noOptions?: ReactNode;
  icon?: string;
  isShowCountOptions?: boolean;
  isShowClearBtn?: boolean;
  onChange?: (options: SelectOption) => void;
  onClear?: () => void;
  onRemove?: (options: SelectOption) => void;
  onSearchChange?: (value: string) => void;
  onScrollEnd?: () => void;
  renderOption?: (option: SelectOption) => ReactNode;
};

export const MultiSelect = React.forwardRef<HTMLDivElement, MultiSelectProps>(
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
      isShowCountOptions = false,
      isShowClearBtn = false,
      onChange,
      onRemove,
      onClear,
      onSearchChange,
      onScrollEnd,
      renderOption,
    },
    ref,
  ) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const [searchValue, setSearchValue] = useState("");
    const selectRef = useRef<HTMLDivElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const listRef = useRef<HTMLDivElement>(null);
    const [openUpward, setOpenUpward] = useState(false);

    const selectedOptions = React.useMemo(
      () => options.filter((option) => value?.indexOf(option.id) !== -1),
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
    }, [isOpen]);

    useEffect(() => {
      if (searchable && isOpen && inputRef.current !== null) {
        inputRef.current.focus();
      }
    }, [isOpen, searchable]);

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

    const handleOptionClick = React.useCallback(
      (option: SelectOption): void => {
        onChange?.(option);
        // setIsOpen(false);
        setSearchValue("");
      },
      [onChange],
    );

    const handleSearchChange = React.useCallback(
      (e: React.ChangeEvent<HTMLInputElement>): void => {
        setSearchValue(e.target.value);
        onSearchChange?.(e.target.value);
      },
      [onSearchChange],
    );

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
              "ring-2 ring-[color:var(--primitives-system-colors-ice-blue)]",
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
            {isShowCountOptions && selectedOptions.length !== 0 ? (
              selectedOptions.length === 1 ? (
                selectedOptions[0].name
              ) : selectedOptions.length === options.length ? (
                "All"
              ) : (
                selectedOptions.length
              )
            ) : (
              <div className="gap-1 flex flex-wrap items-center">
                {selectedOptions.length > 0 ? (
                  <>
                    {selectedOptions.map((option) => {
                      return (
                        <div
                          key={option.id}
                          style={{
                            backgroundColor: option?.color?.background,
                          }}
                          className={cn(
                            "gap-1 pt-1 pl-3 pr-2 pb-1 flex items-center rounded-full bg-tokens-badges-tags-gray-bg",
                          )}
                        >
                          {option?.color?.sideline !== undefined && (
                            <div
                              className="w-2 h-2 rounded-full"
                              style={{
                                backgroundColor: option?.color?.sideline,
                              }}
                            ></div>
                          )}
                          <span className="typo-body-medium-16">
                            {option.name}
                          </span>
                          <span
                            className="material-icons-outlined text-tokens-icons-default"
                            style={{ fontSize: 16 }}
                            onClick={(e) => {
                              e.stopPropagation();
                              onRemove?.(option);
                            }}
                          >
                            close
                          </span>
                        </div>
                      );
                    })}
                  </>
                ) : (
                  <span className={"text-tokens-text-secondary-text"}>
                    {placeholder}
                  </span>
                )}
              </div>
            )}
          </div>
          <div className="gap-2 flex items-center">
            {selectedOptions.length !== 0 && isShowClearBtn && (
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
                    onChange={handleSearchChange}
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
                      className={cn(
                        SELECT_CLASSNAMES.option,
                        value?.indexOf(option.id) !== -1 &&
                          SELECT_CLASSNAMES.optionSelected,
                      )}
                      onClick={() => {
                        handleOptionClick(option);
                      }}
                    >
                      {renderOption !== undefined ? (
                        renderOption(option)
                      ) : (
                        <span>{option.name}</span>
                      )}
                      {value?.indexOf(option.id) !== -1 && (
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

MultiSelect.displayName = "MultiSelect";
