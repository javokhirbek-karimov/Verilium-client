import decodeJWT from "jwt-decode";
import { initializeApollo } from "../../apollo/client";
import { userVar } from "../../apollo/store";
import { CustomJwtPayload, telegramData } from "../types/customJWTPayload";
import { LOGIN, SIGN_UP, TELEGRAM_LOGIN } from "../../apollo/user/mutation";
import { sweetMixinErrorAlert } from "../sonner";

export const telegramLogin = async (telegramData: telegramData) => {
  try {
    const apolloClient = await initializeApollo();

    const result = await apolloClient.mutate({
      mutation: TELEGRAM_LOGIN,
      variables: { input: telegramData },
      fetchPolicy: "network-only",
    });

    const { accessToken } = result?.data?.telegramLogin;

    if (accessToken) {
      updateStorage({ jwtToken: accessToken });
      updateUserInfo(accessToken);
    }
  } catch (err) {
    console.error("Telegram login error", err);
    await sweetMixinErrorAlert("Telegram login failed");
  }
};

export function getJwtToken(): any {
  if (typeof window !== "undefined") {
    return localStorage.getItem("accessToken") ?? "";
  }
}

export function setJwtToken(token: string) {
  localStorage.setItem("accessToken", token);
}

export const logIn = async (nick: string, password: string): Promise<void> => {
  const { jwtToken } = await requestJwtToken({ nick, password });
  updateStorage({ jwtToken });
  updateUserInfo(jwtToken);
};

const requestJwtToken = async ({
  nick,
  password,
}: {
  nick: string;
  password: string;
}): Promise<{ jwtToken: string }> => {
  const apolloClient = await initializeApollo();

  const result = await apolloClient.mutate({
    mutation: LOGIN,
    variables: { input: { memberNick: nick, memberPassword: password } },
    fetchPolicy: "network-only",
  });

  const accessToken = result?.data?.login?.accessToken;
  if (!accessToken) throw new Error("Login failed. Please try again.");

  return { jwtToken: accessToken };
};

export const signUp = async (
  nick: string,
  password: string,
  phone: string,
  type: string,
): Promise<void> => {
  const { jwtToken } = await requestSignUpJwtToken({ nick, password, phone, type });
  updateStorage({ jwtToken });
  updateUserInfo(jwtToken);
};

const requestSignUpJwtToken = async ({
  nick,
  password,
  phone,
  type,
}: {
  nick: string;
  password: string;
  phone: string;
  type: string;
}): Promise<{ jwtToken: string }> => {
  const apolloClient = await initializeApollo();

  const result = await apolloClient.mutate({
    mutation: SIGN_UP,
    variables: {
      input: {
        memberNick: nick,
        memberPassword: password,
        memberPhone: phone,
      },
    },
    fetchPolicy: "network-only",
  });

  const accessToken = result?.data?.signup?.accessToken;
  if (!accessToken) throw new Error("Sign up failed. Please try again.");

  return { jwtToken: accessToken };
};

export const updateStorage = ({ jwtToken }: { jwtToken: any }) => {
  setJwtToken(jwtToken);
  window.localStorage.setItem("login", Date.now().toString());
};

export const updateUserInfo = (jwtToken: any) => {
  if (!jwtToken) return false;

  const claims = decodeJWT<CustomJwtPayload>(jwtToken);
  userVar({
    _id: claims._id ?? "",
    memberType: claims.memberType ?? "",
    memberStatus: claims.memberStatus ?? "",
    memberAuthType: claims.memberAuthType,
    memberPhone: claims.memberPhone ?? "",
    memberNick: claims.memberNick ?? "",
    memberFullName: claims.memberFullName ?? "",
    memberImage:
      claims.memberImage === null || claims.memberImage === undefined
        ? "/img/profile/defaultUser.svg"
        : `${claims.memberImage}`,
    memberAddress: claims.memberAddress ?? "",
    memberDesc: claims.memberDesc ?? "",
    memberPerfumes: claims.memberPerfumes,
    memberRank: claims.memberRank,
    memberArticles: claims.memberArticles,
    memberPoints: claims.memberPoints,
    memberLikes: claims.memberLikes,
    memberViews: claims.memberViews,
    memberWarnings: claims.memberWarnings,
    memberBlocks: claims.memberBlocks,
  });
};

export const logOut = () => {
  deleteStorage();
  deleteUserInfo();
};

const deleteStorage = () => {
  localStorage.removeItem("accessToken");
  window.localStorage.setItem("logout", Date.now().toString());
};

const deleteUserInfo = () => {
  userVar({
    _id: "",
    memberType: "",
    memberStatus: "",
    memberAuthType: "",
    memberPhone: "",
    memberNick: "",
    memberFullName: "",
    memberImage: "",
    memberAddress: "",
    memberDesc: "",
    memberPerfumes: 0,
    memberRank: 0,
    memberArticles: 0,
    memberPoints: 0,
    memberLikes: 0,
    memberViews: 0,
    memberWarnings: 0,
    memberBlocks: 0,
  });
};
