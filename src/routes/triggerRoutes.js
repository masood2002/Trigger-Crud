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
} from "../Controllers/triggers/index.js";

const triggerRouter = express.Router();

triggerRouter.use(checkAuth);
triggerRouter.post("/", create);
triggerRouter.delete("/:id", remove);
triggerRouter.put("/:id", update);
triggerRouter.get("/", get);
triggerRouter.post("/create-dummy-triggers/:number", dummy);
triggerRouter.post("/filter", filter);
triggerRouter.post("/calendar/filters/:timeFrame", advanceCalendarFilters);
triggerRouter.get("/:id", show);

const mainRouter = express.Router();

mainRouter.use("/trigger", triggerRouter);

export default mainRouter;
