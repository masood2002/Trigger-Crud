import mongoose from "mongoose";
const Schema = mongoose.Schema;

const triggerSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    createdBy: {
      type: String,
      required: true,
    },
    updatedBy: {
      type: String,
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

    networks: {
      type: [String],
      required: true,
    },
    channels: {
      type: [String],
      required: true,
    },
    status: {
      type: String,
      enum: ["sent", "not-send"],
      default: "not-send",
    },
    content: {
      type: String,
      required: false,
    },
    image: {
      url: {
        type: String,
        required: true,
      },
    },

    targetType: {
      type: String,
      enum: ["match", "account", "league"],
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
triggerSchema.pre("save", function (next) {
  if (this.isNew) {
    // Logic to run before creating a document
    console.log("Pre-create hook triggered");
  } else {
    // Logic to run before updating a document
    console.log("Pre-update hook triggered");
  }

  // Custom logic here
  next();
});
triggerSchema.pre("findOneAndUpdate", function (next) {
  console.log("Pre-update hook triggered");
  // Custom logic here
  next();
});

const Trigger = mongoose.model("Trigger", triggerSchema);

export default Trigger;
