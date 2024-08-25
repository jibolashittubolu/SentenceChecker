// base imports
import { Router , Request, Response } from "express";
import SentenceCheckerRouter from "./sentenceChecker/sentenceChecker.router";
import TagsRouter from "./tags/tags.router";

// app imports
// import { authentication } from "../core/middlewares";
// import ProcurementRouter from "./ProcurementSystem/procurementSystem.router";
// import VendorSystemRouter from "./VendorSystem/vendorSystem.router";

const router: Router = Router();


// Use routes
router.use("/sentenceChecker", SentenceCheckerRouter);
router.use("/tags", TagsRouter);


// Default endpoint
router.all("/", (req: Request, res: Response) => {
  return res.status(200).send("Hello and welcome to the Component System v1.");
});


const RouterV1: Router = router;
export default RouterV1;
