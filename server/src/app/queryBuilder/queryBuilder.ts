import { Query } from 'mongoose'

export interface RangeFilter {
  fieldName: string
  min: number | undefined
  max: number | undefined
}

export interface FieldFilter {
  fieldName: string
  searchTerm: string
}

export type QueryParams = {
  searchTerm?: string
  page?: number
  limit?: number
  fields?: string[]
  rangeFilters?: RangeFilter[]
  fieldFilters?: FieldFilter[]
}

export class QueryBuilder<T> {
  public query: Query<T[], T>
  public queryParams: QueryParams

  constructor(query: Query<T[], T>, queryParams: QueryParams) {
    this.query = query
    this.queryParams = queryParams
  }

  /**
   * Searches the specified fields using a case-insensitive regex.
   * @param fields - Array of field names to search.
   * @param searchTerm - The term to search for.
   */
  search(fields: string[], searchTerm?: string): this {
    if (searchTerm) {
      const regex = { $regex: searchTerm, $options: 'i' }
      // Create an $or query for each field provided
      this.query = this.query.find({
        $or: fields.map(field => ({ [field]: regex }))
      })
    }
    return this
  }

  /**
   * Filters documents by numeric ranges.
   * @param filters - Array of range filters.
   */
  filterByRange(filters: RangeFilter[]): this {
    filters.forEach(filter => {
      // Only add the filter if at least one bound is defined
      if (filter.min !== undefined || filter.max !== undefined) {
        const rangeQuery: { $gte?: number; $lte?: number } = {}
        if (filter.min !== undefined) {
          rangeQuery.$gte = filter.min
        }
        if (filter.max !== undefined) {
          rangeQuery.$lte = filter.max
        }
        this.query = this.query.find({ [filter.fieldName]: rangeQuery })
      }
    })
    return this
  }

  /**
   * Filters documents by specific fields using a search term.
   * @param filters - Array of field filters.
   */
  filterByFields(filters: FieldFilter[]): this {
    filters.forEach(filter => {
      if (filter.searchTerm) {
        this.query = this.query.find({
          [filter.fieldName]: { $regex: filter.searchTerm, $options: 'i' }
        })
      }
    })
    return this
  }

  /**
   * Applies pagination based on the query parameters.
   * @param currentPage - The current page number.
   * @param itemsPerPage - The number of items per page.
   */
  paginate(currentPage: number = 1, itemsPerPage: number = 10): this {
    const page = Number(this.queryParams.page) || currentPage
    const limit = Number(this.queryParams.limit) || itemsPerPage
    const skip = (page - 1) * limit

    this.query = this.query.skip(skip).limit(limit)
    return this
  }
}
