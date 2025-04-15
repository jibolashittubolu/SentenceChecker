/* eslint-disable @typescript-eslint/no-explicit-any */
export { };



declare global {
  // Database Interfaces
  interface db_Err {
    httpCode: HttpStatusCode,
    meta?: any,
    isOperational: boolean
  }
  interface ORM_Error {
    checkType(): db_Err | undefined
  }

}
