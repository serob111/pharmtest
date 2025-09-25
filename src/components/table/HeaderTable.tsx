import type { JSX } from "react";
import { cn } from "../../lib/utils";
import { IconMaterial } from "../shared/iconMaterial/IconMaterial";


export type Column = {
  id: string;
  label: string;
  icon?: string | undefined;
  onclick?: () => void;
  style?: React.CSSProperties;
};

export const HeaderTable = ({
  columns,
}: {
  columns: Column[];
  clickIconFullName?: () => void;
}): JSX.Element => {
  return (
    <thead className="rounded-2xl bg-background-light-gray">
      <tr>
        {columns.map((column, index) => (
          <th
            key={column.id}
            style={column.style}
            className={cn(
              "p-[12px] text-xs text-left align-middle",
              "whitespace-nowrap text-ellipsis overflow-hidden",
              "max-w-[150px]", 
              index === 0 && "rounded-l-2xl",
              index === columns.length - 1 && "rounded-r-2xl"
            )}
          >
            <div className="gap-2 flex items-center text-secondary-extralight min-w-0">
              <p title={column.label} className="truncate">{column.label}</p>
              {column.icon && (
                <IconMaterial
                  filled
                  icon={column.icon}
                  className="cursor-pointer shrink-0"
                  size={20}
                  iconColor="var(--tokens-text-secondary-text)"
                  onClick={column?.onclick}
                />
              )}
            </div>
          </th>
        ))}
      </tr>
    </thead>

  );
};
