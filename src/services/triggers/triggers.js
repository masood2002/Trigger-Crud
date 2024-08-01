import mongoose from "mongoose";
import { Trigger } from "../../models/index.js";
import { search, getTimeRange, getPaginationMeta } from "./index.js";

/**
 * Adds a new trigger to the database and returns a response.
 * @param {Object} data - The data for the new trigger.
 * @param {Object} req - The request object containing the locale for response messages.
 * @returns {Promise<Object>} The response object with status, message, and data.
 */

const add = async (data, req) => {
  try {
    const trigger = new Trigger(data);
    await trigger.save();

    return {
      data: trigger,
    };
  } catch (error) {
    throw new Error(req.__("errorAddingTrigger"));
  }
};

/**
 * Deletes a trigger by its ID and returns a response.
 * @param {string} id - The ID of the trigger to be deleted.
 * @param {Object} req - The request object containing the locale for response messages.
 * @returns {Promise<Object>} The response object with status and message.
 */

const eliminate = async (id, req) => {
  try {
    const result = await Trigger.findByIdAndDelete(id);

    if (!result) {
      throw new Error(req.__("triggerNotFound"));
    }

    return {
      data: result,
    };
  } catch (error) {
    throw new Error(req.__("errorRemovingTrigger"));
  }
};

/**
 * Updates an existing trigger by its ID and returns a response.
 * @param {string} id - The ID of the trigger to be updated.
 * @param {Object} data - The updated data for the trigger.
 * @param {Object} req - The request object containing the locale for response messages.
 * @returns {Promise<Object>} The response object with status, message, and updated data.
 */
const modify = async (id, data, req) => {
  try {
    const trigger = await Trigger.findByIdAndUpdate(id, data, { new: true });

    if (!trigger) {
      throw new Error(req.__("triggerNotFound"));
    }

    return {
      data: trigger,
    };
  } catch (error) {
    throw new Error(req.__("errorUpdatingTrigger"));
  }
};

/**
 * Fetches triggers based on the provided query parameters, with pagination and sorting.
 * @param {string} data - The search query for triggers.
 * @param {number} page - The page number for pagination.
 * @param {number} limit - The number of items per page.
 * @param {string} sortOrder - The order in which to sort the results ('asc' or 'desc').
 * @param {Object} req - The request object containing the locale for response messages.
 * @returns {Promise<Object>} The response object with status, message, data, and pagination meta.
 */
const fetch = async (data, page, limit, sortOrder, req) => {
  try {
    let triggers;

    if (data && data.trim() !== "") {
      const allTriggers = await Trigger.find().exec();
      data = data.toLowerCase();
      triggers = await search(data, allTriggers);
    } else {
      triggers = await Trigger.find()
        .sort({ name: sortOrder })
        .skip((page - 1) * limit)
        .limit(limit)
        .exec();
    }

    if (triggers.length === 0) {
      return {
        message: req.__("noTriggerFound"),
        data: [],
        meta: getPaginationMeta(0, page, limit),
      };
    }

    const totalCount = await Trigger.countDocuments();

    return {
      data: triggers,
      meta: getPaginationMeta(totalCount, page, limit),
    };
  } catch (error) {
    throw new Error(req.__("errorRetrievingTriggers"));
  }
};

/**
 * Retrieves triggers based on sorting, filtering, and pagination criteria.
 * @param {number} page - The page number for pagination.
 * @param {number} sortOrder - The order in which to sort the results (1 for ascending, -1 for descending).
 * @param {number} limit - The number of items per page.
 * @param {Date} givenDate - The date to filter triggers by.
 * @param {string} [name] - The name to filter triggers by.
 * @param {string} [status] - The status to filter triggers by.
 * @param {string} [targetType] - The target type to filter triggers by.
 * @param {Object} req - The request object containing the locale for response messages.
 * @returns {Promise<Object>} The response object with status, message, data, and pagination meta.
 */

const sorting = async (
  page,
  sortOrder,
  limit,
  givenDate,
  name,
  status,
  targetType,
  req
) => {
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
      return {
        message: req.__("noTriggerFound"),
        data: [],
        meta: getPaginationMeta(0, page, limit),
      };
    }

    const currentPage = page;

    return {
      data: triggers,
      meta: getPaginationMeta(totalCount, currentPage, limit),
    };
  } catch (error) {
    throw new Error(req.__("errorRetrievingTriggers"));
  }
};

/**
 * Retrieves a trigger by its ID and returns a response.
 * @param {string} id - The ID of the trigger to retrieve.
 * @param {Object} req - The request object containing the locale for response messages.
 * @returns {Promise<Object>} The response object with status, message, and the trigger data.
 */
const retrieve = async (id, req) => {
  try {
    const trigger = await Trigger.findById(id).exec();
    if (!trigger) {
      throw new Error(req.__("triggerNotFound"));
    }
    return {
      data: trigger,
    };
  } catch (error) {
    throw new Error(req.__("errorRetrievingTrigger"));
  }
};

/**
 * Retrieves triggers based on a date range and additional filters, grouped by date.
 * @param {string} timeframe - The timeframe to filter triggers by (e.g., daily, weekly).
 * @param {Object} dateParams - Parameters for the date range (e.g., year, month, week, date, quarter).
 * @param {Object} filters - Additional filters to apply (e.g., name, type, status).
 * @param {Object} req - The request object containing the locale for response messages.
 * @returns {Promise<Object>} The response object with status, message, and grouped trigger data.
 */
const calendar = async (timeframe, dateParams, filters, req) => {
  const { startDate, endDate } = getTimeRange(timeframe, dateParams);

  try {
    const query = {
      createdAt: { $gte: startDate, $lte: endDate },
      ...(filters.name && { name: { $regex: filters.name, $options: "i" } }),
      ...(filters.type && { type: { $in: filters.type } }),
      ...(filters.status && { status: { $in: filters.status } }),
      ...(filters.targetType && { targetType: { $in: filters.targetType } }),
      ...(filters.targetId && { targetId: { $in: filters.targetId } }),
    };

    const triggers = await Trigger.find(query).exec();

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
    };
  } catch (error) {
    throw new Error(req.__("errorRetrievingTimeframeTriggers", { timeframe }));
  }
};

export { add, eliminate, modify, fetch, sorting, retrieve, calendar };
