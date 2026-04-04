import React, { useCallback, useEffect, useRef, useState } from "react";
import { NextPage } from "next";
import useDeviceDetect from "../../libs/hooks/useDeviceDetect";
import withLayoutBasic from "../../libs/components/layout/layoutBasic";
import {
  Box,
  Button,
  CircularProgress,
  Stack,
  Typography,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useRouter } from "next/router";
import { useMutation } from "@apollo/client";
import { TELEGRAM_LOGIN } from "../../apollo/user/mutation";
import { logIn, signUp, updateStorage, updateUserInfo } from "../../libs/auth";
import { sweetMixinErrorAlert } from "../../libs/sonner";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { telegramData } from "../../libs/types/customJWTPayload";
import Link from "next/link";

export const getStaticProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ["common"])),
  },
});

const Join: NextPage = () => {
  const router = useRouter();
  const device = useDeviceDetect();
  const telegramRef = useRef<HTMLDivElement>(null);

  const [loginView, setLoginView] = useState<boolean>(true);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [input, setInput] = useState({ nick: "", password: "", phone: "" });

  /** APOLLO MUTATIONS **/
  const [telegramLoginMutation] = useMutation(TELEGRAM_LOGIN);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  /** HANDLERS **/
  const handleInput = useCallback((name: string, value: string) => {
    setInput((prev) => ({ ...prev, [name]: value }));
  }, []);

  const switchView = (toLogin: boolean) => {
    setLoginView(toLogin);
    setInput({ nick: "", password: "", phone: "" });
    setShowPassword(false);
  };

  const doLogin = useCallback(async () => {
    try {
      setIsLoading(true);
      await logIn(input.nick, input.password);
      await router.push(`${router.query.referrer ?? "/"}`);
    } catch (err: any) {
      await sweetMixinErrorAlert(err.message ?? "Login failed. Please try again");
    } finally {
      setIsLoading(false);
    }
  }, [input, router]);

  const doSignUp = useCallback(async () => {
    // memberType always "USER" — Expert requires admin approval
    try {
      setIsLoading(true);
      await signUp(input.nick, input.password, input.phone, "USER");
      await router.push(`${router.query.referrer ?? "/"}`);
    } catch (err: any) {
      await sweetMixinErrorAlert(err.message ?? "Sign up failed. Please try again");
    } finally {
      setIsLoading(false);
    }
  }, [input, router]);

  const doTelegramLogin = useCallback(
    async (data: telegramData) => {
      try {
        const result = await telegramLoginMutation({
          variables: { input: data },
        });
        const accessToken = result?.data?.telegramLogin?.accessToken;
        if (accessToken) {
          updateStorage({ jwtToken: accessToken });
          updateUserInfo(accessToken);
          await router.push("/");
        }
      } catch {
        await sweetMixinErrorAlert("Telegram login failed. Please try again");
      }
    },
    [telegramLoginMutation, router],
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key !== "Enter" || isLoading) return;
    loginView ? doLogin() : doSignUp();
  };

  /** Telegram Widget **/
  useEffect(() => {
    const botName = process.env.NEXT_PUBLIC_TELEGRAM_BOT_NAME;
    if (!botName || !telegramRef.current) return;

    (window as any).onTelegramAuth = (data: telegramData) =>
      doTelegramLogin(data);

    telegramRef.current.innerHTML = "";

    const script = document.createElement("script");
    script.src = "https://telegram.org/js/telegram-widget.js?22";
    script.setAttribute("data-telegram-login", botName);
    script.setAttribute("data-size", "large");
    script.setAttribute("data-radius", "10");
    script.setAttribute("data-onauth", "onTelegramAuth(user)");
    script.setAttribute("data-request-access", "write");
    script.async = true;

    telegramRef.current.appendChild(script);

    return () => {
      delete (window as any).onTelegramAuth;
    };
  }, [doTelegramLogin]);

  const loginDisabled = !input.nick || !input.password || isLoading;
  const signupDisabled =
    !input.nick || !input.password || !input.phone || isLoading;

  if (device === "mobile") return <div>LOGIN MOBILE</div>;

  return (
    <Stack className="join-page">
      <Stack className="join-wrap">
        {/* ── Left: Form ─────────────────────────────────────── */}
        <Stack className="form-side">
          {/* Logo */}
          <Link href="/" className="join-logo">
            <img src="/img/logo/logoWhite-2.png" alt="Verilium" />
          </Link>

          {/* Heading */}
          <Stack className="join-heading">
            <Typography className="join-title">
              {loginView ? "Welcome back" : "Create account"}
            </Typography>
            <Typography className="join-sub">
              {loginView
                ? "Sign in to your Verilium account"
                : "Join the fragrance community"}
            </Typography>
          </Stack>

          {/* Inputs */}
          <Stack className="join-inputs">
            <Stack className="input-field">
              <label>Nickname</label>
              <input
                type="text"
                placeholder="Enter your nickname"
                value={input.nick}
                onChange={(e) => handleInput("nick", e.target.value)}
                onKeyDown={handleKeyDown}
                autoComplete="username"
              />
            </Stack>

            <Stack className="input-field">
              <label>Password</label>
              <div className="password-wrap">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={input.password}
                  onChange={(e) => handleInput("password", e.target.value)}
                  onKeyDown={handleKeyDown}
                  autoComplete={loginView ? "current-password" : "new-password"}
                />
                <button
                  type="button"
                  className="toggle-pw"
                  onClick={() => setShowPassword((v) => !v)}
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <VisibilityOff fontSize="small" />
                  ) : (
                    <Visibility fontSize="small" />
                  )}
                </button>
              </div>
            </Stack>

            {!loginView && (
              <Stack className="input-field">
                <label>Phone</label>
                <input
                  type="tel"
                  placeholder="Enter your phone number"
                  value={input.phone}
                  onChange={(e) => handleInput("phone", e.target.value)}
                  onKeyDown={handleKeyDown}
                  autoComplete="tel"
                />
              </Stack>
            )}
          </Stack>

          {/* Submit */}
          <Button
            className="join-btn"
            onClick={loginView ? doLogin : doSignUp}
            disabled={loginView ? loginDisabled : signupDisabled}
          >
            {isLoading ? (
              <CircularProgress
                size={20}
                sx={{ color: "var(--black-primary)" }}
              />
            ) : loginView ? (
              "Sign In"
            ) : (
              "Sign Up"
            )}
          </Button>

          {/* Divider */}
          <Stack className="join-divider">
            <span />
            <Typography>or continue with</Typography>
            <span />
          </Stack>

          {/* Telegram */}
          <Stack className="telegram-wrap">
            {/* Custom styled button (visible) */}
            <div className="tg-custom-btn">
              <img src="/img/icons/telegram.svg" alt="Telegram" className="tg-icon" />
              <span>Continue with Telegram</span>
            </div>
            {/* Real widget — invisible, overlaid on top to capture click */}
            <div ref={telegramRef} className="telegram-widget" />
          </Stack>

          {/* Toggle */}
          <Stack className="join-toggle">
            <Typography>
              {loginView
                ? "Don't have an account?"
                : "Already have an account?"}
            </Typography>
            <button onClick={() => switchView(!loginView)}>
              {loginView ? "Sign Up" : "Sign In"}
            </button>
          </Stack>
        </Stack>

        {/* ── Right: Visual ───────────────────────────────────── */}
        <Box className="visual-side" />
      </Stack>
    </Stack>
  );
};

export default withLayoutBasic(Join);
