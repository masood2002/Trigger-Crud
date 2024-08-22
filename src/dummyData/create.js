import mongoose from "mongoose";
import { Trigger } from "../models/index.js";
import { faker } from "@faker-js/faker";
import { factory } from "factory-girl";

// Define the conditionActionMap
const conditionActionMap = {
  match_finished: ["display_summary", "display_result"],
  toss_done: ["toss_result"],
  match_scheduled: ["match_scheduled"],
  match_progress: [
    "player_Fifty",
    "player_Century",
    "player_Took_Wicket",
    "Player_Hat-trick",
    "player_Took_catch",
  ],
};

// Define the factory for the Trigger model
factory.define("trigger", Trigger, {
  name: () => faker.lorem.words(2),
  condition: () => faker.helpers.arrayElement(Object.keys(conditionActionMap)),
  network: () => ["social media"], // Set network to "social media"
  channels: () => ["instagram", "facebook"], // Set channels to "instagram" and "facebook"
  content: () => faker.lorem.sentence(),
  image: () => ({
    url: faker.image.url(), // Updated to use faker.image.url
  }),
  post: () => faker.string.uuid(),
  createdBy: () => faker.string.uuid(),
  updatedBy: () => faker.string.uuid(),
  reminderTime: () => faker.date.future(),
  status: () => faker.helpers.arrayElement(["sent", "not-send"]),
  targetType: () => faker.helpers.arrayElement(["match", "account", "league"]),
  targetId: () => faker.string.uuid(),
  humanApproval: () => faker.datatype.boolean(),
});

// Function to create dummy triggers
const dummyCreation = async (req) => {
  try {
    const count = parseInt(req.params.number, 10);
    if (isNaN(count) || count <= 0)
      throw new Error(req.__("invalidNumberFormat"));

    await Trigger.deleteMany({});
    const result = [];
    for (let i = 0; i < count; i++) {
      // Build the trigger using the factory
      const dummyTrigger = await factory.build("trigger");
      const actions = conditionActionMap[dummyTrigger.condition];
      // Set the action based on the condition
      dummyTrigger.action = faker.helpers.arrayElement(actions);
      await dummyTrigger.save();
      result.push(dummyTrigger);
    }

    return {
      data: result,
    };
  } catch (error) {
    throw new Error(error.message);
  }
};

export { dummyCreation };
