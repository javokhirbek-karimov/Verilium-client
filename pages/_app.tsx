import type { AppProps } from "next/app";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import React, { useEffect, useState } from "react";
import { light } from "../scss/MaterialTheme";
import { ApolloProvider } from "@apollo/client";
import { useApollo } from "../apollo/client";
import { appWithTranslation } from "next-i18next";
import nextI18NextConfig from "../next-i18next.config";
import { Toaster } from "sonner";
import { socketVar } from "../apollo/store";
import { getJwtToken } from "../libs/auth";
import { GoogleOAuthProvider } from "@react-oauth/google";
import "../scss/app.scss";
import "../scss/pc/main.scss";
import "../scss/mobile/main.scss";

const App = ({ Component, pageProps }: AppProps) => {
  // @ts-ignore
  const [theme, setTheme] = useState(createTheme(light));
  const client = useApollo(pageProps.initialApolloState);

  useEffect(() => {
    const token = getJwtToken();
    const WS_URL = process.env.NEXT_PUBLIC_API_WS ?? "ws://localhost:3007";
    const ws = new WebSocket(token ? `${WS_URL}?token=${token}` : WS_URL);

    ws.onopen = () => socketVar(ws);
    ws.onerror = (err) => console.error("[Chat WS] error:", err);
    ws.onclose = () => console.log("[Chat WS] disconnected");

    return () => ws.close();
  }, []);

  return (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}>
      <ApolloProvider client={client}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Component {...pageProps} />
          <Toaster
            position="top-center"
            toastOptions={{
              style: {
                background: "#1a1a1a",
                color: "#eaeaea",
                border: "1px solid #d4af37",
                fontSize: "16px",
                padding: "16px 20px",
                minWidth: "320px",
              },
              classNames: {
                success: "toast-success",
                error: "toast-error",
              },
            }}
          />
        </ThemeProvider>
      </ApolloProvider>
    </GoogleOAuthProvider>
  );
};

export default appWithTranslation(App, nextI18NextConfig as any);
