const graphql = require('graphql');
const _ = require('lodash');
const axios = require('axios');

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLSchema,
} = graphql;

const CompanyType = new GraphQLObjectType({
  name: 'Company',
  fields: {
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    description: { type: GraphQLString },
  }
});

const UserType = new GraphQLObjectType({
  name: 'User',
  fields: {
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    gender: { type: GraphQLString },
    email: { type: GraphQLString },
    company: {
      type: CompanyType,
      async resolve(parentValue, args) {
        const response = await axios.get(`http://localhost:3000/company/${parentValue.companyId}`);
        return response.data;
      }
    }
  }
});

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    user: {
      type: UserType,
      args: {
        id: {
          type: GraphQLString
        }
      },
      async resolve(parentValue, args) {
        const response = await axios.get(`http://localhost:3000/users/${args.id}`);
        return response.data;
      }
    },
    company: {
      type: CompanyType,
      args: {
        id: {
          type: GraphQLString
        }
      },
      async resolve(parentValue, args) {
        const response = await axios.get(`http://localhost:3000/company/${args.id}`);
        return response.data;
      }
    }
  }
});

module.exports = new GraphQLSchema({
  query: RootQuery
});
