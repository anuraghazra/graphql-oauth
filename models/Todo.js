const mongoose = require("mongoose");

const TodoSchema = new mongoose.Schema({
  title: String,
  isDone: { type: Boolean, default: false },
});

const Todo = mongoose.model("Todo", TodoSchema, "todos");
module.exports = { Todo };
