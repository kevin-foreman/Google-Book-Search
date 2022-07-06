import { gql } from '@apollo/client';

export const LOGIN_USER = gql`
mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
        token
        user {
            _id
            username
        }
    }
}
`;

export const ADD_USER = gql`
mutation addUser($username: String!, $email: String!, $password: String!) {
    addUser(username: $username, email: $email, password: $password) {
        token
        user {
        _id
        username
        }
    }
}
`;

export const SAVE_BOOK  = gql`
mutation addBook($id: ID!) {
    addBook(friendId: $id) {
        _id
        username
        savedBooks {
        bookId
        }
        }
    }
`;

export const REMOVE_BOOK = gql`
mutation deleteBook($id: bookId!) {
    deleteBook(bookId: $id) {
        _id
    }
}`