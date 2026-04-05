import { NextPage } from "next";
import { useState, useEffect } from "react";
import { Trans, useTranslation } from "next-i18next";
import {
  Stack,
  Box,
  Typography,
  Select,
  MenuItem,
  Pagination,
} from "@mui/material";
import { useRouter } from "next/router";
import { useMutation, useQuery } from "@apollo/client";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import withLayoutBasic from "../../libs/components/layout/layoutBasic";
import PerfumeCard from "../../libs/components/perfume/PerfumeCard";
import Filter from "../../libs/components/perfume/Filter";
import { GET_PERFUMES } from "../../apollo/user/query";
import { LIKE_TARGET_PERFUME } from "../../apollo/user/mutation";
import { Perfume } from "../../libs/types/perfume/perfume";
import { PerfumesInquiry } from "../../libs/types/perfume/perfume.input";
import { T } from "../../libs/types/common";
import { Direction, Message } from "../../libs/enums/common.enum";
import {
  sweetMixinErrorAlert,
  sweetTopSmallSuccessAlert,
} from "../../libs/sonner";

export const getStaticProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ["common"])),
  },
});

const DEFAULT_INPUT: PerfumesInquiry = {
  page: 1,
  limit: 12,
  sort: "createdAt",
  direction: Direction.DESC,
  search: {},
};

const PerfumePage: NextPage = () => {
  const { t } = useTranslation("common");
  const router = useRouter();
  const [perfumes, setPerfumes] = useState<Perfume[]>([]);
  const [total, setTotal] = useState(0);
  const [searchFilter, setSearchFilter] =
    useState<PerfumesInquiry>(DEFAULT_INPUT);

  useEffect(() => {
    if (router.query.input) {
      try {
        const parsed = JSON.parse(router.query.input as string);
        setSearchFilter(parsed);
      } catch {
        setSearchFilter(DEFAULT_INPUT);
      }
    }
  }, [router.query.input]);

  /** APOLLO **/
  const [likeTargetPerfume] = useMutation(LIKE_TARGET_PERFUME);

  const { loading, data } = useQuery(GET_PERFUMES, {
    fetchPolicy: "cache-and-network",
    variables: { input: searchFilter },
    notifyOnNetworkStatusChange: true,
  });

  useEffect(() => {
    if (data?.getPerfumes?.list) {
      setPerfumes(data.getPerfumes.list);
      setTotal(data.getPerfumes.metaCounter?.[0]?.total ?? 0);
    }
  }, [data]);

  /** HANDLERS **/
  const goDetail = (id: string) => {
    router.push({ pathname: "/perfume/detail", query: { id } });
  };

  const likeHandler = async (user: T, id: string) => {
    try {
      if (!user._id) throw new Error(Message.NOT_AUTHENTICATED);
      await likeTargetPerfume({ variables: { input: id } });
      await sweetTopSmallSuccessAlert("success", 800);
      setSearchFilter((prev) => ({ ...prev }));
    } catch (err: any) {
      sweetMixinErrorAlert(err.message).then();
    }
  };

  const totalPages = Math.ceil(total / searchFilter.limit);

  return (
    <Stack id={"perfume-list-page"}>
      {/* ── HERO ── full-width, outside container */}
      <section className="hero-section">
        <div className="hero-content">
          <span className="hero-label">{t("Collection")}</span>
          <Typography component="h1" className="hero-title">
            {t("Explore Our Perfumes")}
          </Typography>
          <Typography className="hero-sub">
            {t(
              "Find your signature scent from our curated selection of fine fragrances crafted by world-class perfumers.",
            )}
          </Typography>
        </div>
      </section>

      <Stack className={"container"}>
        {/* Header */}
        <Box className={"page-header"}>
          <Typography className={"page-title"}>
            {t("Our Collection")}
          </Typography>
          <Typography className={"page-subtitle"}>
            {t("Discover your signature scent from our curated selection")}
          </Typography>
        </Box>

        <Box className={"page-body"}>
          {/* Filter Sidebar */}
          <Filter
            searchFilter={searchFilter}
            setSearchFilter={setSearchFilter}
            initialInput={DEFAULT_INPUT}
          />

          {/* Main */}
          <Stack className={"main-content"}>
            {/* Sort bar */}
            <Box className={"sort-bar"}>
              <Typography className={"result-count"}>
                {total} {total === 1 ? t("perfume") : t("perfumes")}{" "}
                {t("found")}
              </Typography>
              <Box className={"sort-right"}>
                <Typography className={"sort-label"}>{t("Sort by")}</Typography>
                <Select
                  className={"sort-select"}
                  value={searchFilter.sort ?? "createdAt"}
                  onChange={(e) =>
                    setSearchFilter((prev) => ({
                      ...prev,
                      sort: e.target.value,
                      page: 1,
                    }))
                  }
                  size="small"
                >
                  <MenuItem value="createdAt">{t("Newest")}</MenuItem>
                  <MenuItem value="perfumePrice">{t("Price")}</MenuItem>
                  <MenuItem value="perfumeViews">{t("Most Viewed")}</MenuItem>
                  <MenuItem value="perfumeLikes">{t("Most Liked")}</MenuItem>
                  <MenuItem value="perfumeRank">{t("Top Ranked")}</MenuItem>
                </Select>
              </Box>
            </Box>

            {/* Cards */}
            {perfumes.length === 0 && !loading ? (
              <Box className={"empty-state"}>
                <Typography>{t("No perfumes found")}</Typography>
              </Box>
            ) : (
              <Box className={"cards-grid"}>
                {perfumes.map((perfume: Perfume) => (
                  <PerfumeCard
                    key={perfume._id}
                    perfume={perfume}
                    onClick={() => goDetail(perfume._id)}
                    onLike={likeHandler}
                  />
                ))}
              </Box>
            )}

            {perfumes.length > 0 && (
              <Box className={"pagination-wrap"}>
                <Pagination
                  count={Math.max(totalPages, 1)}
                  page={searchFilter.page}
                  onChange={(_, page) =>
                    setSearchFilter((prev) => ({ ...prev, page }))
                  }
                  shape="rounded"
                />
              </Box>
            )}
          </Stack>
        </Box>
      </Stack>
    </Stack>
  );
};

export default withLayoutBasic(PerfumePage);
