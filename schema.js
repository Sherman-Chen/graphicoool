const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLSchema,
  GraphQLList,
  GraphQLNonNull
} = require('graphql')
const axios = require('axios')
const mockDBUrl = 'http://localhost:3000';

// CustomerType
const CustomerType = new GraphQLObjectType({
  name: 'Customer',
  fields: () => ({
    id: {type: GraphQLString},
    name: {type: GraphQLString},
    email: {type: GraphQLString},
    age: {type: GraphQLInt}
  })
})

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    customer: {
      type: CustomerType,
      args: {
        id: {type: GraphQLString}
      },
      resolve(parentValue, args) {
        return axios.get(`${mockDBUrl}/customers/${args.id}`)
          .then(res => res.data)
          .catch(e => console.error(e))
      }
    },
    customers: {
      type: new GraphQLList(CustomerType),
      resolve(parentValue, args) {
        return axios.get(`${mockDBUrl}/customers`)
          .then(res => res.data)
          .catch(e => console.error(e))
      }
    }
  }
})

module.exports = new GraphQLSchema({
  query: RootQuery
});
