/**
 * Options to provide for pagination calculation.
 */
type IOptions = {
  page?: number; // Current page number (default: 1)
  limit?: number; // Number of items per page (default: 10)
  sortBy?: string; // Field to sort by (default: 'createdAt')
  sortOrder?: string; // Sort direction: 'asc' or 'desc' (default: 'desc')
};

/**
 * Result object after calculating pagination parameters.
 */
type IOptionsResult = {
  page: number; // Current page number
  limit: number; // Items per page
  skip: number; // Number of items to skip (for offset-based pagination)
  sortBy: string; // Field used for sorting
  sortOrder: string; // Sorting direction
};

/**
 * Calculates pagination parameters from user options,
 * providing defaults if any option is missing.
 *
 * @param options - Pagination options to use.
 * @returns Object with pagination info: page, limit, skip, sortBy, sortOrder.
 *
 * @example
 * calculatePagination({ page: 2, limit: 5, sortBy: 'name', sortOrder: 'asc' })
 * // returns: { page: 2, limit: 5, skip: 5, sortBy: 'name', sortOrder: 'asc' }
 */
const calculatePagination = (options: IOptions): IOptionsResult => {
  const page = Number(options.page || 1);
  const limit = Number(options.limit || 10);
  const skip = (page - 1) * limit;

  const sortBy = options.sortBy || "createdAt";
  const sortOrder = options.sortOrder || "desc";

  return {
    page,
    limit,
    skip,
    sortBy,
    sortOrder,
  };
};

export const paginationHelpers = {
  calculatePagination,
};
