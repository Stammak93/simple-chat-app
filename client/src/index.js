import React from 'react';
import ReactDOM from 'react-dom/client';
import {
    ApolloClient,
    InMemoryCache,
    ApolloProvider,
} from "@apollo/client";

import App from './App';


const graphClient = new ApolloClient({
    uri: "/graphql",
    cache: new InMemoryCache(),
    credentials: "include"
})


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <ApolloProvider client={graphClient}>
        <App />
    </ApolloProvider>
);
