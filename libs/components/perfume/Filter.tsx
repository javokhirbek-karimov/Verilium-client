import React from "react";
import { Stack, Box, Typography, Checkbox, FormControlLabel, TextField, InputAdornment } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import {
  PerfumeScent,
  PerfumeLongevity,
  PerfumeSeason,
  PerfumeType,
} from "../../enums/perfume.enum";
import { PerfumesInquiry } from "../../types/perfume/perfume.input";

interface FilterProps {
  input: PerfumesInquiry;
  setInput: (updates: Partial<PerfumesInquiry>) => void;
}

const Filter = ({ input, setInput }: FilterProps) => {
  const search = input.search ?? {};

  const toggle = <T extends string>(list: T[] | undefined, item: T): T[] => {
    const arr = list ?? [];
    return arr.includes(item) ? arr.filter((i) => i !== item) : [...arr, item];
  };

  const update = (patch: typeof search) =>
    setInput({ search: { ...search, ...patch } });

  return (
    <Stack className={"filter-sidebar"}>
      {/* Search */}
      <Box className={"filter-section"}>
        <TextField
          className={"filter-search"}
          placeholder={"Search perfumes..."}
          size="small"
          value={search.text ?? ""}
          onChange={(e) =>
            update({ text: e.target.value || undefined })
          }
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      {/* Type */}
      <Box className={"filter-section"}>
        <Typography className={"filter-title"}>Type</Typography>
        {Object.values(PerfumeType).map((type) => (
          <FormControlLabel
            key={type}
            className={"filter-label"}
            label={type}
            control={
              <Checkbox
                size="small"
                checked={search.typeList?.includes(type) ?? false}
                onChange={() =>
                  update({ typeList: toggle(search.typeList, type) })
                }
              />
            }
          />
        ))}
      </Box>

      {/* Scent */}
      <Box className={"filter-section"}>
        <Typography className={"filter-title"}>Scent</Typography>
        {Object.values(PerfumeScent).map((scent) => (
          <FormControlLabel
            key={scent}
            className={"filter-label"}
            label={scent}
            control={
              <Checkbox
                size="small"
                checked={search.scentList?.includes(scent) ?? false}
                onChange={() =>
                  update({ scentList: toggle(search.scentList, scent) })
                }
              />
            }
          />
        ))}
      </Box>

      {/* Longevity */}
      <Box className={"filter-section"}>
        <Typography className={"filter-title"}>Longevity</Typography>
        {Object.values(PerfumeLongevity).map((lon) => (
          <FormControlLabel
            key={lon}
            className={"filter-label"}
            label={lon}
            control={
              <Checkbox
                size="small"
                checked={search.longevityList?.includes(lon) ?? false}
                onChange={() =>
                  update({ longevityList: toggle(search.longevityList, lon) })
                }
              />
            }
          />
        ))}
      </Box>

      {/* Season */}
      <Box className={"filter-section"}>
        <Typography className={"filter-title"}>Season</Typography>
        {Object.values(PerfumeSeason).map((season) => (
          <FormControlLabel
            key={season}
            className={"filter-label"}
            label={season}
            control={
              <Checkbox
                size="small"
                checked={search.seasonList?.includes(season) ?? false}
                onChange={() =>
                  update({ seasonList: toggle(search.seasonList, season) })
                }
              />
            }
          />
        ))}
      </Box>
    </Stack>
  );
};

export default Filter;
