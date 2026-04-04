import React, { useState } from "react";
import { NextPage } from "next";
import { useRouter } from "next/router";
import useDeviceDetect from "../../hooks/useDeviceDetect";
import { Pagination, Stack, Typography } from "@mui/material";
import PerfumeCard from "../perfume/PerfumeCard";
import { Perfume } from "../../types/perfume/perfume";
import { T } from "../../types/common";
import { GET_VISITED } from "../../../apollo/user/query";
import { useQuery } from "@apollo/client";

const RecentlyVisited: NextPage = () => {
  const device = useDeviceDetect();
  const router = useRouter();
  const [recentlyVisited, setRecentlyVisited] = useState<Perfume[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [searchVisited, setSearchVisited] = useState<T>({ page: 1, limit: 6 });

  /** APOLLO REQUESTS **/
  useQuery(GET_VISITED, {
    fetchPolicy: "network-only",
    variables: { input: searchVisited },
    notifyOnNetworkStatusChange: true,
    onCompleted: (data: T) => {
      setRecentlyVisited(data?.getVisited?.list);
      setTotal(data?.getVisited?.metaCounter[0]?.total || 0);
    },
  });

  /** HANDLERS **/
  const paginationHandler = (_: T, value: number) => {
    setSearchVisited({ ...searchVisited, page: value });
  };

  const goToDetail = (perfumeId: string) => {
    router.push({ pathname: "/perfume/detail", query: { perfumeId } });
  };

  if (device === "mobile") return <div>RECENTLY VISITED MOBILE</div>;

  return (
    <div id="recently-visited-page">
      <Stack className="main-title-box">
        <Stack className="right-box">
          <Typography className="main-title">Recently Visited</Typography>
          <Typography className="sub-title">
            Perfumes you've viewed recently
          </Typography>
        </Stack>
      </Stack>

      <Stack className="favorites-list-box">
        {recentlyVisited?.length ? (
          recentlyVisited.map((perfume: Perfume) => (
            <PerfumeCard
              key={perfume._id}
              perfume={perfume}
              onClick={() => goToDetail(perfume._id)}
              onLike={() => {}}
            />
          ))
        ) : (
          <div className="no-data">
            <img src="/img/icons/icoAlert.svg" alt="" />
            <p>No recently visited perfumes found!</p>
          </div>
        )}
      </Stack>

      {recentlyVisited?.length ? (
        <Stack className="pagination-config">
          <Stack className="pagination-box">
            <Pagination
              count={Math.ceil(total / searchVisited.limit)}
              page={searchVisited.page}
              shape="circular"
              color="primary"
              onChange={paginationHandler}
            />
          </Stack>
          <Stack className="total-result">
            <Typography>
              Total {total} recently visited perfume{total !== 1 ? "s" : ""}
            </Typography>
          </Stack>
        </Stack>
      ) : null}
    </div>
  );
};

export default RecentlyVisited;
