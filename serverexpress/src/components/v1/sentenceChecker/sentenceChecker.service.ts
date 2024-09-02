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
    catch(err: any){
      // logger.debug(
      //   err?.message,
      //   err
      // );
      // logger.info(
      //   err?.message,
      //   err
      // );
      console.log(err)
      
      throw new AppError(HttpStatusCode.INTERNAL_SERVER, "An internal error occurred");
    }
  }

}

const sentenceCheckerService = new SentenceCheckerService();
export default sentenceCheckerService;
