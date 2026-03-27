import React, { useCallback, useEffect, useRef, useState } from "react";
import { Stack, Box, Modal, Divider, Button } from "@mui/material";
import useDeviceDetect from "../../hooks/useDeviceDetect";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CloseIcon from "@mui/icons-material/Close";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { propertyYears } from "../../config";
import {
  PerfumeLongevity,
  PerfumeScent,
  PerfumeSeason,
  PerfumeType,
} from "../../enums/perfume.enum";
import { PerfumesInquiry } from "../../types/perfume/perfume.input";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "auto",
  bgcolor: "background.paper",
  borderRadius: "12px",
  outline: "none",
  boxShadow: 24,
};

const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: "200px",
    },
  },
};

const thisYear = new Date().getFullYear();

interface HeaderFilterProps {
  initialInput: PerfumesInquiry;
}

const HeaderFilter = (props: HeaderFilterProps) => {
  const { initialInput } = props;
  const device = useDeviceDetect();
  const { t, i18n } = useTranslation("common");
  const [searchFilter, setSearchFilter] =
    useState<PerfumesInquiry>(initialInput);

  const scentRef: any = useRef();
  const typeRef: any = useRef();
  const seasonRef: any = useRef();
  const router = useRouter();

  const [openAdvancedFilter, setOpenAdvancedFilter] = useState(false);
  const [openScent, setOpenScent] = useState(false);
  const [openType, setOpenType] = useState(false);
  const [openSeason, setOpenSeason] = useState(false);

  const [perfumeScents] = useState<PerfumeScent[]>(Object.values(PerfumeScent));
  const [perfumeTypes] = useState<PerfumeType[]>(Object.values(PerfumeType));
  const [perfumeSeasons] = useState<PerfumeSeason[]>(
    Object.values(PerfumeSeason),
  );

  const [yearCheck, setYearCheck] = useState({ start: 1970, end: thisYear });
  const [longevityCheck, setLongevityCheck] = useState("all");

  /** LIFECYCLES **/
  useEffect(() => {
    const clickHandler = (event: MouseEvent) => {
      if (!scentRef?.current?.contains(event.target)) {
        setOpenScent(false);
      }
      if (!typeRef?.current?.contains(event.target)) {
        setOpenType(false);
      }
      if (!seasonRef?.current?.contains(event.target)) {
        setOpenSeason(false);
      }
    };

    document.addEventListener("mousedown", clickHandler);
    return () => {
      document.removeEventListener("mousedown", clickHandler);
    };
  }, []);

  /** HANDLERS **/
  const advancedFilterHandler = (status: boolean) => {
    setOpenScent(false);
    setOpenSeason(false);
    setOpenType(false);
    setOpenAdvancedFilter(status);
  };

  const scentStateChangeHandler = () => {
    setOpenScent((prev) => !prev);
    setOpenType(false);
    setOpenSeason(false);
  };

  const typeStateChangeHandler = () => {
    setOpenType((prev) => !prev);
    setOpenScent(false);
    setOpenSeason(false);
  };

  const seasonStateChangeHandler = () => {
    setOpenSeason((prev) => !prev);
    setOpenScent(false);
    setOpenType(false);
  };

  const disableAllStateHandler = () => {
    setOpenScent(false);
    setOpenType(false);
    setOpenSeason(false);
  };

  const perfumeScentSelectHandler = useCallback(
    async (value: any) => {
      try {
        setSearchFilter({
          ...searchFilter,
          search: {
            ...searchFilter.search,
            scentList: [value],
          },
        });
        typeStateChangeHandler();
      } catch (err: any) {
        console.log("ERROR, perfumeScentSelectHandler:", err);
      }
    },
    [searchFilter],
  );

  const perfumeTypeSelectHandler = useCallback(
    async (value: any) => {
      try {
        setSearchFilter({
          ...searchFilter,
          search: {
            ...searchFilter.search,
            typeList: [value],
          },
        });
        seasonStateChangeHandler();
      } catch (err: any) {
        console.log("ERROR, perfumeTypeSelectHandler:", err);
      }
    },
    [searchFilter],
  );

  const perfumeSeasonSelectHandler = useCallback(
    async (value: any) => {
      try {
        setSearchFilter({
          ...searchFilter,
          search: {
            ...searchFilter.search,
            seasonList: [value],
          },
        });
        disableAllStateHandler();
      } catch (err: any) {
        console.log("ERROR, perfumeSeasonSelectHandler:", err);
      }
    },
    [searchFilter],
  );

  const perfumeLongevitySelectHandler = useCallback(
    async (e: any) => {
      try {
        const value = e.target.value;
        setLongevityCheck(value);

        if (value !== "all") {
          setSearchFilter({
            ...searchFilter,
            search: {
              ...searchFilter.search,
              longevityList: [value],
            },
          });
        } else {
          const updated = { ...searchFilter.search };
          delete updated.longevityList;
          setSearchFilter({ ...searchFilter, search: updated });
        }
      } catch (err: any) {
        console.log("ERROR, perfumeLongevitySelectHandler:", err);
      }
    },
    [searchFilter],
  );

  const perfumeSeasonToggleHandler = useCallback(
    async (season: PerfumeSeason) => {
      try {
        const currentSeasons = searchFilter?.search?.seasonList || [];
        const updatedSeasons = currentSeasons.includes(season)
          ? currentSeasons.filter((s) => s !== season)
          : [...currentSeasons, season];

        setSearchFilter({
          ...searchFilter,
          search: {
            ...searchFilter.search,
            seasonList: updatedSeasons.length > 0 ? updatedSeasons : undefined,
          },
        });
      } catch (err: any) {
        console.log("ERROR, perfumeSeasonToggleHandler:", err);
      }
    },
    [searchFilter],
  );

  const priceRangeHandler = useCallback(
    async (e: any, type: string) => {
      const value = e.target.value;
      setSearchFilter({
        ...searchFilter,
        search: {
          ...searchFilter.search,
          pricesRange: {
            ...searchFilter.search.pricesRange,
            [type]: parseInt(value),
          } as any,
        },
      });
    },
    [searchFilter],
  );

  const yearStartChangeHandler = async (event: any) => {
    const start = Number(event.target.value);
    setYearCheck({ ...yearCheck, start });
    setSearchFilter({
      ...searchFilter,
      search: {
        ...searchFilter.search,
        periodsRange: {
          start: new Date(`${start}-01-01`),
          end: new Date(`${yearCheck.end}-12-31`),
        },
      },
    });
  };

  const yearEndChangeHandler = async (event: any) => {
    const end = Number(event.target.value);
    setYearCheck({ ...yearCheck, end });
    setSearchFilter({
      ...searchFilter,
      search: {
        ...searchFilter.search,
        periodsRange: {
          start: new Date(`${yearCheck.start}-01-01`),
          end: new Date(`${end}-12-31`),
        },
      },
    });
  };

  const resetFilterHandler = () => {
    setSearchFilter(initialInput);
    setLongevityCheck("all");
    setYearCheck({ start: 1970, end: thisYear });
  };

  const pushSearchHandler = async () => {
    try {
      const filter = { ...searchFilter };

      if (filter?.search?.scentList?.length === 0)
        delete filter.search.scentList;
      if (filter?.search?.typeList?.length === 0) delete filter.search.typeList;
      if (filter?.search?.seasonList?.length === 0)
        delete filter.search.seasonList;
      if (filter?.search?.longevityList?.length === 0)
        delete filter.search.longevityList;

      await router.push(
        `/perfume?input=${JSON.stringify(filter)}`,
        `/perfume?input=${JSON.stringify(filter)}`,
      );
    } catch (err: any) {
      console.log("ERROR, pushSearchHandler:", err);
    }
  };

  if (device === "mobile") {
    return <div>HEADER FILTER MOBILE</div>;
  } else {
    return (
      <>
        <Stack className={"search-box"}>
          <Stack className={"select-box"}>
            {/* SCENT */}
            <Box
              component={"div"}
              className={`box ${openScent ? "on" : ""}`}
              onClick={scentStateChangeHandler}
            >
              <span>
                {searchFilter?.search?.scentList
                  ? searchFilter.search.scentList[0]
                  : t("Scent")}
              </span>
              <ExpandMoreIcon />
            </Box>

            {/* TYPE */}
            <Box
              className={`box ${openType ? "on" : ""}`}
              onClick={typeStateChangeHandler}
            >
              <span>
                {searchFilter?.search?.typeList
                  ? searchFilter.search.typeList[0]
                  : t("Perfume Type")}
              </span>
              <ExpandMoreIcon />
            </Box>

            {/* SEASON */}
            <Box
              className={`box ${openSeason ? "on" : ""}`}
              onClick={seasonStateChangeHandler}
            >
              <span>
                {searchFilter?.search?.seasonList
                  ? searchFilter.search.seasonList[0]
                  : t("Season")}
              </span>
              <ExpandMoreIcon />
            </Box>
          </Stack>

          <Stack className={"search-box-other"}>
            <Box
              className={"advanced-filter"}
              onClick={() => advancedFilterHandler(true)}
            >
              <img src="/img/icons/tune.svg" alt="" />
              <span>{t("Advanced")}</span>
            </Box>
            <Box className={"search-btn"} onClick={pushSearchHandler}>
              <img src="/img/icons/search_white.svg" alt="" />
            </Box>
          </Stack>

          {/* SCENT DROPDOWN */}
          <div
            className={`filter-location ${openScent ? "on" : ""}`}
            ref={scentRef}
          >
            {perfumeScents.map((scent: string) => (
              <div onClick={() => perfumeScentSelectHandler(scent)} key={scent}>
                <span>{scent}</span>
              </div>
            ))}
          </div>

          {/* TYPE DROPDOWN */}
          <div className={`filter-type ${openType ? "on" : ""}`} ref={typeRef}>
            {perfumeTypes.map((type: string) => (
              <div onClick={() => perfumeTypeSelectHandler(type)} key={type}>
                <span>{type}</span>
              </div>
            ))}
          </div>

          {/* SEASON DROPDOWN */}
          <div
            className={`filter-rooms ${openSeason ? "on" : ""}`}
            ref={seasonRef}
          >
            {perfumeSeasons.map((season: PerfumeSeason) => (
              <span
                onClick={() => perfumeSeasonSelectHandler(season)}
                key={season}
              >
                {season}
              </span>
            ))}
          </div>
        </Stack>

        {/* ADVANCED FILTER MODAL */}
        <Modal
          open={openAdvancedFilter}
          onClose={() => advancedFilterHandler(false)}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          {/* @ts-ignore */}
          <Box sx={style}>
            <Box className={"advanced-filter-modal"}>
              <div
                className={"close"}
                onClick={() => advancedFilterHandler(false)}
              >
                <CloseIcon />
              </div>

              <div className={"top"}>
                <span>Find your perfume</span>
                <div className={"search-input-box"}>
                  <img src="/img/icons/search.svg" alt="" />
                  <input
                    value={searchFilter?.search?.text ?? ""}
                    type="text"
                    placeholder={"Search by name or brand..."}
                    onChange={(e: any) => {
                      setSearchFilter({
                        ...searchFilter,
                        search: {
                          ...searchFilter.search,
                          text: e.target.value,
                        },
                      });
                    }}
                  />
                </div>
              </div>

              <Divider sx={{ mt: "30px", mb: "35px" }} />

              <div className={"middle"}>
                {/* SEASON + LONGEVITY */}
                <div className={"row-box"}>
                  <div className={"box"}>
                    <span>Season</span>
                    <div className={"inside"}>
                      <div
                        className={`room ${
                          !searchFilter?.search?.seasonList ? "active" : ""
                        }`}
                        onClick={() => {
                          const updated = { ...searchFilter.search };
                          delete updated.seasonList;
                          setSearchFilter({ ...searchFilter, search: updated });
                        }}
                      >
                        Any
                      </div>
                      {perfumeSeasons.map((season: PerfumeSeason) => (
                        <div
                          className={`room ${
                            searchFilter?.search?.seasonList?.includes(season)
                              ? "active"
                              : ""
                          }`}
                          onClick={() => perfumeSeasonToggleHandler(season)}
                          key={season}
                        >
                          {season}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className={"box"}>
                    <span>Longevity</span>
                    <div className={"inside"}>
                      <FormControl>
                        <Select
                          value={longevityCheck}
                          onChange={perfumeLongevitySelectHandler}
                          displayEmpty
                          inputProps={{ "aria-label": "Without label" }}
                        >
                          <MenuItem value={"all"}>All</MenuItem>
                          {Object.values(PerfumeLongevity).map((l) => (
                            <MenuItem value={l} key={l}>
                              {l}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </div>
                  </div>
                </div>

                {/* RELEASE YEAR + PRICE RANGE */}
                <div className={"row-box"} style={{ marginTop: "44px" }}>
                  <div className={"box"}>
                    <span>Release Year</span>
                    <div className={"inside space-between align-center"}>
                      <FormControl sx={{ width: "122px" }}>
                        <Select
                          value={yearCheck.start.toString()}
                          onChange={yearStartChangeHandler}
                          displayEmpty
                          inputProps={{ "aria-label": "Without label" }}
                          MenuProps={MenuProps}
                        >
                          {propertyYears?.slice(0)?.map((year: number) => (
                            <MenuItem
                              value={year}
                              disabled={yearCheck.end <= year}
                              key={year}
                            >
                              {year}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                      <div className={"minus-line"}></div>
                      <FormControl sx={{ width: "122px" }}>
                        <Select
                          value={yearCheck.end.toString()}
                          onChange={yearEndChangeHandler}
                          displayEmpty
                          inputProps={{ "aria-label": "Without label" }}
                          MenuProps={MenuProps}
                        >
                          {propertyYears
                            ?.slice(0)
                            .reverse()
                            .map((year: number) => (
                              <MenuItem
                                value={year}
                                disabled={yearCheck.start >= year}
                                key={year}
                              >
                                {year}
                              </MenuItem>
                            ))}
                        </Select>
                      </FormControl>
                    </div>
                  </div>

                  <div className={"box"}>
                    <span>Price Range ($)</span>
                    <div className={"inside space-between align-center"}>
                      <FormControl sx={{ width: "122px" }}>
                        <Select
                          value={searchFilter?.search?.pricesRange?.start ?? 0}
                          onChange={(e: any) => priceRangeHandler(e, "start")}
                          displayEmpty
                          inputProps={{ "aria-label": "Without label" }}
                          MenuProps={MenuProps}
                        >
                          {[0, 50, 100, 150, 200, 300, 500].map((price) => (
                            <MenuItem
                              value={price}
                              disabled={
                                (searchFilter?.search?.pricesRange?.end ?? 0) <
                                price
                              }
                              key={price}
                            >
                              ${price}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                      <div className={"minus-line"}></div>
                      <FormControl sx={{ width: "122px" }}>
                        <Select
                          value={
                            searchFilter?.search?.pricesRange?.end ?? 2000000
                          }
                          onChange={(e: any) => priceRangeHandler(e, "end")}
                          displayEmpty
                          inputProps={{ "aria-label": "Without label" }}
                          MenuProps={MenuProps}
                        >
                          {[50, 100, 150, 200, 300, 500, 1000].map((price) => (
                            <MenuItem
                              value={price}
                              disabled={
                                (searchFilter?.search?.pricesRange?.start ??
                                  0) > price
                              }
                              key={price}
                            >
                              ${price}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </div>
                  </div>
                </div>
              </div>

              <Divider sx={{ mt: "60px", mb: "18px" }} />

              <div className={"bottom"}>
                <div onClick={resetFilterHandler}>
                  <img src="/img/icons/reset.svg" alt="" />
                  <span>Reset all filters</span>
                </div>
                <Button
                  startIcon={<img src={"/img/icons/search.svg"} />}
                  className={"search-btn"}
                  onClick={pushSearchHandler}
                >
                  Search
                </Button>
              </div>
            </Box>
          </Box>
        </Modal>
      </>
    );
  }
};

HeaderFilter.defaultProps = {
  initialInput: {
    page: 1,
    limit: 9,
    search: {
      pricesRange: {
        start: 0,
        end: 2000000,
      },
    },
  },
};

export default HeaderFilter;
