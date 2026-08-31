import type { DataTableColumn } from "mantine-datatable";

export type CommonTableProps = {
  data: any[];
  columns: DataTableColumn[];
  defaultSortName: string;
};
