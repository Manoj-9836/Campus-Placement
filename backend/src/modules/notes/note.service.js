const Note = require("../../models/Note");
const mongoose = require("mongoose");

function toPublicNote(note) {
  return {
    id: note.id,
    title: note.title,
    body: note.body,
    kind: note.kind,
    question: note.question,
    updated: note.updatedAt.toISOString(),
    createdAt: note.createdAt,
  };
}

async function listNotes(owner) {
  const notes = await Note.find({ ownerClerkId: owner.clerkId }).sort({ updatedAt: -1 }).lean();
  return notes.map((note) => ({
    id: note._id.toString(),
    title: note.title,
    body: note.body,
    kind: note.kind,
    question: note.question,
    updated: note.updatedAt.toISOString(),
    createdAt: note.createdAt,
  }));
}

async function createNote(owner, input) {
  const note = await Note.create({
    ...input,
    ownerClerkId: owner.clerkId,
    ownerEmail: owner.email,
  });
  return toPublicNote(note);
}

async function deleteNote(owner, noteId) {
  if (!mongoose.isValidObjectId(noteId)) {
    const error = new Error("Note not found");
    error.statusCode = 404;
    error.code = "NOTE_NOT_FOUND";
    throw error;
  }
  const result = await Note.deleteOne({ _id: noteId, ownerClerkId: owner.clerkId });
  if (result.deletedCount === 0) {
    const error = new Error("Note not found");
    error.statusCode = 404;
    error.code = "NOTE_NOT_FOUND";
    throw error;
  }
}

module.exports = { listNotes, createNote, deleteNote };
