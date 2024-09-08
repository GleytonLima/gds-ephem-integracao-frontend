export interface SortParam {
  field: string;
  sort: "asc" | "desc";
}

export interface QueryParam {
  field?: string | number;
  value: string;
}
