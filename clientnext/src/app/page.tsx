"use server";

import dynamic from "next/dynamic";

import { SentenceChecker } from "./sentenceChecker/SentenceChecker";
// const SentenceChecker = dynamic(()=> import("./sentenceChecker/SentenceChecker").then((module) => module.SentenceChecker)) //for named export

const Home = () => {

  return (
    // <DynamicSentenceChecker />
    <SentenceChecker />
  );
};
export default Home;