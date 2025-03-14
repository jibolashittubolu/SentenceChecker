"use server"

import dynamic from "next/dynamic" 

import { SentenceChecker } from "./SentenceChecker"

// const SentenceChecker = dynamic(()=> import("./SentenceChecker").then((module) => module.SentenceChecker)) //for named export
const Page = () => {
  return (
    // <DynamicSentenceChecker />
    <SentenceChecker />
  )
}

export default Page



