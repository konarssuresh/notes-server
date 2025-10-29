const express = require("express");
const { validateUser } = require("../middleware/auth");
const {
  validateCreateNotesRequest,
  validateUpdateNotesRequest,
} = require("../utils/validators");
const { Note } = require("../models/note");

const notesRouter = express.Router();

notesRouter.post("/notes", validateUser, async (req, res) => {
  try {
    validateCreateNotesRequest(req);
    let { _id: userId } = req.user;
    const { title, content, tags = [] } = req.body;
    let note = new Note({ title, content, tags, userId, status: "active" });
    let data = await note.save();
    res.status(201).send(data);
  } catch (e) {
    res.status(400).send("Error -" + e?.message);
  }
});

notesRouter.post(
  "/notes/:noteId/:actionType",
  validateUser,
  async (req, res) => {
    try {
      let noteId = req.params.noteId;
      let actionType = req.params.actionType;

      if (!["archieve", "unarchieve"].includes(actionType)) {
        throw new Error("invalid action type");
      }

      let note = await Note.findById(noteId);
      if (!note) {
        return res.status(404).send("Note does not exist");
      }

      if (note.userId.toString() !== req.user._id.toString()) {
        return res.status(403).send("Invalid user");
      }

      if (actionType === "archieve") {
        note.status = "archieved";
      }

      if (actionType === "unarchieve") {
        note.status = "active";
      }

      const data = await note.save();
      res.send(data);
    } catch (e) {
      res.status(400).send("Error -" + e?.message);
    }
  }
);

notesRouter.patch("/notes/:noteId", validateUser, async (req, res) => {
  try {
    validateUpdateNotesRequest(req);

    let noteId = req.params.noteId;

    let note = await Note.findById(noteId);
    if (!note) {
      return res.status(404).send("Note does not exist");
    }

    if (note.userId.toString() !== req.user._id.toString()) {
      return res.status(403).send("Invalid user");
    }

    Object.keys(req.body).forEach((key) => {
      note[key] = req.body[key];
    });

    const data = await note.save();

    res.status(200).send(data);
  } catch (e) {
    res.status(400).send("Error -" + e?.message);
  }
});

notesRouter.delete("/notes/:noteId", validateUser, async (req, res) => {
  try {
    let noteId = req.params.noteId;

    let note = await Note.findById(noteId);
    if (!note) {
      return res.status(404).send("Note does not exist");
    }

    if (note.userId.toString() !== req.user._id.toString()) {
      return res.status(403).send("Invalid user");
    }

    await Note.deleteOne({ _id: noteId });

    res.status(200).send("Note deleted successfully");
  } catch (e) {
    res.status(400).send("Error - " + e?.message);
  }
});

notesRouter.get("/notes/:noteType", validateUser, async (req, res) => {
  try {
    const type = req.params.noteType;

    if (!["all", "active", "archieved"].includes(type)) {
      return res.status(400).send("Invalid type");
    }
    let status = "";
    if (type !== "all") {
      status = type;
    }
    let notes = await Note.find({
      userId: req.user._id,
      ...(status === "" ? {} : { status }),
    });

    res.send(notes);
  } catch (e) {
    res.status(400).send("Error -" + e?.message);
  }
});

module.exports = notesRouter;
