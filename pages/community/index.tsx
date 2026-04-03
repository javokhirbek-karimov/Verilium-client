import React, { useEffect, useState } from "react";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { Stack, Typography, Button, Pagination } from "@mui/material";
import EditNoteIcon from "@mui/icons-material/EditNote";
import CommunityCard from "../../libs/components/community/CommunityCard";
import useDeviceDetect from "../../libs/hooks/useDeviceDetect";
import withLayoutBasic from "../../libs/components/layout/layoutBasic";
import { BoardArticle } from "../../libs/types/board-article/board-article";
import { T } from "../../libs/types/common";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { BoardArticlesInquiry } from "../../libs/types/board-article/board-articles.input";
import { BoardArticleCategory } from "../../libs/enums/board-article.enum";
import { LIKE_TARGET_BOARD_ARTICLE } from "../../apollo/user/mutation";
import { useMutation, useQuery } from "@apollo/client";
import { GET_BOARD_ARTICLES } from "../../apollo/user/query";
import { Messages } from "../../libs/config";
import {
  sweetMixinErrorAlert,
  sweetTopSmallSuccessAlert,
} from "../../libs/sonner";

export const getStaticProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ["common"])),
  },
});

const TABS: { value: BoardArticleCategory; label: string }[] = [
  { value: BoardArticleCategory.FREE, label: "Free Board" },
  { value: BoardArticleCategory.RECOMMEND, label: "Recommend" },
  { value: BoardArticleCategory.NEWS, label: "News" },
  { value: BoardArticleCategory.HUMOR, label: "Humor" },
];

const Community: NextPage = ({ initialInput }: T) => {
  const device = useDeviceDetect();
  const router = useRouter();
  const { query } = router;
  const articleCategory = query?.articleCategory as string;
  const [searchCommunity, setSearchCommunity] =
    useState<BoardArticlesInquiry>(initialInput);
  const [boardArticles, setBoardArticles] = useState<BoardArticle[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  if (articleCategory) initialInput.search.articleCategory = articleCategory;

  /** APOLLO REQUESTS **/
  const [likeTargetArticle] = useMutation(LIKE_TARGET_BOARD_ARTICLE);

  const { data: getBoardArticlesData, refetch: getBoardArticlesRefetch } =
    useQuery(GET_BOARD_ARTICLES, {
      fetchPolicy: "cache-and-network",
      variables: { input: searchCommunity },
      notifyOnNetworkStatusChange: true,
    });

  useEffect(() => {
    if (getBoardArticlesData?.getBoardArticles?.list) {
      setBoardArticles(getBoardArticlesData.getBoardArticles.list);
      setTotalCount(
        getBoardArticlesData.getBoardArticles.metaCounter?.[0]?.total ?? 0,
      );
    }
  }, [getBoardArticlesData]);

  /** LIFECYCLES **/
  useEffect(() => {
    if (!query?.articleCategory)
      router.push(
        {
          pathname: router.pathname,
          query: { articleCategory: "FREE" },
        },
        router.pathname,
        { shallow: true },
      );
  }, []);

  /** HANDLERS **/
  const tabChangeHandler = async (value: string) => {
    setSearchCommunity({
      ...searchCommunity,
      page: 1,
      search: { articleCategory: value as BoardArticleCategory },
    });
    await router.push(
      {
        pathname: "/community",
        query: { articleCategory: value },
      },
      router.pathname,
      { shallow: true },
    );
  };

  const paginationHandler = (_: T, value: number) => {
    setSearchCommunity({ ...searchCommunity, page: value });
  };

  const likeArticleHandler = async (e: any, user: any, id: string) => {
    try {
      e.stopPropagation();
      if (!id) return;
      if (!user._id) throw new Error(Messages.error2);

      await likeTargetArticle({ variables: { input: id } });
      await getBoardArticlesRefetch({ input: searchCommunity });
      await sweetTopSmallSuccessAlert("success", 800);
    } catch (err: any) {
      sweetMixinErrorAlert(err.message).then();
    }
  };

  const activeCategory =
    searchCommunity.search.articleCategory ?? BoardArticleCategory.FREE;

  if (device === "mobile") {
    return <h1>COMMUNITY PAGE MOBILE</h1>;
  }

  return (
    <div id="community-list-page">
      {/* ── HERO ── */}
      <section className="hero-section">
        <div className="hero-content">
          <span className="hero-label">Community</span>
          <Typography component="h1" className="hero-title">
            Share Your <span>Fragrance</span> Story
          </Typography>
          <Typography className="hero-sub">
            Tips, reviews, and scent stories from fellow fragrance lovers.
            Discover, discuss, and inspire.
          </Typography>
        </div>
      </section>

      {/* ── TABS BAR ── */}
      <div className="tabs-section">
        <div className="tabs-wrap">
          {TABS.map((tab) => (
            <Button
              key={tab.value}
              className={`tab-pill ${
                activeCategory === tab.value ? "active" : ""
              }`}
              onClick={() => tabChangeHandler(tab.value)}
              disableRipple
            >
              {tab.label}
            </Button>
          ))}
        </div>
        {totalCount > 0 && (
          <Typography className="result-count">
            {totalCount} article{totalCount !== 1 ? "s" : ""}
          </Typography>
        )}
      </div>

      {/* ── CARDS ── */}
      <div className="cards-section">
        <Stack className="list-box">
          {totalCount ? (
            boardArticles.map((boardArticle: BoardArticle) => (
              <CommunityCard
                boardArticle={boardArticle}
                key={boardArticle._id}
                likeArticleHandler={likeArticleHandler}
              />
            ))
          ) : (
            <Stack className="no-data">
              <img src="/img/icons/icoAlert.svg" alt="" />
              <Typography>No articles found</Typography>
            </Stack>
          )}
        </Stack>

        {totalCount > 0 && (
          <Stack className="pagination-config">
            <Pagination
              count={Math.ceil(totalCount / searchCommunity.limit)}
              page={searchCommunity.page}
              shape="circular"
              color="primary"
              onChange={paginationHandler}
            />
            <Typography className="total-label">
              Total {totalCount} article{totalCount > 1 ? "s" : ""} available
            </Typography>
          </Stack>
        )}
      </div>
    </div>
  );
};

Community.defaultProps = {
  initialInput: {
    page: 1,
    limit: 6,
    sort: "createdAt",
    direction: "ASC",
    search: {
      articleCategory: BoardArticleCategory.FREE,
    },
  },
};

export default withLayoutBasic(Community);
