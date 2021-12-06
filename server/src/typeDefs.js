import { gql } from 'apollo-server-express';

export default gql`
  type User {
    _id: ID!
    username: String!
    email: String!
  }

  type Domain {
    _id: ID!
    title: String!
    createdAt: String!
    collections: [Collection]!
  }

  type Collection {
    _id: ID!
    title: String!
    createdAt: String!
    dueDate: String
    todos: [Todo]!
    domainId: String!
  }

  type Todo {
    _id: ID!
    title: String!
    createdAt: String!
    dueDate: String
    links: [Link]!
    collectionId: String!
    domainId: String!
  }

  type Link {
    _id: ID!
    url: String
    title: String!
    createdAt: String!
    isWatched: Boolean!
    dueDate: String
    watchedAt: String
    todoId: String!
    collectionId: String!
    domainId: String!
  }

  input UserInput {
    username: String!
    email: String!
  }

  input DomainInput {
    title: String!
  }

  input CollectionInput {
    title: String!
  }

  input TodoInput {
    title: String!
  }

  input LinkInput {
    title: String!
  }

  type Query {
    me: User
    # TODO edit
    getUser(username: String!): User
    getDomains: [Domain]!
    getCollections(domainId: ID!): [Collection]!
    getTodos(collectionId: ID!): [Todo]!
    getLinks(todoId: ID!): [Link]!
  }

  type Mutation {
    addUser(input: UserInput!): User
    saveDomain(input: DomainInput!): Domain
    saveCollection(input: CollectionInput!): Collection
    saveTodo(input: TodoInput!): Todo
    saveLink(input: LinkInput!): Link
  }
`;
