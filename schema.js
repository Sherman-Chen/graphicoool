const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLSchema,
  GraphQLList,
  GraphQLNonNull
} = require('graphql')
const axios = require('axios')
const mockDBUrl = 'http://localhost:3000/customers'

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

// queries
const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    customer: {
      type: CustomerType,
      args: {
        id: {type: GraphQLString}
      },
      resolve (parentValue, args) {
        return axios.get(`${mockDBUrl}/${args.id}`)
          .then(res => res.data)
          .catch(e => console.error(e))
      }
    },
    customers: {
      type: new GraphQLList(CustomerType),
      resolve (parentValue, args) {
        return axios.get(`${mockDBUrl}`)
          .then(res => res.data)
          .catch(e => console.error(e))
      }
    }
  }
})

// mutations
const mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addCustomer: {
      type: CustomerType,
      args: {
        name: {type: new GraphQLNonNull(GraphQLString)},
        email: {type: new GraphQLNonNull(GraphQLString)},
        age: {type: new GraphQLNonNull(GraphQLInt)}
      },
      resolve (parentValue, args) {
        return axios.post(mockDBUrl, {
          name: args.name,
          email: args.email,
          age: args.age
        })
        .then(res => res.data)
        .catch(e => console.error(e))
      }
    },
    deleteCustomer: {
      type: CustomerType,
      args: {
        id: {type: new GraphQLNonNull(GraphQLString)}
      },
      resolve (parentValue, args) {
        return axios.delete(`${mockDBUrl}/${args.id}`)
          .then(res => res.data)
          .catch(e => console.error(e))
      }
    },
    updateCustomer: {
      type: CustomerType,
      args: {
        id: {type: new GraphQLNonNull(GraphQLString)},
        name: {type: GraphQLString},
        email: {type: GraphQLString},
        age: {type: GraphQLInt}
      },
      resolve (parentValue, args) {
        return axios.patch(`${mockDBUrl}/${args.id}`, args)
          .then(res => res.data)
          .catch(e => console.error(e))
      }
    }
  }
})

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation
})
