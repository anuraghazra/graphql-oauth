const { AuthenticationError } = require("apollo-server-express");
const { Todo } = require("../models/Todo");
const { User } = require("../models/User");
const TodoController = require("../controllers/TodoController");

const useAuth = (next) => (root, args, context, info) => {
  if (!context.getUser()) {
    throw new AuthenticationError("User not authenticated");
  }
  return next(root, args, context, info);
};

const resolvers = {
  Query: {
    todos: useAuth(() => Todo.find({})),
    users: useAuth(() => User.find({})),
    me: (root, args, context) => {
      return context.getUser();
    },
  },

  Mutation: {
    addTodo: useAuth(TodoController.addTodo),
    deleteTodo: useAuth(TodoController.deleteTodo),
    toggleTodo: useAuth(TodoController.toggleTodo),
    logout: (parent, args, { logout }) => {
      logout();
      return true;
    },
  },
};

module.exports = resolvers;
