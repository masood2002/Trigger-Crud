import mongoose from "mongoose";
import { Trigger } from "../models/index.js";
import { faker } from "@faker-js/faker";
import { factory } from "factory-girl";

const dummyCreation = async (count, req) => {
  try {
    await Trigger.deleteMany({});

    for (let i = 0; i < count; i++) {
      await create();
    }

    console.log(req.__("dummyTriggersCreatedSuccessfully"));

    return {
      status: true,
      statusCode: 200,
      message: req.__("dummyTriggersCreatedSuccessfully"),
    };
  } catch (error) {
    return {
      status: false,
      statusCode: 500,
      message: req.__("issueInCreatingDummyTriggers"),
      error: error,
    };
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
