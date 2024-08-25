// base imports
import { Router, Request, Response } from "express";
import sentenceCheckerController from "./sentenceChecker.controller";

const router: Router = Router();

// Middlewares
router.post('/checkSentence', sentenceCheckerController.checkSentence )


// Routes


// *Catch-all route
router.all("*", (req: Request, res: Response) => {
  return res.status(404).send("Invalid URI. v1 sentenceChecker");
});

const SentenceCheckerRouter: Router = router;
export default SentenceCheckerRouter;
