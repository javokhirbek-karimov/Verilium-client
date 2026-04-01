import { NextPage } from "next";
import { useState } from "react";
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
  const router = useRouter();
  const [perfumes, setPerfumes] = useState<Perfume[]>([]);
  const [total, setTotal] = useState(0);
  const [input, setInput] = useState<PerfumesInquiry>(DEFAULT_INPUT);

  /** APOLLO **/
  const [likeTargetPerfume] = useMutation(LIKE_TARGET_PERFUME);

  const { loading } = useQuery(GET_PERFUMES, {
    fetchPolicy: "cache-and-network",
    variables: { input },
    notifyOnNetworkStatusChange: true,
    onCompleted: (data: T) => {
      setPerfumes(data?.getPerfumes?.list ?? []);
      setTotal(data?.getPerfumes?.metaCounter?.[0]?.total ?? 0);
    },
  });

  /** HANDLERS **/
  const updateInput = (updates: Partial<PerfumesInquiry>) => {
    setInput((prev) => ({ ...prev, ...updates, page: 1 }));
  };

  const goDetail = (id: string) => {
    router.push({ pathname: "/perfume/detail", query: { id } });
  };

  const likeHandler = async (user: T, id: string) => {
    try {
      if (!user._id) throw new Error(Message.NOT_AUTHENTICATED);
      await likeTargetPerfume({ variables: { input: id } });
      await sweetTopSmallSuccessAlert("success", 800);
      setInput((prev) => ({ ...prev }));
    } catch (err: any) {
      sweetMixinErrorAlert(err.message).then();
    }
  };

  const totalPages = Math.ceil(total / input.limit);

  return (
    <Stack id={"perfume-list-page"}>
      <Stack className={"container"}>
        {/* Header */}
        <Box className={"page-header"}>
          <Typography className={"page-title"}>Our Collection</Typography>
          <Typography className={"page-subtitle"}>
            Discover your signature scent from our curated selection
          </Typography>
        </Box>

        <Box className={"page-body"}>
          {/* Filter Sidebar */}
          <Filter input={input} setInput={updateInput} />

          {/* Main */}
          <Stack className={"main-content"}>
            {/* Sort bar */}
            <Box className={"sort-bar"}>
              <Typography className={"result-count"}>
                {total} {total === 1 ? "perfume" : "perfumes"} found
              </Typography>
              <Box className={"sort-right"}>
                <Typography className={"sort-label"}>Sort by</Typography>
                <Select
                  className={"sort-select"}
                  value={input.sort ?? "createdAt"}
                  onChange={(e) =>
                    setInput((prev) => ({
                      ...prev,
                      sort: e.target.value,
                      page: 1,
                    }))
                  }
                  size="small"
                >
                  <MenuItem value="createdAt">Newest</MenuItem>
                  <MenuItem value="perfumePrice">Price</MenuItem>
                  <MenuItem value="perfumeViews">Most Viewed</MenuItem>
                  <MenuItem value="perfumeLikes">Most Liked</MenuItem>
                  <MenuItem value="perfumeRank">Top Ranked</MenuItem>
                </Select>
              </Box>
            </Box>

            {/* Cards */}
            {perfumes.length === 0 && !loading ? (
              <Box className={"empty-state"}>
                <Typography>No perfumes found</Typography>
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
                  page={input.page}
                  onChange={(_, page) =>
                    setInput((prev) => ({ ...prev, page }))
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
