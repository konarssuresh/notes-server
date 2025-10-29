const mongoose = require("mongoose");

const notesSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      maxLength: 200,
    },
    content: {
      type: String,
      required: true,
    },
    tags: {
      type: [String],
      maxLength: 15,
      validate(value) {
        for (let tag of value) {
          let count = value?.filter?.((v) => v === tag)?.length;
          if (count > 1) {
            throw new Error("Duplicate tag exists");
          }
        }
      },
    },
    status: {
      type: String,
      enum: {
        values: ["active", "archieved"],
        message: "{VALUE} is not supported",
      },
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

notesSchema.index({ userId: 1 });

const Note = mongoose.model("Notes", notesSchema);

module.exports = { Note };
