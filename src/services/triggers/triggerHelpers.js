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

const search = async (data, allTriggers) => {
  const filteredTriggers = allTriggers.filter((trigger) => {
    return (
      trigger.name.toLowerCase().includes(data) ||
      trigger.type.toLowerCase().includes(data) ||
      trigger.action.toLowerCase().includes(data) ||
      trigger.condition.toLowerCase().includes(data) ||
      (trigger.network &&
        trigger.network.some((network) =>
          network.toLowerCase().includes(data)
        )) ||
      (trigger.channels &&
        trigger.channels.some((channel) =>
          channel.toLowerCase().includes(data)
        )) ||
      trigger.post.toLowerCase().includes(data) ||
      trigger.status.toLowerCase().includes(data) ||
      trigger.targetType.toLowerCase().includes(data) ||
      trigger.targetId.toLowerCase().includes(data)
    );
  });

  return filteredTriggers;
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
      console.log(date);
      startDate = new Date(year, month, date, 0, 0, 0, 0);
      endDate = new Date(year, month, date, 23, 59, 59, 999);

      console.log(startDate, endDate);
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

export {
  search,
  getWeekRange,
  getTriggerCount,
  getTimeRange,
  getPaginationMeta,
};
