import { errorResponse } from "../resources/index.js";

// League/league-related conditions

const triggerConditions = [
  "match_finished",
  "toss_done",
  "match_scheduled",
  "match_in_progress",
  "league_created",
  "league_finished",
  "league_scheduled",
];
const triggerActions = [
  // Match-related actions
  "match_summary",
  "match_result",
  "toss_result",
  "match_scheduled",

  "announce_league",
  "schedule_league events",
];

const triggerStatuses = ["sent", "not-sent"];
const triggerTargetTypes = ["account", "match", "league"];
const triggerChannels = ["instagram", "facebook", "twitter"];
const triggerNetworks = ["social media", "email"];

export const validations = async (req, res, next) => {
  try {
    // Validate 'name'
    // if (!req.body.name || typeof req.body.name !== "string") {
    //   return res.status(422).json(errorResponse(req.__("nameMustBeString")));
    // }
    if (
      !req.body.name ||
      typeof req.body.name !== "string" ||
      !/^[a-zA-Z]/.test(req.body.name)
    ) {
      return res
        .status(422)
        .json(errorResponse(req.__("nameMustStartWithCharacter")));
    }
    // Validate 'targetType'
    if (
      !req.body.targetType ||
      !triggerTargetTypes.includes(req.body.targetType)
    ) {
      return res.status(422).json(errorResponse(req.__("Invalid target type")));
    }

    // Validate 'targetId'
    if (!req.body.targetId || typeof req.body.targetId !== "string") {
      return res.status(422).json(errorResponse(req.__("Invalid target Id")));
    }
    // Validate 'condition'
    if (
      !req.body.condition ||
      !triggerConditions.includes(req.body.condition)
    ) {
      return res.status(422).json(errorResponse(req.__("Invalid condition")));
    }

    // Validate 'action'
    if (!req.body.action || !triggerActions.includes(req.body.action)) {
      return res.status(422).json(errorResponse(req.__("Invalid action")));
    }

    // Validate 'channels'
    if (
      !req.body.channels ||
      req.body.channels.length === 0 ||
      !Array.isArray(req.body.channels) ||
      req.body.channels.some((chan) => !triggerChannels.includes(chan))
    ) {
      return res.status(422).json(errorResponse(req.__("Invalid channels")));
    }
    // Validate 'networks'
    if (
      !req.body.networks ||
      req.body.networks.length === 0 ||
      !Array.isArray(req.body.networks) ||
      req.body.networks.some((net) => !triggerNetworks.includes(net))
    ) {
      return res.status(422).json(errorResponse(req.__("Invalid networks")));
    }

    // Validate 'status'
    if (!req.body.status || !triggerStatuses.includes(req.body.status)) {
      return res.status(422).json(errorResponse(req.__("Invalid status")));
    }

    // validate image
    if (!req.body.image.url || typeof req.body.image.url !== "string") {
      return res.status(422).json(errorResponse(req.__("Invalid image type")));
    }
    // If all validations pass, proceed to the next middleware or route handler
    next();
  } catch (error) {
    // Handle unexpected errors
    return res.status(500).json(errorResponse(error.message));
  }
};
