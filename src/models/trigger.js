import mongoose from "mongoose";
const Schema = mongoose.Schema;

const triggerSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["match", "player", "official"],
      required: true,
    },
    action: {
      type: String,
      required: true,
    },
    condition: {
      type: String,
      required: true,
    },

    network: {
      type: [String],
      required: true,
    },
    channels: {
      type: [String],
      required: true,
    },
    post: {
      type: String,
      required: true,
    },
    reminderTime: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["send", "not-sent"],
      default: "not-sent",
    },
    targetType: {
      type: String,
      enum: ["account", "league", "match"],
      required: true,
    },
    targetId: {
      type: String,
      required: true,
    },
    humanApproval: {
      type: Boolean,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
const Trigger = mongoose.model("Trigger", triggerSchema);

export default Trigger;
