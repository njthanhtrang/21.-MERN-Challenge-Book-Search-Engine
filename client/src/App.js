import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import SearchBooks from "./pages/SearchBooks";
import SavedBooks from "./pages/SavedBooks";
import Navbar from "./components/Navbar";

// establish new link to GraphQL server at /graphql endpoint
const httpLink = createHttpLink({
  // absolute path to server, uniform resource identifier
  // uri: "http://localhost:3001/graphql"
  uri: "/graphql",
});

// omit first param (current request obj) in case fx is running after we've initiated request
const authLink = setContext((_, { headers }) => {
  // retrieve token from localStorage
  const token = localStorage.getItem("id_token");
  return {
    // set HTTP request headers of every request to include token
    // whether request needs or not, if doesn't need token, server-side resolver won't check for it
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

// instantiate ApolloClient instance, create connection to API endpoint
const client = new ApolloClient({
  // combine authLink and httpLink obj so
  // every request retrieves token and sets request headers before making request to API
  link: authLink.concat(httpLink),
  // instantiate new cache obj
  cache: new InMemoryCache(),
});

function App() {
  return (
    // pass in client variable as value for client prop in provider
    // everything between ApolloProvider tags have access to server's API data through client
    <ApolloProvider client={client}>
      <Router>
        <>
          <Navbar />
          <Switch>
            <Route exact path="/" component={SearchBooks} />
            <Route exact path="/saved" component={SavedBooks} />
            <Route render={() => <h1 className="display-2">Wrong page!</h1>} />
          </Switch>
        </>
      </Router>
    </ApolloProvider>
  );
}

export default App;
