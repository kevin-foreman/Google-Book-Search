import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

import SearchBooks from './pages/SearchBooks';
import SavedBooks from './pages/SavedBooks';
import Navbar from './components/Navbar';

const httpLink = createHttpLink({
  uri: '/graphql',
});

// const client = new ApolloClient({
//   request: (operation) => {
//     const token = localStorage.getItem('id_token');
//     operation.setContext({
//       headers: {
//         authorization: token ? `Bearer ${token}` : '',
//       },
//     });
//   },
//   uri: '/graphql'
// });

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('id_token');
  return {
    navbars: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

function App() {
  return (
    <ApolloProvider client={client}>
    <Router>
      <>
        <Navbar />
        <Routes>
          <Route exact path='/' element={SearchBooks} />
          <Route exact path='/saved' element={SavedBooks} />
          <Route component={SearchBooks} />
          <Route render={() => <h1 className='display-2'>Wrong page!</h1>} />
        </Routes>
      </>
    </Router>
    </ApolloProvider>
  );
};

export default App;
