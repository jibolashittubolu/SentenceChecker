import { NextFunction, Request, Response } from "express";


export interface IFastApiReqBodySentenceChecker {
    text: string,
    [key: string] : any
}


export interface ISentenceCheckerController {
    // checkSentence: 
    //     (catchAsync: 
    //         (req: Request, res:Response, next: NextFunction) => any
    //     )
    //  => any;
    // checkSentence: 
    //     (
    //         fn: (req: Request, res:Response, next: NextFunction) 
    //             => any
    //     )
    // => any;
    checkSentence: (req: Request, res: Response, next: NextFunction) => void;
  }

export interface ISentenceCheckerService {
    checkSentence(params: {
      // data: Record<string, any>
      data: IFastApiReqBodySentenceChecker
    }): any
    sendSentenceToFastApi(params: {
        data: IFastApiReqBodySentenceChecker
    }): any
}
  


export type FastApiTextCorrectionsSentenceChecker = {
    incorrect: string,
    correction: string,
    start_index: number,
    end_index: number
    [key: string] : any

}
export interface IFastApiResBodySentenceChecker {
    correctedText: string,
    corrections: FastApiTextCorrectionsSentenceChecker[],
    originalText: string,
    [key: string] : any
}
  