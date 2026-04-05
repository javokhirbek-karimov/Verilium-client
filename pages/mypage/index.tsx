import React, { useEffect } from "react";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { NextPage } from "next";
import { Stack, Typography } from "@mui/material";
import useDeviceDetect from "../../libs/hooks/useDeviceDetect";
import withLayoutBasic from "../../libs/components/layout/layoutBasic";
import MyMenu from "../../libs/components/myPage/MyMenu";
import MyProfile from "../../libs/components/myPage/MyProfile";
import MyPerfumes from "../../libs/components/myPage/MyPerfumes";
import AddNewPerfume from "../../libs/components/myPage/AddNewPerfume";
import MyFavorites from "../../libs/components/myPage/MyFavourite";
import RecentlyVisited from "../../libs/components/myPage/RecentlyVisited";
import MyArticles from "../../libs/components/myPage/MyArticles";
import WriteArticle from "../../libs/components/myPage/WriteArticle";
import MemberFollowers from "../../libs/components/myPage/MemberFollowers";
import MemberFollowings from "../../libs/components/myPage/MemberFollowings";
import { useMutation, useReactiveVar } from "@apollo/client";
import { userVar } from "../../apollo/store";
import {
  LIKE_TARGET_MEMBER,
  SUBSCRIBE,
  UNSUBSCRIBE,
} from "../../apollo/user/mutation";
import { Messages } from "../../libs/config";
import {
  sweetErrorHandling,
  sweetTopSmallSuccessAlert,
} from "../../libs/sonner";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

export const getStaticProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ["common"])),
  },
});

const MyPage: NextPage = () => {
  const { t } = useTranslation("common");
  const device = useDeviceDetect();
  const user = useReactiveVar(userVar);
  const router = useRouter();
  const category: string = (router.query?.category as string) ?? "myProfile";

  /** APOLLO REQUESTS **/
  const [subscribe] = useMutation(SUBSCRIBE);
  const [unsubscribe] = useMutation(UNSUBSCRIBE);
  const [likeTargetMember] = useMutation(LIKE_TARGET_MEMBER);

  /** LIFECYCLES **/
  useEffect(() => {
    if (!user._id) router.push("/").then();
  }, [user]);

  useEffect(() => {
    const expertOnlyRoutes = ["myArticles", "writeArticle", "followers", "addPerfume", "myPerfumes"];
    if (user._id && user.memberType === "USER" && expertOnlyRoutes.includes(category)) {
      router.replace({ pathname: "/mypage", query: { category: "myProfile" } }).then();
    }
  }, [user, category]);

  /** HANDLERS **/
  const subscribeHandler = async (id: string, refetch: any, query: any) => {
    try {
      if (!id) throw new Error(Messages.error1);
      if (!user._id) throw new Error(Messages.error2);
      await subscribe({ variables: { input: id } });
      await sweetTopSmallSuccessAlert("Subscribed!", 800);
      await refetch({ input: query });
    } catch (err: any) {
      sweetErrorHandling(err).then();
    }
  };

  const unsubscribeHandler = async (id: string, refetch: any, query: any) => {
    try {
      if (!id) throw new Error(Messages.error1);
      if (!user._id) throw new Error(Messages.error2);
      await unsubscribe({ variables: { input: id } });
      await sweetTopSmallSuccessAlert("Unsubscribed!", 800);
      await refetch({ input: query });
    } catch (err: any) {
      sweetErrorHandling(err).then();
    }
  };

  const likeMemberHandler = async (id: string, refetch: any, query: any) => {
    try {
      if (!id) return;
      if (!user._id) throw new Error(Messages.error2);
      await likeTargetMember({ variables: { input: id } });
      await sweetTopSmallSuccessAlert("Success!", 800);
      await refetch({ input: query });
    } catch (err: any) {
      sweetErrorHandling(err).then();
    }
  };

  const redirectToMemberPageHandler = async (memberId: string) => {
    try {
      if (memberId === user?._id) await router.push(`/mypage`);
      else await router.push(`/member?memberId=${memberId}`);
    } catch (error) {
      await sweetErrorHandling(error);
    }
  };

  if (device === "mobile") return <div>MY PAGE MOBILE</div>;

  return (
    <div id="my-page">
      {/* ── Hero ─────────────────────────────────────────────────── */}
      <div className="hero-section">
        <div className="hero-content">
          <Typography className="hero-label">{t("Dashboard")}</Typography>
          <Typography className="hero-title">
            {t("My")} <span>{t("Account")}</span>
          </Typography>
          <Typography className="hero-sub">
            {t("Manage your profile, perfumes, favorites and articles")}
          </Typography>
        </div>
      </div>

      <div className="container">
        <Stack className="my-page">
          <Stack className="back-frame">
            {/* ── Sidebar ──────────────────────────────────────── */}
            <Stack className="left-config">
              <MyMenu />
            </Stack>

            {/* ── Main content ─────────────────────────────────── */}
            <Stack className="main-config">
              <Stack className="list-config">
                {category === "myProfile" && <MyProfile />}
                {category === "addPerfume" && <AddNewPerfume />}
                {category === "myPerfumes" && <MyPerfumes />}
                {category === "myFavorites" && <MyFavorites />}
                {category === "recentlyVisited" && <RecentlyVisited />}
                {category === "myArticles" && <MyArticles />}
                {category === "writeArticle" && <WriteArticle />}
                {category === "followers" && (
                  <MemberFollowers
                    subscribeHandler={subscribeHandler}
                    unsubscribeHandler={unsubscribeHandler}
                    likeMemberHandler={likeMemberHandler}
                    redirectToMemberPageHandler={redirectToMemberPageHandler}
                  />
                )}
                {category === "followings" && (
                  <MemberFollowings
                    subscribeHandler={subscribeHandler}
                    unsubscribeHandler={unsubscribeHandler}
                    likeMemberHandler={likeMemberHandler}
                    redirectToMemberPageHandler={redirectToMemberPageHandler}
                  />
                )}
              </Stack>
            </Stack>
          </Stack>
        </Stack>
      </div>
    </div>
  );
};

export default withLayoutBasic(MyPage);
