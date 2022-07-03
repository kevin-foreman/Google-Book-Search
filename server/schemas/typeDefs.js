const { gql } = require('apollo-server-express');

const typeDefs = gql`
    type User {
        _id: ID
        username: String
        email: String
        savedBooks: [bookSchema]
    }

    type Book {
        authors: String
        description: String!
        bookId: String!
        image: String
        link: String
        title: String!
    }
`;

module.exports = typeDefs;