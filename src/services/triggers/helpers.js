import axios from "axios";
import { igPosting, fbPosting } from "../../../channels/index.js";
import { Trigger } from "../../models/index.js";
const getTriggerCount = async (givenDate, name, status, targetType) => {
  const startOfDay = new Date(givenDate.setHours(0, 0, 0, 0));
  const endOfDay = new Date(givenDate.setHours(23, 59, 59, 999));

  const query = {
    createdAt: { $gte: startOfDay, $lte: endOfDay },
  };

  if (name) query.name = name;
  if (status) query.status = status;
  if (targetType) query.targetType = targetType;

  return await Trigger.countDocuments(query);
};

const search = async (searchString, allTriggers) => {
  const lowerCaseSearchString = searchString.toLowerCase();
  return allTriggers.filter((trigger) => {
    return Object.values(trigger.toObject()).some((value) => {
      if (typeof value === "string") {
        return value.toLowerCase().includes(lowerCaseSearchString);
      }
      return false;
    });
  });
};

const getPaginationMeta = (totalCount, currentPage, limit) => {
  const totalPages = Math.ceil(totalCount / limit);
  return {
    totalCount,
    totalPages,
    currentPage,
    perPage: limit,
    hasNextPage: currentPage < totalPages,
    hasPrevPage: currentPage > 1,
  };
};
const getTimeRange = (timeframe, dateParams, req) => {
  const currentDate = new Date();

  const year = dateParams.year
    ? parseInt(dateParams.year, 10)
    : currentDate.getFullYear();
  const month = dateParams.month
    ? new Date(`${dateParams.month} 1, ${year}`).getMonth()
    : currentDate.getMonth();
  const date = dateParams.date
    ? parseInt(dateParams.date, 10)
    : currentDate.getDate();
  const week = dateParams.week ? parseInt(dateParams.week, 10) : null;
  const quarter = dateParams.quarter ? parseInt(dateParams.quarter, 10) : null;

  let startDate, endDate;

  switch (timeframe) {
    case "daily":
      startDate = new Date(year, month, date, 0, 0, 0, 0);
      endDate = new Date(year, month, date, 23, 59, 59, 999);

      break;
    case "weekly":
      if (week) {
        const firstDayOfMonth = new Date(year, month, 1);
        startDate = new Date(firstDayOfMonth);
        startDate.setDate(
          firstDayOfMonth.getDate() +
            (week - 1) * 7 -
            firstDayOfMonth.getDay() +
            1
        );
        endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + 6);
        endDate.setHours(23, 59, 59, 999);
      } else {
        const { startOfWeek, endOfWeek } = getWeekRange(currentDate);
        startDate = startOfWeek;
        endDate = endOfWeek;
      }
      break;
    case "monthly":
      startDate = new Date(year, month, 1, 0, 0, 0, 0);
      endDate = new Date(year, month + 1, 0, 23, 59, 59, 999);
      break;
    case "yearly":
      startDate = new Date(year, 0, 1, 0, 0, 0, 0);
      endDate = new Date(year, 11, 31, 23, 59, 59, 999);
      break;
    case "quarterly":
      startDate = new Date(year, (quarter - 1) * 3, 1, 0, 0, 0, 0);
      endDate = new Date(year, quarter * 3, 0, 23, 59, 59, 999);
      break;
    default:
      throw new Error("Invalid timeframe specified");
  }

  return { startDate, endDate };
};

const getWeekRange = (date) => {
  const current = new Date(date);

  // Find the start of the week (Monday)
  const startOfWeek = new Date(current);
  startOfWeek.setDate(current.getDate() - ((current.getDay() + 6) % 7)); // Monday
  startOfWeek.setHours(0, 0, 0, 0);

  // Find the end of the week (Sunday)
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6); // Sunday
  endOfWeek.setHours(23, 59, 59, 999);

  return { startOfWeek, endOfWeek };
};

const getContentFromApi = async (req) => {
  const { matchData } = req.body;
  if (req.query.category) {
    const { achievement, category } = req.query;
  }
  try {
    // Determine the request body using ternary operators
    const requestBody =
      matchData.status.id === 3
        ? {
            matchobj: matchData,
            category: category,
            achievement: achievement,
          }
        : matchData.status.id === 1 ||
          matchData.status.id === 2 ||
          matchData.status.id === 4
        ? {
            matchobj: matchData,
          }
        : (() => {
            throw new Error("Unsupported status id");
          })(); // Default case for unsupported status.id

    // Make the Axios request
    const response = await axios.post(process.env.apiUrl, requestBody, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.token}`,
      },
    });

    // Handle the response
    return {
      data: response.data,
    };
  } catch (error) {
    // Handle any errors
    console.error("Error:", error);
    throw error; // Rethrow the error after logging it
  }
};

const postTrigger = async (trigger, content, image) => {
  await Promise.all(
    trigger.channels.map(async (channel) => {
      switch (channel) {
        case "facebook":
          console.log(`Posting on Facebook for trigger ID ${trigger._id}.`);
          await fbPosting(content, image);
          break;
        case "instagram":
          console.log(`Posting on Instagram for trigger ID ${trigger._id}.`);
          await igPosting(content, image);
          break;
        case "twitter":
          console.log(`Posting on Twitter for trigger ID ${trigger._id}.`);
          await postToTwitter(trigger);
          break;
        default:
          console.log(
            `trigger with ID ${trigger._id} has an unknown channel: ${channel}.`
          );
      }
    })
  );
  return;
};

const emailNotification = async (email) => {
  console.log("Email sent to creator");
  return;
};

export {
  search,
  getWeekRange,
  getTriggerCount,
  getTimeRange,
  getPaginationMeta,
  getContentFromApi,
  postTrigger,
  emailNotification,
};
