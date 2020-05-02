const { defaultFieldResolver } = require("graphql");
const {
  SchemaDirectiveVisitor,
  AuthenticationError,
} = require("apollo-server-express");

class AuthDirective extends SchemaDirectiveVisitor {
  visitFieldDefinition(field) {
    const originalResolver = field.resolve || defaultFieldResolver;

    field.resolve = async (...args) => {
      const context = args[2];
      if (!context.isAuthenticated()) {
        throw new AuthenticationError("User not authenticated");
      }

      return originalResolver.apply(this, args);
    };
  }
}

module.exports = AuthDirective;
