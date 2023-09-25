import React from "react";
import "./App.css";
import { Box } from "@mui/material";
import { MessagesPages } from "./pages/Messages";
import { useSnackbar } from "notistack";
import { onError } from "@apollo/client/link/error";
import {
  ApolloClient,
  ApolloProvider,
  from,
  HttpLink,
  InMemoryCache,
} from "@apollo/client";

function App() {
  const { enqueueSnackbar } = useSnackbar();

  const errorLink = onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors) {
      graphQLErrors.forEach((error) => {
        enqueueSnackbar({
          variant: "error",
          message: `[${error.name}]${error.message}`,
        });
      });
    }

    if (networkError) {
      // handle network error
      enqueueSnackbar({
        variant: "error",
        message: `[${networkError.name}]: ${networkError.message}`,
      });
    }
  });

  const client = new ApolloClient({
    link: from([
      errorLink,
      new HttpLink({ uri: process.env.REACT_APP_GRAPHQL_ENDPOINT }),
    ]),
    cache: new InMemoryCache(),
  });

  return (
    <ApolloProvider client={client}>
      <Box pt={5}>
        <MessagesPages />
      </Box>
    </ApolloProvider>
  );
}

export default App;
