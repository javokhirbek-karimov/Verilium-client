import React, { useEffect, useState } from "react";
import { Stack, Box } from "@mui/material";
import { useScrollReveal } from "../../hooks/useScrollReveal";
import useDeviceDetect from "../../hooks/useDeviceDetect";
import WestIcon from "@mui/icons-material/West";
import EastIcon from "@mui/icons-material/East";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper";
import TopPerfumeCard from "./TopPerfumesCard";
import { PerfumesInquiry } from "../../types/perfume/perfume.input";
import { Perfume } from "../../types/perfume/perfume";
import { useMutation, useQuery } from "@apollo/client";
import { GET_PERFUMES } from "../../../apollo/user/query";
import { T } from "../../types/common";
import { sweetMixinErrorAlert, sweetTopSmallSuccessAlert } from "../../sonner";
import { Message } from "../../enums/common.enum";
import { LIKE_TARGET_PERFUME } from "../../../apollo/user/mutation";
import { useTranslation } from "next-i18next";

interface TopPerfumesProps {
  initialInput: PerfumesInquiry;
}

const TopPerfumes = (props: TopPerfumesProps) => {
  const { initialInput } = props;
  const device = useDeviceDetect();
  const { t } = useTranslation("common");
  const refInfo = useScrollReveal();
  const refCards = useScrollReveal();
  const [topPerfumes, setTopPerfumes] = useState<Perfume[]>([]);

  /** APOLLO REQUESTS **/
  const [likeTargetPerfume] = useMutation(LIKE_TARGET_PERFUME);

  const {
    loading: getPerfumesLoading,
    data: getPerfumesData,
    error: getPerfumesError,
    refetch: getPerfumesRefetch,
  } = useQuery(GET_PERFUMES, {
    fetchPolicy: "cache-and-network",
    variables: { input: initialInput },
    notifyOnNetworkStatusChange: true,
  });

  useEffect(() => {
    if (getPerfumesData?.getPerfumes?.list) {
      setTopPerfumes(getPerfumesData.getPerfumes.list);
    }
  }, [getPerfumesData]);

  const likePerfumeHandler = async (user: T, id: string) => {
    try {
      if (!id) return;
      if (!user._id) throw new Error(Message.NOT_AUTHENTICATED);
      await likeTargetPerfume({
        variables: { input: id },
      });
      await getPerfumesRefetch({ input: initialInput });
      await sweetTopSmallSuccessAlert("Liked!", 800);
    } catch (err: any) {
      console.log("ERROR likePerfumeHandler", err.message);
      sweetMixinErrorAlert(err.message).then();
    }
  };

  if (device === "mobile") {
    return (
      <Stack className={"top-perfumes"}>
        <Stack className={"container"}>
          <Stack className={"info-box"}>
            <span>{t("Top perfumes")}</span>
          </Stack>
          <Stack className={"card-box"}>
            <Swiper
              className={"top-perfume-swiper"}
              slidesPerView={"auto"}
              centeredSlides={true}
              spaceBetween={15}
              modules={[Autoplay]}
            >
              {topPerfumes.map((perfume: Perfume) => {
                return (
                  <SwiperSlide
                    className={"top-perfume-slide"}
                    key={perfume?._id}
                  >
                    <TopPerfumeCard
                      perfume={perfume}
                      likePerfumeHandler={likePerfumeHandler}
                    />
                  </SwiperSlide>
                );
              })}
            </Swiper>
          </Stack>
        </Stack>
      </Stack>
    );
  } else {
    return (
      <Stack className={"top-perfumes"}>
        <Stack className={"container"}>
          <Stack ref={refInfo} className={"info-box sr-hidden"}>
            <Box component={"div"} className={"left"}>
              <span>{t("Top perfumes")}</span>
              <p>{t("Check out our Top Perfumes")}</p>
            </Box>
            <Box component={"div"} className={"right"}>
              <div className={"pagination-box"}>
                <WestIcon className={"swiper-top-prev"} />
                <div className={"swiper-top-pagination"}></div>
                <EastIcon className={"swiper-top-next"} />
              </div>
            </Box>
          </Stack>
          <Stack ref={refCards} className={"card-box sr-hidden sr-delay-1"}>
            <Swiper
              className={"top-perfume-swiper"}
              slidesPerView={4}
              slidesPerGroup={1}
              spaceBetween={24}
              modules={[Autoplay, Navigation, Pagination]}
              navigation={{
                nextEl: ".swiper-top-next",
                prevEl: ".swiper-top-prev",
              }}
              pagination={{
                el: ".swiper-top-pagination",
              }}
            >
              {topPerfumes.map((perfume: Perfume) => {
                return (
                  <SwiperSlide
                    className={"top-perfume-slide"}
                    key={perfume?._id}
                  >
                    <TopPerfumeCard
                      perfume={perfume}
                      likePerfumeHandler={likePerfumeHandler}
                    />
                  </SwiperSlide>
                );
              })}
            </Swiper>
          </Stack>
        </Stack>
      </Stack>
    );
  }
};

TopPerfumes.defaultProps = {
  initialInput: {
    page: 1,
    limit: 8,
    sort: "perfumeRank",
    direction: "DESC",
    search: {},
  },
};

export default TopPerfumes;
