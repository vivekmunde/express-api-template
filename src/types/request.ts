/**
 * Auto-generated. Do not edit manually.
 * Source: az-api-types/types
 * Run `yarn populate:api-types` to regenerate.
 * Manual changes will be overwritten.
 */

/**
 * Request list parameters for pagination and sorting.
 * @template TSortBy - Type of the sortBy field.
 */
export type TRequestListParams<
  TSortField extends string,
  TSearchField extends string,
  TFilterField extends string,
> = {
  /** Page number for pagination. */
  page: number;
  /** Page size for pagination. */
  size: number;
  /** Sort by field. */
  sortBy?: TSortField;
  /** Sort order. */
  sortOrder?: "asc" | "desc";
  /** Search value. */
  search?: string;
  /** Search by field. */
  searchBy?: Record<TSearchField, string>;
  /** Filter by field. */
  filterBy?: Record<TFilterField, string>;
};
