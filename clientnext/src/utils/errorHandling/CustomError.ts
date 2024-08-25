
class CustomError extends Error {
  public customCode: number;
  public customMessage: string;
  public customType: string;
  public others: any;


  constructor(
    params :{
        message?: string,
        customCode?: number, 
        customMessage?: string, 
        customType?:string, 
        others?:any 
    }) {
    super(params.message || "A custom error occurred");

    this.name = this.constructor.name; // Set the error name to the class name
    this.customCode = params.customCode || 666;
    this.customMessage = params.customMessage || "An error occurred";
    // this.status = `${httpCode}`.startsWith("4") ? "failed" : "error";
    this.customType = params.customType || "CustomError" ;
    this.others = params.others || {}

    Error.captureStackTrace(this, this.constructor);
  }
}

export default CustomError;
