const { AuthenticationError, UserInputError } = require('apollo-server-express');
const { User } = require('../models');
const { signToken } = require('../utils/auth');

const resolvers = {
    Query: {
    me: async (parent, args, context) => {
        if (context.user) {
            const userData = await User.findOne({ _id: context.user._id })
            .select('-__v -password')
            .populate('savedBooks');

            return userData;
        }

        throw new AuthenticationError('You are not logged in');
    },
    
    user: async (parent, { username }) => {
        return User.findOne({ username })
        .select('-__v -password')
        .populate('savedBooks');
    },
    
    book: async (parent, { bookId }) => {
        return Book.findOne({ bookId });
    }
},

Mutation: {
    createUser: async (parent, args) => {
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
    
    saveBook: async (parent, { bookId }, context) => {
    if (context.user) {
        const updatedUser = await User.findOneAndUpdate(
            { _id: context.user._id },
            { $addToSet: { savedBooks: body } },
            { new: true, runValidators: true }
        ).populate('books');

        return updatedUser;
        }

        throw new AuthenticationError('You need to be logged in to do that!')
    },

    deleteBook: async (parent, { bookId }, context) => {
        if (context.user) {
            const updatedUser = await User.findOneAndUpdate(
                { _id: context.user._id },
                { $pull: {savedBooks: { bookId: params.bookId } } },
                { new: true }
            ).populate('books');

            return updatedUser;
        }

        throw new AuthenticationError("Couldn't find user with this id!");
    }
}
};

module.exports = resolvers;