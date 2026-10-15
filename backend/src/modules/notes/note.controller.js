const { createNoteSchema, validate } = require("./note.schemas");
const noteService = require("./note.service");

async function list(req, res, next) {
  try {
    return res.status(200).json({ notes: await noteService.listNotes(req.clerkUser) });
  } catch (error) {
    return next(error);
  }
}

async function create(req, res, next) {
  try {
    const input = validate(createNoteSchema, req.body);
    return res.status(201).json({ note: await noteService.createNote(req.clerkUser, input) });
  } catch (error) {
    return next(error);
  }
}

async function remove(req, res, next) {
  try {
    await noteService.deleteNote(req.clerkUser, req.params.noteId);
    return res.status(204).send();
  } catch (error) {
    return next(error);
  }
}

module.exports = { list, create, remove };
