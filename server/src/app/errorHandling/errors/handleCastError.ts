import mongoose from 'mongoose'

import { IErrorResponse, IErrorSource } from '../../interface/error'

const handleCastError = (error: mongoose.Error.CastError): IErrorResponse => {
  const errorSources: IErrorSource[] = [
    {
      path: error.path,
      message: `Invalid value for the field '${error.path}'. Expected a valid ${error.kind}.`
    }
  ]

  const statusCode = 400

  return {
    statusCode,
    message: 'Invalid input data.',
    errorSources
  }
}

export default handleCastError
