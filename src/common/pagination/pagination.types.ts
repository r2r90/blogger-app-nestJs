export class PaginationInputType {
  searchNameTerm?: string;
  searchLoginTerm?: string;
  searchEmailTerm?: string;
  sortBy?: 'created_at' | 'blogName' | null;
  sortDirection?: 'asc' | 'desc';
  filter?: string;
  pageNumber?: number;
  pageSize?: number;
}

export type PaginationType<I> = {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: I[];
};
