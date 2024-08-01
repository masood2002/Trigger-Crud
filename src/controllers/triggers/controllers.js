import {
  add,
  eliminate,
  modify,
  fetch,
  sorting,
  retrieve,
  calendar,
} from "../../services/triggers/index.js";
import { dummyCreation } from "../../dummyData/index.js";
import { checkName } from "../../../validations/index.js";
import { successResponse, errorResponse } from "../../resources/index.js";
/**
 * Handles the request to create a new trigger.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
const create = async (req, res) => {
  const data = req.body;

  const validation = checkName(data.name, req);
  if (!validation.status) {
    return res.status(400).json(errorResponse(validation.message));
  }

  try {
    const result = await add(data, req);
    return res
      .status(200)
      .json(successResponse(req.__("triggerCreatedSuccessfully"), result.data));
  } catch (error) {
    return res.status(422).json(errorResponse(error.message));
  }
};

/**
 * Handles the request to create dummy data.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
const dummy = async (req, res) => {
  const { number } = req.params;

  const count = parseInt(number, 10);
  if (isNaN(count) || count <= 0) {
    return res.status(400).json(errorResponse(req.__("invalidNumberFormat")));
  }

  try {
    const result = await dummyCreation(count, req);
    return res
      .status(200)
      .json(
        successResponse(req.__("dummyDataCreatedSuccessfully"), result.data)
      );
  } catch (error) {
    return res.status(422).json(errorResponse(error.message));
  }
};

/**
 * Handles the request to remove a trigger by ID.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
const remove = async (req, res) => {
  const id = req.params.id;

  try {
    const result = await eliminate(id, req);
    return res
      .status(200)
      .json(successResponse(req.__("triggerRemovedSuccessfully"), result.data));
  } catch (error) {
    return res.status(422).json(errorResponse(error.message));
  }
};

/**
 * Handles the request to update a trigger by ID.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
const update = async (req, res) => {
  const id = req.params.id;
  const data = req.body;

  try {
    const result = await modify(id, data, req);
    return res
      .status(200)
      .json(successResponse(req.__("triggerUpdatedSuccessfully"), result.data));
  } catch (error) {
    return res.status(422).json(errorResponse(error.message));
  }
};

/**
 * Handles the request to fetch triggers with optional pagination and sorting.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
const get = async (req, res) => {
  const { data, page = 1, limit = 10, sortOrder = "asc" } = req.query;

  try {
    const result = await fetch(data, page, limit, sortOrder, req);
    return res
      .status(200)
      .json(
        successResponse(req.__("triggersFetchedSuccessfully"), result.data)
      );
  } catch (error) {
    return res.status(422).json(errorResponse(error.message));
  }
};

/**
 * Handles the request to filter triggers based on given criteria.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
const filter = async (req, res) => {
  const { page = 1, per_page = 10, sort = "ASC" } = req.query;
  const { order_by, name, status, targetType } = req.body;

  const currentPage = parseInt(page, 10);
  const limit = parseInt(per_page, 10);
  const sortOrder = sort.toUpperCase() === "ASC" ? 1 : -1;

  const givenDate = new Date(order_by);

  if (isNaN(givenDate.getTime())) {
    return res.status(400).json(errorResponse(req.__("invalidDateFormat")));
  }

  try {
    const result = await sorting(
      currentPage,
      sortOrder,
      limit,
      givenDate,
      name,
      status,
      targetType,
      req
    );
    return res
      .status(200)
      .json(
        successResponse(req.__("triggersFilteredSuccessfully"), result.data)
      );
  } catch (error) {
    return res.status(422).json(errorResponse(error.message));
  }
};

/**
 * Handles the request to retrieve a trigger by ID.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
const show = async (req, res) => {
  const id = req.params.id;

  try {
    const result = await retrieve(id, req);
    return res
      .status(200)
      .json(successResponse(req.__("triggerFetchedSuccessfully"), result.data));
  } catch (error) {
    return res.status(422).json(errorResponse(error.message));
  }
};

/**
 * Handles the request for advanced calendar filters based on time frames and other criteria.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
const advanceCalendarFilters = async (req, res) => {
  const { timeFrame } = req.params;
  const { year, month, week, date, quarter } = req.body;
  const filters = req.body.filters || {};

  const dateParams = { year, month, week, date, quarter };

  try {
    const result = await calendar(timeFrame, dateParams, filters, req);
    return res
      .status(200)
      .json(
        successResponse(
          req.__("calendarFiltersAppliedSuccessfully"),
          result.data
        )
      );
  } catch (error) {
    return res.status(422).json(errorResponse(error.message));
  }
};

export {
  create,
  remove,
  update,
  get,
  filter,
  show,
  advanceCalendarFilters,
  dummy,
};
