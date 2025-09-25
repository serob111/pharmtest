import type { ReactNode } from "react";

export type SelectOption = {
  id: number | string;
  name: string;
  color?: {
    background: string;
    stroke: string;
    sideline: string;
  };
};

export type SelectProps = {
  value?: string | number;
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
  isShowClearBtn?: boolean;
  isHideIconCheck?: boolean;
  autoScrollToSelected?: boolean;
  isShowCountOptions?: boolean;
  onChange?: (option: SelectOption) => void;
  onSearchChange?: (value: string) => void;
  onScrollEnd?: () => void;
  onClear?: () => void;
  renderOption?: (option: SelectOption) => ReactNode;
};
