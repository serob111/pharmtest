import type { Ref } from "react";

import type { SelectOption } from "./types";

export const findSelectedOption = (
  options: SelectOption[],
  value?: string | number,
): SelectOption | undefined => {
  return options?.find((option) => option.id === value);
};

export const filterOptions = (
  options: SelectOption[],
  searchValue: string,
): SelectOption[] => {
  return options.filter((option) =>
    option.name?.toLowerCase().includes(searchValue.toLowerCase()),
  );
};

export const mergeRefs = <T>(refs: Array<Ref<T>>): Ref<T> => {
  return (value: T | null) => {
    refs.forEach((ref) => {
      if (typeof ref === "function") {
        ref(value);
      } else if (ref !== null) {
        (ref as React.MutableRefObject<T | null>).current = value;
      }
    });
  };
};
