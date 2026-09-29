import type { CommonTableProps } from "./table.types.ts";
import { DataTable, type DataTableSortStatus } from "mantine-datatable";
import { useState } from "react";

const PAGE_SIZE = 15;

export default function ViewTable({
  data,
  columns,
  defaultSortName,
}: CommonTableProps) {
  const [page, setPage] = useState(1);

  const [sortStatus, setSortStatus] = useState<DataTableSortStatus<any>>({
    columnAccessor: defaultSortName,
    direction: "asc",
  });

  const sortedData = [...data].sort((a, b) => {
    const { columnAccessor, direction } = sortStatus;
    const aValue = a[columnAccessor];
    const bValue = b[columnAccessor];

    if (typeof aValue === "number" && typeof bValue === "number") {
      return direction === "asc" ? aValue - bValue : bValue - aValue;
    }

    return direction === "asc"
      ? String(aValue).localeCompare(String(bValue))
      : String(bValue).localeCompare(String(aValue));
  });

  const paginatedData = sortedData.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE,
  );

  return (
    <DataTable
      height="100%"
      withTableBorder
      withColumnBorders
      striped
      records={paginatedData}
      columns={columns}
      totalRecords={data.length}
      recordsPerPage={PAGE_SIZE}
      page={page}
      onPageChange={setPage}
      sortStatus={sortStatus}
      onSortStatusChange={setSortStatus}
    />
  );
}
