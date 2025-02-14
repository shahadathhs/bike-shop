import { Query } from 'mongoose'

export type queryParams = {
  searchTerm?: string
  [key: string]: unknown
}

export class QueryBuilder<T> {
  public query: Query<T[], T>
  public queryParams: queryParams

  constructor(query: Query<T[], T>, queryParams: queryParams) {
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

  filter(filters: {
    range?: Array<{
      fieldName: string
      min?: number
      max?: number
    }>
    fields?: Array<{
      fieldName: string
      searchTerm?: string
    }>
  }): this {
    if (!filters) return this

    // * filtering by a field's numeric range
    if (filters.range) {
      const { range } = filters
      range.forEach(field => {
        if (field.min || field.max) {
          this.query = this.query.find({
            [field.fieldName]: {
              $gte: field.min || 0,
              $lte: field.max || Infinity
            }
          })
        }
      })
    }

    // * filtering by a field's value / searchTerm
    if (filters.fields) {
      const { fields } = filters
      fields.forEach(field => {
        if (field.searchTerm) {
          this.query = this.query.find({
            [field.fieldName]: { $regex: field.searchTerm, $options: 'i' }
          })
        }
      })
    }

    return this
  }
  /**
   * Applies pagination based on the query parameters.
   * @param defaultLimit - The default number of results per page.
   */
  paginate(defaultLimit: number = 10): this {
    const page = Number(this.queryParams.page) || 1
    const limit = Number(this.queryParams.limit) || defaultLimit
    const skip = (page - 1) * limit

    this.query = this.query.skip(skip).limit(limit)
    return this
  }
}
