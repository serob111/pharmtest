import type { JSX } from "react";
import { Button } from "../shared/ui/Button/Button";
import { Select } from "../shared/ui/select";

type PaginationTableProps = {
  limit: number;
  total: number;
  offset: number;
  setLimit: (limit: number) => void;
  setOffset: (offset: number) => void;
};

export const PaginationTable = ({
  limit,
  total,
  offset,
  setLimit,
  setOffset,
}: PaginationTableProps): JSX.Element => {
  const safeLimit = Math.max(1, limit || 1);
  const totalPages = Math.max(1, Math.ceil(total / safeLimit));
  const currentPage = Math.min(
    totalPages,
    Math.max(1, Math.floor(offset / safeLimit) + 1)
  );

  const handlePageChange = (page: number): void => {
    const clamped = Math.min(totalPages, Math.max(1, page));
    setOffset((clamped - 1) * safeLimit);
  };


  const getPageItems = (
    curr: number,
    totalPgs: number
  ): Array<number | "..."> => {
    const maxNumbers = 5;

    if (totalPgs <= maxNumbers) {
      return Array.from({ length: totalPgs }, (_, i) => i + 1);
    }

    const leftEllipsis = curr > 3; 
    const rightEllipsis = curr < totalPgs - 2; 

    if (!leftEllipsis && rightEllipsis) {
      return [1, 2, 3, 4, "...", totalPgs];
    }

    if (leftEllipsis && !rightEllipsis) {
      return [1, "...", totalPgs - 3, totalPgs - 2, totalPgs - 1, totalPgs];
    }

    return [1, "...", curr - 1, curr, curr + 1, "...", totalPgs];
  };

  const pageItems = Array.from(
    new Set(getPageItems(currentPage, totalPages))
  );

  const startRow = total === 0 ? 0 : offset + 1;
  const endRow = Math.min(offset + safeLimit, total);

  return (
    <div className="pt-3 px-6 pb-4 rounded-b-2xl flex items-center justify-between ">
      <div className="gap-4 flex items-center">
        <p className="typo-bodyxsall-regular-14 text-tokens-text-secondary-text-2">
          Rows per Page
        </p>
        <div>
          <Select
            options={[
              { id: 10, name: "10" },
              { id: 25, name: "25" },
              { id: 50, name: "50" },
              { id: 100, name: "100" },
            ]}
            value={safeLimit}
            onChange={(e) => {
              const nextLimit = Number(e?.id) || 10;
              setLimit(nextLimit);
              setOffset(0);
            }}
            isHideIconCheck
          />
        </div>
        <p className="typo-body-small-regular-14 text-tokens-text-secondary-text-2">
          {startRow}-{endRow} of {total}
        </p>
      </div>

      <div className="gap-2 flex items-center">
        <Button
          variant="outline"
          icon="chevron_left"
          iconSize={20}
          size="xs"
          disabled={currentPage === 1}
          onClick={() => handlePageChange(currentPage - 1)}
        />

        {pageItems.map((item, idx) =>
          item === "..." ? (
            <Button
              key={`ellipsis-${idx}`}
              title="…"
              variant="outline"
              size="xs"
              disabled
            />
          ) : (
            <Button
              key={`page-${item}`}
              title={item.toString()}
              variant={item === currentPage ? "primary" : "outline"}
              size="xs"
              onClick={() => handlePageChange(item as number)}
            />
          )
        )}

        <Button
          variant="outline"
          icon="chevron_right"
          iconSize={20}
          size="xs"
          disabled={currentPage === totalPages || total === 0}
          onClick={() => handlePageChange(currentPage + 1)}
        />
      </div>
    </div>
  );
};
