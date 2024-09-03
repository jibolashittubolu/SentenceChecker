/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
// import { User } from "@prisma/client";
// import { Wallet, WalletTransaction } from "@prisma/client";
import axios from "axios";
import {
  AppError,
  axiosFunctions,
  HttpStatusCode,
  logger
} from "../../../utils";
import { IFastApiReqBodySentenceChecker, ISentenceCheckerService } from "./sentenceChecker.interface";
// import WalletRepository from "./wallet.repository";



class SentenceCheckerService implements ISentenceCheckerService {
  // private repo: WalletRepositoryInterface;

  // constructor(repository: WalletRepositoryInterface) {
  //   this.repo = repository;
  // }
  constructor() {
      // this.repo = repository;
  }

  // CREATE WALLET
  public async checkSentence({
    data
  } : {data: IFastApiReqBodySentenceChecker}) {
    // console.log(data)


    const checkedSentence = await this.sendSentenceToFastApi({
      data: data
    })

    return checkedSentence;
  }

  public async sendSentenceToFastApi({
    data
  }: {data: IFastApiReqBodySentenceChecker}){
    try{
      const result = await axiosFunctions.axiosPost({
        url: process.env.FAST_API_SENTENCE_CHECKER_URL as string,
        body: data,
      })

      // console.log(result.data);

      return result.data
      // return result
    }
    catch(error: any){
      // logger.debug(
      //   err?.message,
      //   err
      // );
      // logger.info(
      //   err?.message,
      //   err
      // );
      console.log("error occurred")
      // console.log(err)
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        const status = error?.response?.status;
        const message = error?.response?.data?.detail || 'An error occurred';
  
        if (status >= 400 && status < 500) {
          console.error(`Client Error (${status}): ${message}. Please check your request data.`);
          throw new AppError(HttpStatusCode.BAD_REQUEST,`Client Error (${status}): ${message}. Please check your request data.`);

        } 
        else if (status >= 500) {
          console.error(`Server Error (${status}): ${message}. Please try again later.`);
          throw new AppError(HttpStatusCode.INTERNAL_SERVER,`Server Error (${status}): ${message}. Please try again later.`);

        }
      } 
      else if (error.request) {
        // The request was made but no response was received
        console.error('Network Error: Unable to reach the upstream server. ');
        throw new AppError(HttpStatusCode.INTERNAL_SERVER, "Internal Server Error. Unable to reach the upstream server.");

      } 
      else {
        // Something happened in setting up the request that triggered an Error
        console.error(`Unexpected Error: ${error.message}`);
      }
      
      throw new AppError(HttpStatusCode.INTERNAL_SERVER, "An internal error occurred");
    }
  }

}

const sentenceCheckerService = new SentenceCheckerService();
export default sentenceCheckerService;
