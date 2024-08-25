import { NextFunction, Request, Response } from "express";

import { AppError, catchAsync, HttpStatusCode, successResponse } from "../../../utils";
import sentenceCheckerService from "./sentenceChecker.service";
import { ISentenceCheckerController, ISentenceCheckerService } from "./sentenceChecker.interface";
import { validateFastApiReqBody } from "./sentenceChecker.schema";


class SentenceCheckerController implements ISentenceCheckerController {
    private service: ISentenceCheckerService;
  
    constructor(service: ISentenceCheckerService) {
      this.service = service;
    }
  
    // check sentence
    public checkSentence = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
      // Run authorization check
  
      // Validate the order data from the request body
      // const { error, value } = validateNewWalletData(req.body);
  
      // if (error) {
      //   throw new AppError(HttpStatusCode.VALIDATION_ERROR, error.message);
      // }
      // console.log(req.body)

      const {
        error: errorWithFastApiReqBodyValidation,
        value
      } = validateFastApiReqBody(req.body);
      if(errorWithFastApiReqBodyValidation){
        // console.log("hello");
        throw new AppError(HttpStatusCode.VALIDATION_ERROR, errorWithFastApiReqBodyValidation.message);
      }

  
      const checkedSentence = await this.service.checkSentence({
        data: value
      });
      // console.log(checkedSentence);

      return successResponse(res, HttpStatusCode.OK, "Sentence checked and corrected successfully", checkedSentence);
    });
  

  }
  
const sentenceCheckerController = new SentenceCheckerController(sentenceCheckerService);
export default sentenceCheckerController;
  