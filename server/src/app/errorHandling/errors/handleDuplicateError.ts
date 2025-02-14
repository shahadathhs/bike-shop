import { IErrorResponse, IErrorSource, IMongooseError } from '../../interface/error'

const handleDuplicateError = (err: IMongooseError): IErrorResponse => {
  // Extract field name and value causing the duplicate error
  const field = Object.keys(err.keyValue || {})[0]
  const value = err.keyValue ? err.keyValue[field] : 'unknown value'

  const errorSources: IErrorSource[] = [
    {
      path: field || 'unknown',
      message: `The value '${value}' already exists for the field '${field}'.`
    }
  ]

  const statusCode = 400

  return {
    statusCode,
    message: 'Duplicate value error.',
    errorSources
  }
}

export default handleDuplicateError
