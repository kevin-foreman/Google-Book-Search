const { AuthenticationError, UserInputError } = require('apollo-server-express');
const { User, Book } = require('../models');
const { signToken } = require('../utils/auth');

const resolvers = {
    Query: {
    User: async (parent, args, context) => {
        if (context.user) {
            const userData = await User.findOne({ _id: context.user._id })
            .select('-__v -password')
            .populate('savedBooks');

            return userData;
        }

        throw new AuthenticationError('You are not logged in');
    },
    users: async () => {
        return User.find()
        .select('-__v -password')
        .populate('savedBooks');
    },
    user: async (parent, { username }) => {
        return User.findOne({ username })
        .select('-__v -password')
        .populate('savedBooks');
    },
    savedBook: async (parent, { bookId }) => {
        return Book.findOne({ bookId });
    }
},

Mutation: {
    addUser: async (parent, args) => {
        const user = await User.create(args);
        const token = signToken(user);

        return { token, user };
    },
    login: async (parent, { email, password }) => {
        const user = await User.findOne({ email });

        if (!user) {
            throw new AuthenticationError('Incorrect credentials');
        }

        const correctPw = await user.isCorrectPassword(password);

        if (!correctPw) {
            throw new AuthenticationError('Incorrect credentials');
        }

        const token = signToken(user);
        return { token, user };
    },
    addBook: async (parent, { bookId }, context) => {
    if (context.user) {
        const updatedUser = await User.findOneAndUpdate(
            { _id: context.user._id },
            { $addToSet: { books: bookId } },
            {new: true}
        ).populate('books');

        return updatedUser;
        }

        throw new AuthenticationError('You need to be logged in to do that!')
    }
}
};

module.exports = resolvers;