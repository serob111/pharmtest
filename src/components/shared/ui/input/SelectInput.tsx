import React, { forwardRef, SelectHTMLAttributes, useState, useRef, useEffect, useMemo } from 'react';
import { IconMaterial } from '../../iconMaterial/IconMaterial';

export interface SelectInputProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'size' | 'multiple' | 'value' | 'onChange'> {
    label?: string;
    labelClass?: string;
    placeholder?: string;
    required?: boolean;
    options: Array<{
        id: string | number;
        slug?: string;
        label?: string;
        name?: string;
        name_ru?: string;
    }>;
    helpText?: string;
    error?: string;
    success?: boolean;
    important?: boolean;
    size?: 'sm' | 'md' | 'lg' | 'default';
    variant?: 'default' | 'filled' | 'outlined';
    className?: string;
    multiSelect?: boolean;
    searchable?: boolean;
    searchPlaceholder?: string;
    noResultsText?: string;
    value?: number | string | string[] | null;
    onChange?: (value: string | string[] | number | null) => void;
    maxSelections?: number;
}

const SelectInput = forwardRef<HTMLSelectElement, SelectInputProps>(({
    label,
    labelClass = 'text-secondary-dark',
    required = false,
    important = false,
    placeholder,
    options,
    helpText,
    error,
    success,
    size = 'default',
    variant = 'default',
    className = '',
    disabled = false,
    multiSelect = false,
    searchable = false,
    searchPlaceholder = 'Search options...',
    noResultsText = 'No options found',
    value,
    onChange,
    maxSelections,
    ...props
}, ref) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [focusedIndex, setFocusedIndex] = useState(-1);
    const [selectedValues, setSelectedValues] = useState<string[]>(
        multiSelect
            ? (Array.isArray(value) ? value : [])
            : (value ? [value as string] : [])
    );

    const dropdownRef = useRef<HTMLDivElement>(null);
    const searchInputRef = useRef<HTMLInputElement>(null);
    const optionRefs = useRef<(HTMLButtonElement | null)[]>([]);

    useEffect(() => {
        if (multiSelect) {
            setSelectedValues(Array.isArray(value) ? value : []);
        } else {
            setSelectedValues(value ? [value as string] : []);
        }
    }, [value, multiSelect]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
                setSearchQuery('');
                setFocusedIndex(-1);
                setIsFocused(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const filteredOptions = useMemo(() => {
        if (!searchQuery.trim()) return options;

        return options.filter(option => {
            const searchableText = (option.label || option.name || '').toLowerCase();
            return searchableText.includes(searchQuery.toLowerCase());
        });
    }, [options, searchQuery]);

    const sizeClasses = {
        sm: 'px-3 py-2 text-xs w-[200px] h-[44px]',
        md: 'px-4 py-2 text-md w-[244px] h-[44px]',
        lg: 'px-4 py-3 text-sm w-[520px] h-auto',
        default: "w-full px-4 py-2 text-md h-[44px]"
    };

    const getSelectClasses = () => {
        const baseClasses = `
            rounded-lg inline-flex justify-start items-center gap-2 transition-all duration-200
            ${sizeClasses[size]}
        `;

        const stateClasses = error
            ? 'outline outline-1 outline-offset-[-1px] outline-red-500 '
            : success
                ? 'outline outline-1 outline-offset-[-1px] outline-green-500 '
                : (isFocused || isOpen)
                    ? 'outline outline-2 outline-offset-[-1px] outline-blue-500 bg-white'
                    : 'outline outline-1 outline-offset-[-1px] outline-gray-300 bg-white';

        const disabledClasses = disabled
            ? 'opacity-50 cursor-not-allowed bg-gray-100'
            : 'cursor-pointer';

        return `${baseClasses} ${stateClasses} ${disabledClasses}`;
    };

    const getLabelClasses = () => {
        const baseClasses = 'font-medium leading-snug';
        const sizeClasses = {
            sm: 'text-xs',
            md: 'text-sm',
            lg: 'text-base',
            default: 'text-sm'
        };
        return `${baseClasses} ${sizeClasses[size]} ${labelClass}`;
    };

    const getHelpTextClasses = () => {
        const baseClasses = 'leading-snug';
        const sizeClasses = {
            sm: 'text-xs',
            md: 'text-sm',
            lg: 'text-base',
            default: 'text-base'
        };

        if (error) {
            return `${baseClasses} text-sm text-red-600`;
        }
        if (success) {
            return `${baseClasses} ${sizeClasses[size]} text-green-600`;
        }
        return `${baseClasses} ${sizeClasses[size]} text-secondary`;
    };

    const handleOptionClick = (optionId: string) => {
        if (disabled) return;

        if (multiSelect) {
            let newSelectedValues: string[];

            if (selectedValues.includes(optionId)) {
                newSelectedValues = selectedValues.filter(id => id !== optionId);
            } else {
                if (maxSelections && selectedValues.length >= maxSelections) {
                    return;
                }
                newSelectedValues = [...selectedValues, optionId];
            }

            setSelectedValues(newSelectedValues);
            onChange?.(newSelectedValues);
        } else {
            setSelectedValues([optionId]);
            onChange?.(optionId);
            setIsOpen(false);
            setSearchQuery('');
            setFocusedIndex(-1);
            setIsFocused(false);
        }
    };

    const removeSelection = (optionId: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (disabled) return;

        const newSelectedValues = selectedValues.filter(id => id !== optionId);
        setSelectedValues(newSelectedValues);
        onChange?.(multiSelect ? newSelectedValues : '');
    };

    const getSelectedOptions = () => {
        return options.filter(option => selectedValues.includes(option.id.toString()));
    };

    const getDisplayText = () => {
        const selected = getSelectedOptions();

        if (selected.length === 0) {
            return placeholder || 'Select...';
        }

        if (multiSelect) {
            if (selected.length === 1) {
                return selected[0].label || selected[0].name;
            }
            return `${selected.length} selected`;
        }

        return selected[0]?.label || selected[0]?.name;
    };

    const isSelected = (optionId: string) => {
        return selectedValues.includes(optionId);
    };

    const handleDropdownToggle = () => {
        if (!disabled) {
            setIsOpen(!isOpen);
            setIsFocused(!isOpen);
            if (!isOpen) {
                setSearchQuery('');
                setFocusedIndex(-1);
            }
        }
    };

    if (!multiSelect && !searchable) {
        return (
            <div className={`w-full inline-flex flex-col justify-start items-start gap-3 ${className}`}>
                {label && (
                    <div className="w-full inline-flex justify-start items-center gap-1">
                        <div className={getLabelClasses()}>
                            {label}
                            {important && <span className="text-red-500 ml-1">*</span>}
                        </div>
                    </div>
                )}

                <div className="relative w-full">
                    <select
                        ref={ref}
                        className={`${getSelectClasses()} appearance-none text-secondary-strong`}
                        disabled={disabled}
                        value={selectedValues[0] || ''}
                        onChange={(e) => {
                            const newValue = e.target.value;
                            setSelectedValues(newValue ? [newValue] : []);
                            onChange?.(newValue);
                        }}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        {...props}
                    >
                        {placeholder && (
                            <option value="" disabled hidden>
                                {placeholder}
                            </option>
                        )}

                        {options.map((option) => (
                            <option key={option.id} value={option.id}>
                                {option.label || option.name}
                            </option>
                        ))}
                    </select>

                    <div className="absolute top-1/2 right-3 -translate-y-1/2 pointer-events-none text-secondary">
                        <IconMaterial
                            className='mt-1'
                            filled
                            icon='expand_more'
                            size={12}
                        />
                    </div>
                </div>

                {(helpText || error) && (
                    <div className={getHelpTextClasses()}>
                        {error || helpText}
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className={`w-full inline-flex flex-col justify-start items-start gap-3 ${className}`} ref={dropdownRef}>
            {label && (
                <div className="w-full inline-flex justify-start items-center gap-1">
                    <div className={getLabelClasses()}>
                        {label}
                        {important && <span className="text-red-500 ml-1">*</span>}
                    </div>
                </div>
            )}

            <div className="relative w-full">
                <button
                    type="button"
                    onClick={handleDropdownToggle}
                    className={getSelectClasses()}
                    disabled={disabled}
                >
                    <div className="flex-1 flex items-center gap-2 min-h-0">
                        {selectedValues.length > 0 ? (
                            <div className="flex flex-wrap gap-1 flex-1">
                                {multiSelect ? (
                                    getSelectedOptions().map((option) => (
                                        <div
                                            key={option.id}
                                            className="inline-flex items-center gap-1 bg-blue-50 text-blue-900 px-2 py-1 rounded-md text-xs font-medium"
                                        >
                                            <span>{option.label || option.name}</span>
                                            <button
                                                type="button"
                                                onClick={(e) => removeSelection(option.id.toString(), e)}
                                                className="hover:bg-blue-100 rounded-full p-0.5 transition-colors"
                                            >
                                                <IconMaterial
                                                    className='mt-1'
                                                    filled
                                                    icon='close'
                                                    size={12}
                                                    iconColor="var(--tokens-text-secondary-text)"
                                                />
                                            </button>
                                        </div>
                                    ))
                                ) : (
                                    <span className="text-secondary-strong leading-snug">
                                        {getDisplayText()}
                                    </span>
                                )}
                            </div>
                        ) : (
                            <span className="text-secondary leading-snug">
                                {placeholder || 'Select...'}
                            </span>
                        )}
                    </div>

                    <div className="text-secondary flex-shrink-0">
                        <IconMaterial
                            filled
                            icon='expand_more'
                            size={18}
                            className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                        />
                    </div>
                </button>

                {isOpen && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-50 max-h-60 overflow-hidden">
                        {searchable && (
                            <div className="p-3 border-b border-gray-200">
                                <div className="relative">
                                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary">
                                        <IconMaterial
                                            className='mt-1'
                                            filled
                                            icon='search'
                                            size={12}
                                            iconColor="var(--tokens-text-secondary-text)"
                                        />
                                    </div>
                                    <input
                                        ref={searchInputRef}
                                        type="text"
                                        placeholder={searchPlaceholder}
                                        value={searchQuery}
                                        onChange={(e) => {
                                            setSearchQuery(e.target.value);
                                            setFocusedIndex(-1);
                                        }}
                                        className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-secondary-strong placeholder:text-secondary"
                                        onClick={(e) => e.stopPropagation()}
                                    />
                                </div>
                            </div>
                        )}

                        <div className="max-h-48 overflow-y-auto">
                            {filteredOptions.length > 0 ? (
                                filteredOptions.map((option, index) => {
                                    const isOptionSelected = isSelected(option.id.toString());
                                    const isFocused = index === focusedIndex;
                                    const isDisabled = !isOptionSelected && maxSelections && selectedValues.length >= maxSelections;

                                    return (
                                        <button
                                            key={option.id}
                                            ref={(el) => (optionRefs.current[index] = el)}
                                            type="button"
                                            onClick={() => handleOptionClick(option.id.toString())}
                                            className={`w-full px-4 py-3 flex items-center gap-3 transition-colors text-left ${isOptionSelected
                                                ? 'bg-blue-50 text-blue-900 font-medium'
                                                : isFocused
                                                    ? 'bg-gray-50 text-secondary-strong'
                                                    : 'text-secondary-strong hover:bg-gray-50'
                                                } ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                                        >
                                            <span className="text-sm leading-snug">
                                                {option.label || option.name || option.name_ru}
                                            </span>
                                            {isOptionSelected && (
                                                <div className="ml-auto text-blue-600">
                                                    ✓
                                                </div>
                                            )}
                                        </button>
                                    );
                                })
                            ) : (
                                <div className="px-4 py-8 text-center text-secondary text-sm">
                                    {noResultsText}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {(helpText || error) && (
                <div className={getHelpTextClasses()}>
                    {error || helpText}
                </div>
            )}
        </div>
    );
});

SelectInput.displayName = 'SelectInput';

export default SelectInput;