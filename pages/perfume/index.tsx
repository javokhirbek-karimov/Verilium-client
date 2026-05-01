import { NextPage } from "next";
import { useState, useEffect } from "react";
import { useTranslation } from "next-i18next";
import {
  Stack,
  Box,
  Typography,
  Select,
  MenuItem,
  Pagination,
  Checkbox,
  FormControl,
  InputLabel,
  OutlinedInput,
  IconButton,
  Tooltip,
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
import useDeviceDetect from "../../libs/hooks/useDeviceDetect";
import TuneIcon from "@mui/icons-material/Tune";
import CloseIcon from "@mui/icons-material/Close";
import RefreshIcon from "@mui/icons-material/Refresh";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import {
  PerfumeScent,
  PerfumeLongevity,
  PerfumeSeason,
  PerfumeType,
} from "../../libs/enums/perfume.enum";

export const getStaticProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ["common"])),
  },
});

const DEFAULT_INPUT: PerfumesInquiry = {
  page: 1,
  limit: 9,
  sort: "createdAt",
  direction: Direction.DESC,
  search: {},
};

const MOBILE_DEFAULT_INPUT: PerfumesInquiry = {
  ...DEFAULT_INPUT,
  limit: 8,
};

const priceOptions = [0, 50, 100, 150, 200, 300, 500, 1000];

const PerfumePage: NextPage = () => {
  const { t } = useTranslation("common");
  const router = useRouter();
  const device = useDeviceDetect();
  const [perfumes, setPerfumes] = useState<Perfume[]>([]);
  const [total, setTotal] = useState(0);
  const activeDefault = device === "mobile" ? MOBILE_DEFAULT_INPUT : DEFAULT_INPUT;
  const [searchFilter, setSearchFilter] = useState<PerfumesInquiry>(() => {
    if (typeof window !== "undefined" && window.innerWidth < 768) {
      return MOBILE_DEFAULT_INPUT;
    }
    return DEFAULT_INPUT;
  });
  const [filterOpen, setFilterOpen] = useState(false);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    if (router.query.input) {
      try {
        const parsed = JSON.parse(router.query.input as string);
        setSearchFilter(parsed);
      } catch {
        setSearchFilter(activeDefault);
      }
    }
  }, [router.query.input]);

  /** APOLLO **/
  const [likeTargetPerfume] = useMutation(LIKE_TARGET_PERFUME);

  const { loading, data, refetch } = useQuery(GET_PERFUMES, {
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
      await refetch({ input: searchFilter });
      await sweetTopSmallSuccessAlert("Liked!", 800);
      setSearchFilter((prev) => ({ ...prev }));
    } catch (err: any) {
      sweetMixinErrorAlert(err.message).then();
    }
  };

  const totalPages = Math.ceil(total / searchFilter.limit);

  const pushToUrl = (updatedSearch: object) => {
    const updated = {
      ...searchFilter,
      page: 1,
      search: { ...searchFilter.search, ...updatedSearch },
    };
    setSearchFilter(updated);
    router.push(
      `/perfume?input=${JSON.stringify(updated)}`,
      `/perfume?input=${JSON.stringify(updated)}`,
      { scroll: false },
    );
  };

  const toggleList = (key: string, value: string, current: string[]) => {
    const next = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    pushToUrl({ [key]: next });
  };

  const resetFilters = () => {
    setSearchText("");
    setSearchFilter(activeDefault);
    router.push(
      `/perfume?input=${JSON.stringify(activeDefault)}`,
      `/perfume?input=${JSON.stringify(activeDefault)}`,
      { scroll: false },
    );
  };

  if (device === "mobile") {
    return (
      <Stack id={"perfume-list-page"}>
        {/* Hero */}
        <section className="hero-section">
          <div className="hero-content">
            <span className="hero-label">{t("Collection")}</span>
            <Typography component="h1" className="hero-title">
              {t("Explore Our Perfumes")}
            </Typography>
          </div>
        </section>

        {/* Controls bar */}
        <Box className={"mob-controls-bar"}>
          <Typography className={"mob-result-count"}>
            {total} {total === 1 ? t("perfume") : t("perfumes")}
          </Typography>
          <Box className={"mob-controls-right"}>
            <Select
              className={"mob-sort-select"}
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
            <button
              className={"mob-filter-btn"}
              onClick={() => setFilterOpen(true)}
            >
              <TuneIcon />
              <span>{t("Filter")}</span>
            </button>
          </Box>
        </Box>

        {/* Cards */}
        {perfumes.length === 0 && !loading ? (
          <Box className={"mob-empty-state"}>
            <Typography>{t("No perfumes found")}</Typography>
          </Box>
        ) : (
          <Box className={"mob-cards-grid"}>
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
          <Box className={"mob-pagination-wrap"}>
            <Pagination
              count={Math.max(totalPages, 1)}
              page={searchFilter.page}
              onChange={(_, page) =>
                setSearchFilter((prev) => ({ ...prev, page }))
              }
              shape="rounded"
              size="small"
            />
          </Box>
        )}

        {/* Filter overlay */}
        {filterOpen && (
          <div
            className={"mob-filter-overlay"}
            onClick={() => setFilterOpen(false)}
          />
        )}

        {/* Filter bottom sheet */}
        <div className={`mob-filter-sheet ${filterOpen ? "open" : ""}`}>
          <div className={"mob-filter-header"}>
            <span>{t("Filter")}</span>
            <Box className={"mob-filter-header-right"}>
              <button className={"mob-filter-reset"} onClick={resetFilters}>
                <RefreshIcon fontSize="small" />
                <span>{t("Reset")}</span>
              </button>
              <button
                className={"mob-filter-close"}
                onClick={() => setFilterOpen(false)}
              >
                <CloseIcon />
              </button>
            </Box>
          </div>

          <div className={"mob-filter-body"}>
            {/* Search */}
            <div className={"mob-filter-section"}>
              <span className={"mob-filter-section-title"}>
                {t("Search")}
              </span>
              <Box className={"mob-search-row"}>
                <OutlinedInput
                  value={searchText}
                  placeholder={t("Name or brand...")}
                  className={"mob-search-input"}
                  onChange={(e) => setSearchText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") pushToUrl({ text: searchText });
                  }}
                  endAdornment={
                    searchText ? (
                      <CancelRoundedIcon
                        onClick={() => {
                          setSearchText("");
                          pushToUrl({ text: "" });
                        }}
                        style={{ cursor: "pointer", fontSize: 20 }}
                      />
                    ) : null
                  }
                />
              </Box>
            </div>

            {/* Type */}
            <div className={"mob-filter-section"}>
              <span className={"mob-filter-section-title"}>
                {t("Perfume Type")}
              </span>
              <Box className={"mob-filter-chips"}>
                {Object.values(PerfumeType).map((type) => {
                  const active = (
                    searchFilter?.search?.typeList ?? []
                  ).includes(type);
                  return (
                    <button
                      key={type}
                      className={`mob-chip ${active ? "active" : ""}`}
                      onClick={() =>
                        toggleList(
                          "typeList",
                          type,
                          searchFilter?.search?.typeList ?? [],
                        )
                      }
                    >
                      {type}
                    </button>
                  );
                })}
              </Box>
            </div>

            {/* Scent */}
            <div className={"mob-filter-section"}>
              <span className={"mob-filter-section-title"}>{t("Scent")}</span>
              <Box className={"mob-filter-chips"}>
                {Object.values(PerfumeScent).map((scent) => {
                  const active = (
                    searchFilter?.search?.scentList ?? []
                  ).includes(scent);
                  return (
                    <button
                      key={scent}
                      className={`mob-chip ${active ? "active" : ""}`}
                      onClick={() =>
                        toggleList(
                          "scentList",
                          scent,
                          searchFilter?.search?.scentList ?? [],
                        )
                      }
                    >
                      {scent}
                    </button>
                  );
                })}
              </Box>
            </div>

            {/* Longevity */}
            <div className={"mob-filter-section"}>
              <span className={"mob-filter-section-title"}>
                {t("Longevity")}
              </span>
              <Box className={"mob-filter-chips"}>
                {Object.values(PerfumeLongevity).map((lon) => {
                  const active = (
                    searchFilter?.search?.longevityList ?? []
                  ).includes(lon);
                  return (
                    <button
                      key={lon}
                      className={`mob-chip ${active ? "active" : ""}`}
                      onClick={() =>
                        toggleList(
                          "longevityList",
                          lon,
                          searchFilter?.search?.longevityList ?? [],
                        )
                      }
                    >
                      {lon}
                    </button>
                  );
                })}
              </Box>
            </div>

            {/* Season */}
            <div className={"mob-filter-section"}>
              <span className={"mob-filter-section-title"}>
                {t("Season")}
              </span>
              <Box className={"mob-filter-chips"}>
                {Object.values(PerfumeSeason).map((season) => {
                  const active = (
                    searchFilter?.search?.seasonList ?? []
                  ).includes(season);
                  return (
                    <button
                      key={season}
                      className={`mob-chip ${active ? "active" : ""}`}
                      onClick={() =>
                        toggleList(
                          "seasonList",
                          season,
                          searchFilter?.search?.seasonList ?? [],
                        )
                      }
                    >
                      {season}
                    </button>
                  );
                })}
              </Box>
            </div>

            {/* Price range */}
            <div className={"mob-filter-section"}>
              <span className={"mob-filter-section-title"}>
                {t("Price Range ($)")}
              </span>
              <Box className={"mob-price-row"}>
                <FormControl size="small" className={"mob-price-select"}>
                  <InputLabel>Min</InputLabel>
                  <Select
                    value={searchFilter?.search?.pricesRange?.start ?? 0}
                    label="Min"
                    onChange={(e) =>
                      pushToUrl({
                        pricesRange: {
                          ...searchFilter?.search?.pricesRange,
                          start: Number(e.target.value),
                        },
                      })
                    }
                  >
                    {priceOptions.map((p) => (
                      <MenuItem
                        key={p}
                        value={p}
                        disabled={
                          (searchFilter?.search?.pricesRange?.end ?? Infinity) <
                          p
                        }
                      >
                        ${p}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <span className={"mob-price-divider"}>—</span>
                <FormControl size="small" className={"mob-price-select"}>
                  <InputLabel>Max</InputLabel>
                  <Select
                    value={searchFilter?.search?.pricesRange?.end ?? 1000}
                    label="Max"
                    onChange={(e) =>
                      pushToUrl({
                        pricesRange: {
                          ...searchFilter?.search?.pricesRange,
                          end: Number(e.target.value),
                        },
                      })
                    }
                  >
                    {priceOptions.map((p) => (
                      <MenuItem
                        key={p}
                        value={p}
                        disabled={
                          (searchFilter?.search?.pricesRange?.start ?? 0) > p
                        }
                      >
                        ${p}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            </div>
          </div>

          <div className={"mob-filter-footer"}>
            <button
              className={"mob-filter-apply"}
              onClick={() => setFilterOpen(false)}
            >
              {t("Show Results")} ({total})
            </button>
          </div>
        </div>
      </Stack>
    );
  }

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
