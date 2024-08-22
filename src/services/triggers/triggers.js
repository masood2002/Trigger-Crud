import { Trigger } from "../../models/index.js";
import {
  search,
  getTimeRange,
  getPaginationMeta,
  getContentFromApi,
  postTrigger,
  emailNotification,
} from "./index.js";
/**
 * Adds a new trigger to the database and returns a response.
 * @param {Object} req - The request object containing the trigger data in `req.body`.
 * @returns {Promise<Object>} The response object with status, message, and the newly created trigger data.
 * @throws {Error} If validation fails or if there is an issue with saving the trigger.
 */
const searchTrigger = async (req) => {
  const { targetType, targetId, action } = req.body;

  try {
    const trigger = await Trigger.findOne({
      action: action,
      targetId: targetId,
      targetType: targetType,
      status: "not-send",
    });

    if (!trigger) {
      throw new Error(req.__("triggerNotFound"));
    }
    const image = trigger.image.url;
    await emailNotification(); //give email to send notification to admin (creater)
    const result = await getContentFromApi(req);

    let content = result.data.generated_content;

    await postTrigger(trigger, content, image);
    await trigger.updateOne({
      content: content,
    });

    return;
  } catch (error) {
    throw new Error(error.message);
  }
};
// const searchTrigger = async (req) => {
//   const { targetType, targetId, action } = req.body;

//   try {
//     // Find the trigger
//     const trigger = await Trigger.findOne({
//       action,
//       targetId,
//       targetType,
//       status: "not-send",
//     }).exec();

//     if (!trigger) {
//       throw new Error(req.__("triggerNotFound"));
//     }

//     // Retrieve image URL and generate content from API
//     const {
//       image: { url: image },
//     } = trigger;
//     const resultPromise = getContentFromApi(req);
//     const emailPromise = emailNotification(); // Email notification can be sent in parallel

//     // Wait for both promises to resolve
//     const [result] = await Promise.all([resultPromise, emailPromise]);

//     const content = result.data.generated_content;

//     // Post trigger content and update the trigger
//     await Promise.all([
//       postTrigger(trigger, content, image),
//       trigger.updateOne({ content }),
//     ]);

//     return;
//   } catch (error) {
//     // Consider logging the error here if needed
//     throw new Error(error.message);
//   }
// };
const add = async (req) => {
  try {
    const trigger = new Trigger(req.body);
    await trigger.save();

    return {
      data: trigger,
    };
  } catch (error) {
    throw new Error(error.message);
  }
};

/**
 * Deletes a trigger by its ID and returns a response.
 * @param {Object} req - The request object containing the ID of the trigger to be deleted in `req.params.id`.
 * @returns {Promise<Object>} The response object with status and the deleted trigger data.
 * @throws {Error} If the trigger is not found or if there is an issue with deletion.
 */

const eliminate = async (req) => {
  const result = await Trigger.findByIdAndDelete(req.params.id);
  try {
    if (!result) {
      throw new Error(req.__("triggerNotFound"));
    }
    return {
      data: result,
    };
  } catch (error) {
    throw new Error(error.message);
  }
};

/**
 * Updates an existing trigger by its ID and returns a response.
 * @param {Object} req - The request object containing the ID of the trigger to be updated in `req.params.id` and the updated data in `req.body`.
 * @returns {Promise<Object>} The response object with status, message, and the updated trigger data.
 * @throws {Error} If the trigger is not found or if there is an issue with updating.
 */
const modify = async (req) => {
  try {
    const trigger = await Trigger.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!trigger) {
      throw new Error(req.__("triggerNotFound"));
    }

    return {
      data: trigger,
    };
  } catch (error) {
    throw new Error(error.message);
  }
};

/**
 * Fetches triggers based on the provided query parameters, with pagination and sorting.
 * @param {Object} req - The request object containing query parameters for pagination and sorting.
 * @returns {Promise<Object>} The response object with status, message, the fetched triggers data, and pagination metadata.
 * @throws {Error} If there is an issue with fetching triggers.
 */
const fetch = async (req) => {
  const { page = 1, limit = 10, sortOrder = "asc" } = req.query;
  let data = req.body.data || "";

  try {
    let triggers;

    if (data.trim() !== "") {
      const allTriggers = await Trigger.find().exec();
      triggers = await search(data, allTriggers);
    } else {
      triggers = await Trigger.find()
        .sort({ name: sortOrder.toLowerCase() === "asc" ? 1 : -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .exec();
    }

    const totalCount = await Trigger.countDocuments(
      data.trim() !== "" ? {} : {}
    );

    return {
      data: triggers,
      meta: getPaginationMeta(totalCount, page, limit),
    };
  } catch (error) {
    throw new Error(error.message);
  }
};

/**
 * Retrieves triggers based on sorting, filtering, and pagination criteria.
 * @param {Object} req - The request object containing pagination, sorting, and filtering parameters.
 * @returns {Promise<Object>} The response object with status, message, the filtered triggers data, and pagination metadata.
 * @throws {Error} If there is an issue with sorting or filtering triggers.
 */
const sorting = async (req) => {
  const { page = 1, per_page = 10, sort = "ASC" } = req.query;
  const { order_by, name, status, targetType } = req.body;

  const currentPage = parseInt(page, 10);
  const limit = parseInt(per_page, 10);
  const sortOrder = sort.toUpperCase() === "ASC" ? 1 : -1;

  const givenDate = new Date(order_by);

  if (isNaN(givenDate.getTime())) {
    throw new Error(req.__("invalidDateFormat"));
  }

  const startOfDay = new Date(givenDate.setHours(0, 0, 0, 0));
  const endOfDay = new Date(givenDate.setHours(23, 59, 59, 999));
  const skip = (page - 1) * limit;

  const query = {
    createdAt: { $gte: startOfDay, $lte: endOfDay },
  };

  if (name) query.name = name;
  if (status) query.status = status;
  if (targetType) query.targetType = targetType;

  try {
    const totalCount = await Trigger.countDocuments(query);
    const triggers = await Trigger.find(query)
      .sort({ name: sortOrder })
      .skip(skip)
      .limit(limit)
      .exec();

    if (triggers.length === 0) {
      throw new Error(req.__("noTriggerFound"));
    }

    return {
      data: triggers,
      meta: getPaginationMeta(totalCount, currentPage, limit),
    };
  } catch (error) {
    throw new Error(error.message);
  }
};

/**
 * Retrieves a trigger by its ID and returns a response.
 * @param {Object} req - The request object containing the ID of the trigger to retrieve in `req.params.id`.
 * @returns {Promise<Object>} The response object with status, message, and the trigger data.
 * @throws {Error} If the trigger is not found or if there is an issue with retrieval.
 */
const retrieve = async (req) => {
  try {
    const trigger = await Trigger.findById(req.params.id).exec();
    if (!trigger) {
      throw new Error(req.__("triggerNotFound"));
    }
    return {
      data: trigger,
    };
  } catch (error) {
    throw new Error(error.message);
  }
};

/**
 * Retrieves triggers based on a date range and additional filters, grouped by date.
 * @param {Object} req - The request object containing the timeframe, date parameters, and additional filters.
 * @returns {Promise<Object>} The response object with status, message, and grouped trigger data.
 * @throws {Error} If there is an issue with retrieving or grouping triggers.
 */

const getByDateRange = async (req) => {
  const { timeFrame } = req.params;
  const { year, month, week, date, quarter } = req.body;
  const filters = req.body.filters || {};

  // Extract pagination parameters from the request
  const { page = 1, limit = 10 } = req.query;
  const currentPage = parseInt(page, 10);
  const pageSize = parseInt(limit, 10);
  const skip = (currentPage - 1) * pageSize;

  const dateParams = { year, month, week, date, quarter };
  const { startDate, endDate } = getTimeRange(timeFrame, dateParams);

  try {
    const query = {
      createdAt: { $gte: startDate, $lte: endDate },
      ...(filters.name && { name: { $regex: filters.name, $options: "i" } }),
      ...(filters.type && { type: { $in: filters.type } }),
      ...(filters.status && { status: { $in: filters.status } }),
      ...(filters.targetType && { targetType: { $in: filters.targetType } }),
      ...(filters.targetId && { targetId: { $in: filters.targetId } }),
    };

    // Fetch total count of documents matching the query
    const totalCount = await Trigger.countDocuments(query);

    // Fetch triggers with pagination
    const triggers = await Trigger.find(query)
      .skip(skip)
      .limit(pageSize)
      .exec();

    // Group triggers by date
    const groupedTriggers = {};
    const currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      const dateKey = currentDate.toISOString().split("T")[0];
      groupedTriggers[dateKey] = [];
      currentDate.setDate(currentDate.getDate() + 1);
    }

    triggers.forEach((trigger) => {
      const dateKey = trigger.createdAt.toISOString().split("T")[0];
      if (groupedTriggers[dateKey]) {
        groupedTriggers[dateKey].push(trigger);
      }
    });

    return {
      data: groupedTriggers,
      meta: getPaginationMeta(totalCount, currentPage, pageSize),
    };
  } catch (error) {
    throw new Error(error.message);
  }
};

export {
  add,
  eliminate,
  modify,
  fetch,
  sorting,
  retrieve,
  getByDateRange,
  searchTrigger,
};
