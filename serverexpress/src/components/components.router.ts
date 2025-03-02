// base imports
import { Router , Request, Response } from "express";
import RouterV1 from "./v1/v1.router";
import RouterV2 from "./v2/v2.router";

// app imports
// import { authentication } from "../core/middlewares";
// import ProcurementRouter from "./ProcurementSystem/procurementSystem.router";
// import VendorSystemRouter from "./VendorSystem/vendorSystem.router";

const router: Router = Router();
// Use routes
router.use("/v1", RouterV1);
router.use("/v2", RouterV2);


// Default endpoint
router.all("/", (req: Request, res: Response) => {
  return res.status(200).send("Hello and welcome to the Component System.");
});


const ComponentsRouter: Router = router;
export default ComponentsRouter;
