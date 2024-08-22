import express from "express";

import { checkAuth } from "../Middlewares/index.js";

import {
  create,
  remove,
  update,
  get,
  filter,
  show,
  advanceCalendarFilters,
  dummy,
  checkTrigger,
} from "../controllers/triggers/index.js";
import { validations } from "../validations/index.js";
const triggerRouter = express.Router();
// triggers...-> match events comp/account/match           // remember triggers scope
// post->match/officials/player // remember post scope
triggerRouter.use(checkAuth);

triggerRouter.post("/", validations, create);
triggerRouter.delete("/:id", remove);
triggerRouter.put("/:id", validations, update);
triggerRouter.get("/", get);
triggerRouter.post("/create-dummy-triggers/:number", dummy);
triggerRouter.post("/filter", filter);
triggerRouter.post("/calendar/filters/:timeFrame", advanceCalendarFilters);
triggerRouter.get("/:id", show);
triggerRouter.post("/check-and-execute", checkTrigger);

const mainRouter = express.Router();

mainRouter.use("/trigger", triggerRouter);

export default mainRouter;
