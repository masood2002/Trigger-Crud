import {
  add,
  eliminate,
  modify,
  fetch,
  sorting,
  retrieve,
  getByDateRange,
} from "../../services/triggers/index.js";
import { dummyCreation } from "../../dummyData/index.js";
import { successResponse, errorResponse } from "../../resources/index.js";
/**
 * Handles the request to create a new trigger.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
const create = async (req, res) => {
  try {
    const result = await add(req);

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
  try {
    const result = await dummyCreation(req);
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
  try {
    const result = await eliminate(req);
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
  try {
    const result = await modify(req);
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
  try {
    const result = await fetch(req);
    return res
      .status(200)
      .json(
        successResponse(
          req.__("triggersFetchedSuccessfully"),
          result.data,
          result.meta
        )
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
  try {
    const result = await sorting(req);
    return res
      .status(200)
      .json(
        successResponse(
          req.__("triggersFilteredSuccessfully"),
          result.data,
          result.meta
        )
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
  try {
    const result = await retrieve(req);
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
  try {
    const result = await getByDateRange(req);
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
