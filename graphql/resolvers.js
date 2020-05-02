const { Todo } = require("../models/Todo");
const { User } = require("../models/User");
const TodoController = require("../controllers/TodoController");

const resolvers = {
  Query: {
    todos: () => Todo.find({}),
    users: () => User.find({}),
    me: (_root, _args, context) => {
      return context.getUser();
    },
  },

  Mutation: {
    addTodo: TodoController.addTodo,
    updateTodo: TodoController.updateTodo,
    deleteTodo: TodoController.deleteTodo,
    toggleTodo: TodoController.toggleTodo,
    logout: (_parent, _args, { logout }) => {
      logout();
      return true;
    },
  },
};

module.exports = resolvers;
