import React, { useEffect, useState } from "react";
import { Stack, Box } from "@mui/material";
import { Swiper, SwiperSlide } from "swiper/react";
import { useScrollReveal } from "../../hooks/useScrollReveal";
import { Autoplay, Navigation, Pagination } from "swiper";
import { useQuery } from "@apollo/client";
import { useRouter } from "next/router";
import WestIcon from "@mui/icons-material/West";
import EastIcon from "@mui/icons-material/East";
import useDeviceDetect from "../../hooks/useDeviceDetect";
import TopArticlesCard from "./TopArticlesCard";
import { GET_BOARD_ARTICLES } from "../../../apollo/user/query";
import { BoardArticle } from "../../types/board-article/board-article";
import { BoardArticlesInquiry } from "../../types/board-article/board-articles.input";
import { T } from "../../types/common";
import { useTranslation } from "next-i18next";

interface TopArticlesProps {
  initialInput: BoardArticlesInquiry;
}

const TopArticles = (props: TopArticlesProps) => {
  const { initialInput } = props;
  const device = useDeviceDetect();
  const { t } = useTranslation("common");
  const router = useRouter();
  const [articles, setArticles] = useState<BoardArticle[]>([]);
  const refInfo = useScrollReveal();
  const refCards = useScrollReveal();

  /** APOLLO REQUESTS **/
  const { loading: getArticlesLoading, data: getArticlesData } = useQuery(
    GET_BOARD_ARTICLES,
    {
      fetchPolicy: "cache-and-network",
      variables: { input: initialInput },
      notifyOnNetworkStatusChange: true,
    },
  );

  useEffect(() => {
    if (getArticlesData?.getBoardArticles?.list) {
      setArticles(getArticlesData.getBoardArticles.list);
    }
  }, [getArticlesData]);

  /** HANDLERS **/

  const goArticleDetail = (id: string) => {
    router.push({ pathname: "/community/detail", query: { id } });
  };

  if (device === "mobile") {
    return (
      <Stack className={"top-articles"}>
        <Stack className={"container"}>
          <Stack className={"info-box"}>
            <span>{t("Latest Articles")}</span>
          </Stack>
          <Stack className={"card-box"}>
            {articles.length === 0 && !getArticlesLoading ? (
              <Box className={"empty-list"}>{t("No articles yet")}</Box>
            ) : (
              <>
                <div className={"articles-nav-box"}>
                  <div className={"swiper-articles-mob-prev"}>
                    <WestIcon />
                  </div>
                  <div className={"swiper-articles-mob-pagination"}></div>
                  <div className={"swiper-articles-mob-next"}>
                    <EastIcon />
                  </div>
                </div>
                <Swiper
                  className={"top-articles-swiper"}
                  slidesPerView={1}
                  spaceBetween={0}
                  modules={[Navigation, Pagination]}
                  navigation={{
                    nextEl: ".swiper-articles-mob-next",
                    prevEl: ".swiper-articles-mob-prev",
                  }}
                  pagination={{
                    el: ".swiper-articles-mob-pagination",
                    clickable: true,
                  }}
                >
                  {articles.map((article: BoardArticle) => (
                    <SwiperSlide key={article._id} className={"top-article-slide"}>
                      <TopArticlesCard
                        article={article}
                        onClick={() => goArticleDetail(article._id)}
                      />
                    </SwiperSlide>
                  ))}
                </Swiper>
              </>
            )}
          </Stack>
        </Stack>
      </Stack>
    );
  }

  return (
    <Stack className={"top-articles"}>
      <Stack className={"container"}>
        <Stack ref={refInfo} className={"info-box sr-hidden"}>
          <Box component={"div"} className={"left"}>
            <span>{t("Latest Articles")}</span>
            <p>{t("Tips, stories & fragrance guides from our community")}</p>
          </Box>
          <Box component={"div"} className={"right"}>
            <div className={"pagination-box"}>
              <WestIcon className={"swiper-articles-prev"} />
              <div className={"swiper-articles-pagination"} />
              <EastIcon className={"swiper-articles-next"} />
            </div>
          </Box>
        </Stack>

        <Stack ref={refCards} className={"card-box sr-hidden sr-delay-1"}>
          {articles.length === 0 && !getArticlesLoading ? (
            <Box className={"empty-list"}>{t("No articles yet")}</Box>
          ) : (
            <Swiper
              className={"top-articles-swiper"}
              slidesPerView={3}
              spaceBetween={24}
              modules={[Navigation, Pagination, Autoplay]}
              navigation={{
                nextEl: ".swiper-articles-next",
                prevEl: ".swiper-articles-prev",
              }}
              pagination={{
                el: ".swiper-articles-pagination",
                clickable: true,
              }}
            >
              {articles.map((article: BoardArticle) => (
                <SwiperSlide key={article._id} className={"top-article-slide"}>
                  <TopArticlesCard
                    article={article}
                    onClick={() => goArticleDetail(article._id)}
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          )}
        </Stack>
      </Stack>
    </Stack>
  );
};

TopArticles.defaultProps = {
  initialInput: {
    page: 1,
    limit: 9,
    sort: "articleViews",
    direction: "DESC",
    search: {},
  },
};

export default TopArticles;
