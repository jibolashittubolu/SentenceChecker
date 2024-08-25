// base imports
import { Router, Request, Response } from "express";

const router: Router = Router();

// Middlewares


// Routes


// *Catch-all route
router.all("*", (req: Request, res: Response) => {
  return res.status(404).send("Invalid URI. v2");
});

const SentenceCheckerRouter: Router = router;
export default SentenceCheckerRouter;
