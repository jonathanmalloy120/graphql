var { graphqlHTTP } = require("express-graphql");
var { buildSchema, assertInputType } = require("graphql");
var express = require("express");

// Construct a schema, using GraphQL schema language
var restaurants = [
  {
    id: 1,
    name: "WoodsHill ",
    description:
      "American cuisine, farm to table, with fresh produce every day",
    dishes: [
      {
        name: "Swordfish grill",
        price: 27,
      },
      {
        name: "Roasted Broccily ",
        price: 11,
      },
    ],
  },
  {
    id: 2,
    name: "Fiorellas",
    description:
      "Italian-American home cooked food with fresh pasta and sauces",
    dishes: [
      {
        name: "Flatbread",
        price: 14,
      },
      {
        name: "Carbonara",
        price: 18,
      },
      {
        name: "Spaghetti",
        price: 19,
      },
    ],
  },
  {
    id: 3,
    name: "Karma",
    description:
      "Malaysian-Chinese-Japanese fusion, with great bar and bartenders",
    dishes: [
      {
        name: "Dragon Roll",
        price: 12,
      },
      {
        name: "Pancake roll ",
        price: 11,
      },
      {
        name: "Cod cakes",
        price: 13,
      },
    ],
  },
];
var schema = buildSchema(`
type Query{
  restaurant(id: Int): restaurant
  restaurants: [restaurant]
},
type restaurant {
  id: Int
  name: String
  description: String
  dishes:[Dish]
}
type Dish{
  name: String
  price: Int
}
input restaurantInput{
  name: String
  description: String
}
type DeleteResponse{
  ok: Boolean!
}
type Mutation{
  setrestaurant(input: restaurantInput): restaurant
  deleterestaurant(id: Int!): DeleteResponse
  editrestaurant(id: Int!, name: String!): restaurant
}
`);
// The root provides a resolver function for each API endpoint
//games: () => gameCatalogue


var root = {
  restaurant: (arg) => {
    // Your code goes here
    return restaurants[arg.id]
  },
  restaurants: () => {
    // Your code goes here
    return restaurants
  },
  setrestaurant: ({ input }) => {
    // Your code goes here
    restaurants.push({name:input.name, description:input.description});
    return input
  },
  deleterestaurant: ({ id }) => {
    // Your code goes here
    let todelete = restaurants.filter(item => item.id === id); //get object we want to delete
    const ok = Boolean(todelete.length !==0); //if it exists, true, if not false
    restaurants = restaurants.filter(item => item.id !== id) //return all items that do not == id
    console.log(JSON.stringify(todelete))
    return{ok}
  },
  editrestaurant: ({ id, ...restaurant }) => {
    // Your code goes here
    if(!restaurants[id]) {
      console.log(restaurants[1])
      throw new Error(`Contact with id ${id} Doesn't Exist`);
    }
    restaurants[id] = {
      ...restaurants[id],...restaurant
    }
    return restaurants[id];
  },
};
var app = express();
app.use(
  "/graphql",
  graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,
  })
);
var port = 5500;
app.listen(5500, () => console.log("Running Graphql on Port:" + port));
