import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client/core'

const domainApi = import.meta.env.MODE === 'production'
  ? 'https://druzba-nn.ru/graphql'
  : 'http://localhost:3001/graphql';

console.log('domainApi', domainApi);
// HTTP connection to the API
const httpLink = createHttpLink({
  // You should use an absolute URL here
  uri: domainApi,
})

// Cache implementation
const cache = new InMemoryCache()

// Create the apollo client
const apolloClient = new ApolloClient({
  link: httpLink,
  fetchOptions: {
    mode: 'no-cors'
  },
  cache,
})

export default {
    default: apolloClient,
};