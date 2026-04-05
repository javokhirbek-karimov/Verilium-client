import React, { useState } from "react";
import { useTranslation } from "next-i18next";
import { NextPage } from "next";
import { useRouter } from "next/router";
import useDeviceDetect from "../../hooks/useDeviceDetect";
import { Pagination, Stack, Typography } from "@mui/material";
import PerfumeCard from "../perfume/PerfumeCard";
import { Perfume } from "../../types/perfume/perfume";
import { T } from "../../types/common";
import { LIKE_TARGET_PERFUME } from "../../../apollo/user/mutation";
import { useMutation, useQuery } from "@apollo/client";
import { GET_FAVORITES } from "../../../apollo/user/query";
import { sweetMixinErrorAlert } from "../../sonner";
import { Messages } from "../../config";

const MyFavorites: NextPage = () => {
  const { t } = useTranslation("common");
  const device = useDeviceDetect();
  const router = useRouter();
  const [myFavorites, setMyFavorites] = useState<Perfume[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [searchFavorites, setSearchFavorites] = useState<T>({
    page: 1,
    limit: 6,
  });

  /** APOLLO REQUESTS **/
  const [likeTargetPerfume] = useMutation(LIKE_TARGET_PERFUME);

  const { refetch: getFavoritesRefetch } = useQuery(GET_FAVORITES, {
    fetchPolicy: "network-only",
    variables: { input: searchFavorites },
    notifyOnNetworkStatusChange: true,
    onCompleted: (data: T) => {
      setMyFavorites(data?.getFavorites?.list);
      setTotal(data?.getFavorites?.metaCounter[0]?.total || 0);
    },
  });

  /** HANDLERS **/
  const paginationHandler = (_: T, value: number) => {
    setSearchFavorites({ ...searchFavorites, page: value });
  };

  const goToDetail = (perfumeId: string) => {
    router.push({ pathname: "/perfume/detail", query: { perfumeId } });
  };

  const likePerfumeHandler = async (user: any, id: string) => {
    try {
      if (!id) return;
      if (!user._id) throw new Error(Messages.error2);

      await likeTargetPerfume({ variables: { input: id } });
      await getFavoritesRefetch({ input: searchFavorites });
    } catch (err: any) {
      console.log("ERROR, likePerfumeHandler:", err.message);
      sweetMixinErrorAlert(err.message).then();
    }
  };

  if (device === "mobile") {
    return <div>MY FAVORITES MOBILE</div>;
  }

  return (
    <div id="my-favorites-page">
      <Stack className="main-title-box">
        <Stack className="right-box">
          <Typography className="main-title">{t("My Favorites")}</Typography>
          <Typography className="sub-title">
            {t("Perfumes you've saved to your wishlist")}
          </Typography>
        </Stack>
      </Stack>

      <Stack className="favorites-list-box">
        {myFavorites?.length ? (
          myFavorites.map((perfume: Perfume) => (
            <PerfumeCard
              key={perfume._id}
              perfume={perfume}
              onClick={() => goToDetail(perfume._id)}
              onLike={likePerfumeHandler}
            />
          ))
        ) : (
          <div className="no-data">
            <img src="/img/icons/icoAlert.svg" alt="" />
            <p>{t("No favorites found!")}</p>
          </div>
        )}
      </Stack>

      {myFavorites?.length ? (
        <Stack className="pagination-config">
          <Stack className="pagination-box">
            <Pagination
              count={Math.ceil(total / searchFavorites.limit)}
              page={searchFavorites.page}
              shape="circular"
              color="primary"
              onChange={paginationHandler}
            />
          </Stack>
          <Stack className="total-result">
            <Typography>
              {t("Total favorite perfume(s)")}: {total}
            </Typography>
          </Stack>
        </Stack>
      ) : null}
    </div>
  );
};

export default MyFavorites;
