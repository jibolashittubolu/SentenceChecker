/* eslint-disable @typescript-eslint/no-explicit-any */
import Joi from "joi";
import { IFastApiReqBodySentenceChecker } from "./sentenceChecker.interface";
  
  const options = {
    stripUnknown: true,
    abortEarly: false,
    errors: {
      wrap: {
        label: ""
      }
    }
  };
  
  
  export function validateFastApiReqBody(regData: IFastApiReqBodySentenceChecker) {
    const data = Joi.object<IFastApiReqBodySentenceChecker>({
      text: Joi.string().required(),
    });
  
    return data.validate(regData, options);
  }
 