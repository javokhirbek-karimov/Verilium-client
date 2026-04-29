import { useMemo } from "react";
import {
  ApolloClient,
  ApolloLink,
  InMemoryCache,
  split,
  from,
  NormalizedCacheObject,
} from "@apollo/client";
import createUploadLink from "apollo-upload-client/public/createUploadLink.js";
import { WebSocketLink } from "@apollo/client/link/ws";
import { getMainDefinition } from "@apollo/client/utilities";
import { onError } from "@apollo/client/link/error";
import { getJwtToken } from "../libs/auth";
import { TokenRefreshLink } from "apollo-link-token-refresh";
import { sweetErrorAlert } from "../libs/sonner";
import { socketVar } from "./store";
let apolloClient: ApolloClient<NormalizedCacheObject>;

function getHeaders() {
  const headers = {} as HeadersInit;
  const token = getJwtToken();
  // @ts-ignore
  if (token) headers["Authorization"] = `Bearer ${token}`;
  return headers;
}

const tokenRefreshLink = new TokenRefreshLink({
  accessTokenField: "accessToken",
  isTokenValidOrUndefined: () => {
    return true;
  }, // @ts-ignore
  fetchAccessToken: () => {
    // execute refresh token
    return null;
  },
});

// Custom WebSocket client
class LoggingWebSocket {
  private socket: WebSocket;
  private queue: Parameters<WebSocket["send"]>[0][] = [];
  private url: string;
  private shouldReconnect = true;
  private reconnectDelay = 3000;

  constructor(url: string) {
    this.url = url;
    this.connect();
  }

  private connect() {
    this.socket = new WebSocket(`${this.url}?token=${getJwtToken()}`);
    socketVar(this.socket);

    this.socket.onopen = () => {
      this.queue.forEach((msg) => this.socket.send(msg));
      this.queue = [];
    };

    this.socket.onclose = () => {
      if (this.shouldReconnect) {
        setTimeout(() => this.connect(), this.reconnectDelay);
      }
    };

    this.socket.onerror = () => {};
  }

  send(data: string | Blob | BufferSource) {
    if (this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(data as Parameters<WebSocket["send"]>[0]);
    } else {
      this.queue.push(data as Parameters<WebSocket["send"]>[0]);
    }
  }

  close() {
    this.shouldReconnect = false;
    this.socket.close();
  }
}

function createIsomorphicLink(): ApolloLink {
  if (typeof window !== "undefined") {
    const authLink = new ApolloLink((operation, forward) => {
      operation.setContext(({ headers = {} }) => ({
        headers: {
          ...headers,
          ...getHeaders(),
        },
      }));
      return forward(operation);
    });

    // @ts-ignore
    const link = new createUploadLink({
      uri: process.env.NEXT_PUBLIC_API_GRAPHQL_URL,
    });

    /* WEBSOCKET SUBSCRIPTION LINK */
    const wsLink = new WebSocketLink({
      uri: process.env.NEXT_PUBLIC_API_WS ?? "ws://127.0.0.1:3007",
      options: {
        reconnect: false,
        timeout: 30000,
        connectionParams: () => {
          return { headers: getHeaders() };
        },
      },
      webSocketImpl: LoggingWebSocket,
    });

    const errorLink = onError(({ graphQLErrors, networkError, response }) => {
      if (graphQLErrors) {
        graphQLErrors.map(({ message, locations, path, extensions }) => {
          console.log(
            `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
          );
          if (!message.includes("input")) sweetErrorAlert(message);
        });
      }
      if (networkError) console.log(`[Network error]: ${networkError}`);
      // @ts-ignore
      if (networkError?.statusCode === 401) {
      }
    });

    const splitLink = split(
      ({ query }) => {
        const definition = getMainDefinition(query);
        return (
          definition.kind === "OperationDefinition" &&
          definition.operation === "subscription"
        );
      },
      wsLink,
      authLink.concat(link),
    );

    return from([errorLink, tokenRefreshLink, splitLink]);
  }

  // SSR fallback: no-op link (no real requests on server)
  return new ApolloLink((operation, forward) => forward(operation));
}

function createApolloClient() {
  return new ApolloClient({
    ssrMode: typeof window === "undefined",
    link: createIsomorphicLink(),
    cache: new InMemoryCache(),
    resolvers: {},
  });
}

export function initializeApollo(initialState = null) {
  const _apolloClient = apolloClient ?? createApolloClient();
  if (initialState) _apolloClient.cache.restore(initialState);
  if (typeof window === "undefined") return _apolloClient;
  if (!apolloClient) apolloClient = _apolloClient;

  return _apolloClient;
}

export function useApollo(initialState: any) {
  return useMemo(() => initializeApollo(initialState), [initialState]);
}

/**
import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";

// No Subscription required for develop process

const httpLink = createHttpLink({
  uri: "http://localhost:3007/graphql",
});

const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
});

export default client;
*/
