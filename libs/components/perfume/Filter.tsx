import React, { useCallback, useEffect, useState } from "react";
import { useTranslation } from "next-i18next";
import {
  Stack,
  Typography,
  Checkbox,
  Button,
  OutlinedInput,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tooltip,
  IconButton,
} from "@mui/material";
import useDeviceDetect from "../../hooks/useDeviceDetect";
import {
  PerfumeScent,
  PerfumeLongevity,
  PerfumeSeason,
  PerfumeType,
} from "../../enums/perfume.enum";
import { PerfumesInquiry } from "../../types/perfume/perfume.input";
import { useRouter } from "next/router";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import RefreshIcon from "@mui/icons-material/Refresh";

const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: "200px",
    },
  },
};

// Price options
const priceOptions = [0, 50, 100, 150, 200, 300, 500, 1000];

interface FilterType {
  searchFilter: PerfumesInquiry;
  setSearchFilter: any;
  initialInput: PerfumesInquiry;
}

const Filter = (props: FilterType) => {
  const { t } = useTranslation("common");
  const { searchFilter, setSearchFilter, initialInput } = props;
  const device = useDeviceDetect();
  const router = useRouter();
  const [searchText, setSearchText] = useState<string>("");

  const perfumeTypes = Object.values(PerfumeType);
  const perfumeScents = Object.values(PerfumeScent);
  const perfumeLongevities = Object.values(PerfumeLongevity);
  const perfumeSeasons = Object.values(PerfumeSeason);

  /** LIFECYCLES **/
  useEffect(() => {
    const push = (updatedFilter: PerfumesInquiry) => {
      router.push(
        `/perfume?input=${JSON.stringify(updatedFilter)}`,
        `/perfume?input=${JSON.stringify(updatedFilter)}`,
        { scroll: false },
      );
    };

    if (searchFilter?.search?.typeList?.length === 0) {
      delete searchFilter.search.typeList;
      push({ ...searchFilter });
    }

    if (searchFilter?.search?.scentList?.length === 0) {
      delete searchFilter.search.scentList;
      push({ ...searchFilter });
    }

    if (searchFilter?.search?.longevityList?.length === 0) {
      delete searchFilter.search.longevityList;
      push({ ...searchFilter });
    }

    if (searchFilter?.search?.seasonList?.length === 0) {
      delete searchFilter.search.seasonList;
      push({ ...searchFilter });
    }
  }, [searchFilter]);

  /** HANDLERS **/
  const pushToUrl = useCallback(
    (updatedSearch: object) => {
      const updated = {
        ...searchFilter,
        search: { ...searchFilter.search, ...updatedSearch },
      };
      router.push(
        `/perfume?input=${JSON.stringify(updated)}`,
        `/perfume?input=${JSON.stringify(updated)}`,
        { scroll: false },
      );
    },
    [searchFilter, router],
  );

  // ── Type ────────────────────────────────────────────────────────────────────
  const perfumeTypeSelectHandler = useCallback(
    async (e: any) => {
      try {
        const isChecked = e.target.checked;
        const value = e.target.value as PerfumeType;
        const current = searchFilter?.search?.typeList ?? [];

        const updated = isChecked
          ? [...current, value]
          : current.filter((item) => item !== value);

        pushToUrl({ typeList: updated });
      } catch (err: any) {
        console.log("ERROR, perfumeTypeSelectHandler:", err);
      }
    },
    [searchFilter, pushToUrl],
  );

  // ── Scent ───────────────────────────────────────────────────────────────────
  const perfumeScentSelectHandler = useCallback(
    async (e: any) => {
      try {
        const isChecked = e.target.checked;
        const value = e.target.value as PerfumeScent;
        const current = searchFilter?.search?.scentList ?? [];

        const updated = isChecked
          ? [...current, value]
          : current.filter((item) => item !== value);

        pushToUrl({ scentList: updated });
      } catch (err: any) {
        console.log("ERROR, perfumeScentSelectHandler:", err);
      }
    },
    [searchFilter, pushToUrl],
  );

  // ── Longevity ───────────────────────────────────────────────────────────────
  const perfumeLongevitySelectHandler = useCallback(
    async (e: any) => {
      try {
        const isChecked = e.target.checked;
        const value = e.target.value as PerfumeLongevity;
        const current = searchFilter?.search?.longevityList ?? [];

        const updated = isChecked
          ? [...current, value]
          : current.filter((item) => item !== value);

        pushToUrl({ longevityList: updated });
      } catch (err: any) {
        console.log("ERROR, perfumeLongevitySelectHandler:", err);
      }
    },
    [searchFilter, pushToUrl],
  );

  // ── Season ──────────────────────────────────────────────────────────────────
  const perfumeSeasonSelectHandler = useCallback(
    async (e: any) => {
      try {
        const isChecked = e.target.checked;
        const value = e.target.value as PerfumeSeason;
        const current = searchFilter?.search?.seasonList ?? [];

        const updated = isChecked
          ? [...current, value]
          : current.filter((item) => item !== value);

        pushToUrl({ seasonList: updated });
      } catch (err: any) {
        console.log("ERROR, perfumeSeasonSelectHandler:", err);
      }
    },
    [searchFilter, pushToUrl],
  );

  // ── Price Range ─────────────────────────────────────────────────────────────
  const perfumePriceHandler = useCallback(
    async (e: any, type: string) => {
      const value = Number(e.target.value);
      pushToUrl({
        pricesRange: {
          ...searchFilter?.search?.pricesRange,
          [type]: value,
        },
      });
    },
    [searchFilter, pushToUrl],
  );

  // ── Reset ───────────────────────────────────────────────────────────────────
  const refreshHandler = async () => {
    try {
      setSearchText("");
      await router.push(
        `/perfume?input=${JSON.stringify(initialInput)}`,
        `/perfume?input=${JSON.stringify(initialInput)}`,
        { scroll: false },
      );
    } catch (err: any) {
      console.log("ERROR, refreshHandler:", err);
    }
  };

  if (device === "mobile") {
    return null;
  }

  return (
    <Stack className={"filter-main"}>
      {/* Search */}
      <Stack className={"find-your-home"} mb={"40px"}>
        <Typography className={"title-main"}>{t("Find Your Perfume")}</Typography>
        <Stack className={"input-box"}>
          <OutlinedInput
            value={searchText}
            type={"text"}
            className={"search-input"}
            placeholder={t("Search by name or brand...")}
            onChange={(e: any) => setSearchText(e.target.value)}
            onKeyDown={(event: any) => {
              if (event.key === "Enter") {
                pushToUrl({ text: searchText });
              }
            }}
            endAdornment={
              <CancelRoundedIcon
                onClick={() => {
                  setSearchText("");
                  pushToUrl({ text: "" });
                }}
              />
            }
          />
          <img src={"/img/icons/search_icon.png"} alt={""} />
          <Tooltip title="Reset">
            <IconButton onClick={refreshHandler}>
              <RefreshIcon />
            </IconButton>
          </Tooltip>
        </Stack>
      </Stack>

      {/* Type */}
      <Stack className={"find-your-home"} mb={"30px"}>
        <Typography className={"title"}>{t("Perfume Type")}</Typography>
        {perfumeTypes.map((type) => (
          <Stack className={"input-box"} key={type}>
            <Checkbox
              id={type}
              className="property-checkbox"
              color="default"
              size="small"
              value={type}
              checked={(searchFilter?.search?.typeList ?? []).includes(type)}
              onChange={perfumeTypeSelectHandler}
            />
            <label htmlFor={type} style={{ cursor: "pointer" }}>
              <Typography className="property-type">{type}</Typography>
            </label>
          </Stack>
        ))}
      </Stack>

      {/* Scent */}
      <Stack className={"find-your-home"} mb={"30px"}>
        <Typography className={"title"}>{t("Scent")}</Typography>
        {perfumeScents.map((scent) => (
          <Stack className={"input-box"} key={scent}>
            <Checkbox
              id={scent}
              className="property-checkbox"
              color="default"
              size="small"
              value={scent}
              checked={(searchFilter?.search?.scentList ?? []).includes(scent)}
              onChange={perfumeScentSelectHandler}
            />
            <label htmlFor={scent} style={{ cursor: "pointer" }}>
              <Typography className="property-type">{scent}</Typography>
            </label>
          </Stack>
        ))}
      </Stack>

      {/* Longevity */}
      <Stack className={"find-your-home"} mb={"30px"}>
        <Typography className={"title"}>{t("Longevity")}</Typography>
        {perfumeLongevities.map((lon) => (
          <Stack className={"input-box"} key={lon}>
            <Checkbox
              id={lon}
              className="property-checkbox"
              color="default"
              size="small"
              value={lon}
              checked={(searchFilter?.search?.longevityList ?? []).includes(
                lon,
              )}
              onChange={perfumeLongevitySelectHandler}
            />
            <label htmlFor={lon} style={{ cursor: "pointer" }}>
              <Typography className="property-type">{lon}</Typography>
            </label>
          </Stack>
        ))}
      </Stack>

      {/* Season */}
      <Stack className={"find-your-home"} mb={"30px"}>
        <Typography className={"title"}>{t("Season")}</Typography>
        {perfumeSeasons.map((season) => (
          <Stack className={"input-box"} key={season}>
            <Checkbox
              id={season}
              className="property-checkbox"
              color="default"
              size="small"
              value={season}
              checked={(searchFilter?.search?.seasonList ?? []).includes(
                season,
              )}
              onChange={perfumeSeasonSelectHandler}
            />
            <label htmlFor={season} style={{ cursor: "pointer" }}>
              <Typography className="property-type">{season}</Typography>
            </label>
          </Stack>
        ))}
      </Stack>

      {/* Price Range */}
      <Stack className={"find-your-home"} mb={"30px"}>
        <Typography className={"title"}>{t("Price Range ($)")}</Typography>
        <Stack className="square-year-input">
          <FormControl>
            <InputLabel id="price-min-label">Min</InputLabel>
            <Select
              labelId="price-min-label"
              value={searchFilter?.search?.pricesRange?.start ?? 0}
              label="Min"
              onChange={(e: any) => perfumePriceHandler(e, "start")}
              MenuProps={MenuProps}
            >
              {priceOptions.map((price) => (
                <MenuItem
                  key={price}
                  value={price}
                  disabled={
                    (searchFilter?.search?.pricesRange?.end ?? Infinity) < price
                  }
                >
                  ${price}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <div className="central-divider" />
          <FormControl>
            <InputLabel id="price-max-label">Max</InputLabel>
            <Select
              labelId="price-max-label"
              value={searchFilter?.search?.pricesRange?.end ?? 1000}
              label="Max"
              onChange={(e: any) => perfumePriceHandler(e, "end")}
              MenuProps={MenuProps}
            >
              {priceOptions.map((price) => (
                <MenuItem
                  key={price}
                  value={price}
                  disabled={
                    (searchFilter?.search?.pricesRange?.start ?? 0) > price
                  }
                >
                  ${price}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default Filter;
