import mongoose from "mongoose";
import { Trigger } from "../models/index.js";
import { faker } from "@faker-js/faker";
import { factory } from "factory-girl";
let count;
const dummyCreation = async (req) => {
  count = parseInt(req.params.number, 10);
  if (isNaN(count) || count <= 0) {
    return res.status(400).json(errorResponse(req.__("invalidNumberFormat")));
  }

  try {
    await Trigger.deleteMany({});
    const result = [];
    for (let i = 0; i < count; i++) {
      const dummyTrigger = await factory.build("trigger");
      const actions = conditionActionMap[dummyTrigger.condition];
      dummyTrigger.action = faker.helpers.arrayElement(actions);
      await dummyTrigger.save();
      result.push(dummyTrigger);
    }

    return {
      data: result,
    };
  } catch (error) {
    console.error("Error creating dummy data:", error);
    throw new Error(req.__("errorCreatingDummyData"));
  }
};

const conditionActionMap = {
  "when match is finished": ["display match summary", "display match result"],
  "when toss is done": ["toss result"],
  "when match is scheduled": ["match scheduled"],
  "when match is in progress": [
    "Player Fifty",
    "Player Century",
    "Player Took Wicket",
    "Player Hat-trick",
    "Player Took a catch",
  ],
};

factory.define("trigger", Trigger, {
  name: () => faker.lorem.words(2),
  type: () => faker.helpers.arrayElement(["match", "player", "official"]),
  condition: function () {
    const conditions = Object.keys(conditionActionMap);
    return faker.helpers.arrayElement(conditions);
  },
  network: () => faker.helpers.arrayElements(["email", "sms", "push"], 2),
  channels: () =>
    faker.helpers.arrayElements(["facebook", "twitter", "instagram"], 2),
  post: () => faker.string.uuid(),
  reminderTime: () => faker.date.future(),
  status: () => faker.helpers.arrayElement(["send", "not-sent"]),
  targetType: () => faker.helpers.arrayElement(["account", "league", "match"]),
  targetId: () => faker.string.uuid(),
  humanApproval: () => faker.datatype.boolean(),
});

const create = async () => {
  const trigger = await factory.build("trigger");
  const actions = conditionActionMap[trigger.condition];
  trigger.action = faker.helpers.arrayElement(actions);
  await trigger.save();
  return trigger;
};

export { dummyCreation };
