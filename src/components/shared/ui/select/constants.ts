export const SELECT_CLASSNAMES = {
  wrapper: "relative w-full",
  trigger:
    "rounded-md min-h-11.5 text-start ease-in-out border-input focus-visible:border-stroke-blue  px-3 py-0.5 typo-body-regular-16 file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground md:text-sm flex w-full cursor-pointer items-center justify-between border bg-transparent transition-all duration-300 focus-visible:ring-2 focus-visible:ring-[color:var(--primitives-system-colors-ice-blue)] focus-visible:outline-none",
  triggerDisabled:
    "hover:border-input bg-tokens-background-light-gray text-tokens-text-secondary-text cursor-not-allowed",
  triggerError:
    "hover:border-system-colors-dark-red border-[color:var(--primitives-system-colors-dark-red)] focus-visible:ring-0",
  triggerDefault: "border-input hover:border-stroke-blue ",
  chevron:
    "flex rotate-360 items-center justify-center text-tokens-icons-default transition-transform duration-300",
  chevronOpen: " rotate-180 ",
  chevronDisabled: "opacity-30",
  dropdown:
    "absolute z-[9999] w-full p-2 border-1 border-tokens-stroke-gray mt-1 bg-white border rounded-[8px] max-h-[300px] overflow-hidden top-[calc(100%+2px)] left-0",
  searchWrapper: "sticky top-0 p-2 bg-white  w-full",
  searchIconWrapper: "relative flex items-center justify-center",
  searchInput: "w-full pl-2 text-sm bg-transparent outline-none",
  optionsList:
    "overflow-auto max-h-[200px] flex flex-col gap-1 [&::-webkit-scrollbar]:w-[6px] [&::-webkit-scrollbar]:h-[70px] [&::-webkit-scrollbar-thumb]:bg-tokens-stroke-dark [&::-webkit-scrollbar-thumb]:rounded-[3px] [&::-webkit-scrollbar-track]:bg-transparent",
  option:
    "flex items-center  justify-between px-2 py-1.5 cursor-pointer hover:bg-tokens-background-light-gray-2 rounded-[8px] text-tokens-text-secondary-text-2 hover:text-tokens-text-blue typo-body-small-medium-14",
  optionSelected: "bg-tokens-background-light-gray text-tokens-text-blue",
  optionIcon: "h-4 w-4 text-[color:var(--tokens-text-main-text)]",
  noOptions: "px-2 py-1.5 text-muted-foreground text-sm",
  dropdownUpward: "bottom-[calc(100%+2px)] top-auto",
} as const;
