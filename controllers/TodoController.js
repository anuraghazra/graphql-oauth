const { Todo } = require("../models/Todo");
const { ApolloError } = require("apollo-server-express");

exports.addTodo = async (_, { title }) => {
  let todo = new Todo({ title });
  await todo.save();
  return todo;
};

exports.updateTodo = async (_, { id, title }) => {
  let updatedTodo = await Todo.findByIdAndUpdate(
    id,
    { title: title },
    { new: true }
  );
  return updatedTodo;
};

exports.deleteTodo = async (_, { id }) => {
  let todo = await Todo.findByIdAndRemove(id);
  if (!todo) throw new ApolloError("Unable to find todo with id: " + id);
  return todo;
};

exports.toggleTodo = async (_, { id }) => {
  try {
    let todo = await Todo.findById(id);
    if (!todo) throw new ApolloError("Unable to find todo with id: " + id);

    todo.isDone = !todo.isDone;
    await todo.save();
    return todo;
  } catch (err) {
    throw err;
  }
};
