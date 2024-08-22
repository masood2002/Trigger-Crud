import {
  add,
  eliminate,
  modify,
  fetch,
  sorting,
  retrieve,
  getByDateRange,
  searchTrigger,
} from "../../services/triggers/index.js";
import { dummyCreation } from "../../dummyData/index.js";
import { successResponse, errorResponse } from "../../resources/index.js";
/**
 * Handles the request to check and execute a trigger.
 *
 * This function searches for a trigger based on the provided request data.
 * If the trigger is successfully executed, it sends a success response with a message.
 * If an error occurs, it sends an error response with the error message.
 *
 * @param {Object} req - The request object containing the trigger data.
 * @param {Object} res - The response object used to send the response.
 * @returns {Object} The response object with either a success message or an error message.
 *
 * @throws {Error} Throws an error if the trigger execution fails or if there's an issue during the search.
 */
const checkTrigger = async (req, res) => {
  try {
    await searchTrigger(req);

    return res
      .status(200)
      .json(successResponse(req.__("triggerExecutedSuccessfully")));
  } catch (error) {
    return res.status(422).json(errorResponse(error.message));
  }
};

/**
 * Handles the request to create a new trigger.
 * @param {Object} req - The request object containing the trigger data.
 * @param {Object} res - The response object used to send the response.
 * @returns {Object} The response object with a success message and the created trigger data.
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
 * Handles the request to create dummy data for testing purposes.
 * @param {Object} req - The request object containing dummy data creation parameters.
 * @param {Object} res - The response object used to send the response.
 * @returns {Object} The response object with a success message and the created dummy data.
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
 * Handles the request to remove a trigger by its ID.
 * @param {Object} req - The request object containing the ID of the trigger to be removed.
 * @param {Object} res - The response object used to send the response.
 * @returns {Object} The response object with a success message confirming the removal of the trigger.
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
 * Handles the request to update a trigger by its ID.
 * @param {Object} req - The request object containing the ID and updated data of the trigger.
 * @param {Object} res - The response object used to send the response.
 * @returns {Object} The response object with a success message and the updated trigger data.
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
 * @param {Object} req - The request object containing pagination and sorting parameters.
 * @param {Object} res - The response object used to send the response.
 * @returns {Object} The response object with a success message, the fetched triggers, and pagination metadata.
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
 * @param {Object} req - The request object containing the filtering criteria.
 * @param {Object} res - The response object used to send the response.
 * @returns {Object} The response object with a success message, the filtered triggers, and metadata.
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
 * Handles the request to retrieve a trigger by its ID.
 * @param {Object} req - The request object containing the ID of the trigger to be retrieved.
 * @param {Object} res - The response object used to send the response.
 * @returns {Object} The response object with a success message and the retrieved trigger data.
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
 * @param {Object} req - The request object containing the time frame and other filtering criteria.
 * @param {Object} res - The response object used to send the response.
 * @returns {Object} The response object with a success message and the filtered triggers data.
 */

const advanceCalendarFilters = async (req, res) => {
  try {
    const result = await getByDateRange(req);
    return res
      .status(200)
      .json(
        successResponse(
          req.__("calendarFiltersAppliedSuccessfully"),
          result.data,
          result.meta
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
  checkTrigger,
};
