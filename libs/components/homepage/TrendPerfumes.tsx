import React, { useEffect, useState } from "react";
import { Stack, Box } from "@mui/material";
import useDeviceDetect from "../../hooks/useDeviceDetect";
import WestIcon from "@mui/icons-material/West";
import EastIcon from "@mui/icons-material/East";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { Perfume } from "../../types/perfume/perfume";
import { PerfumesInquiry } from "../../types/perfume/perfume.input";
import TrendPerfumeCard from "./TrendPerfumeCard";
import { Message } from "../../enums/common.enum";
import { useMutation, useQuery } from "@apollo/client";
import { LIKE_TARGET_PERFUME } from "../../../apollo/user/mutation";
import { GET_PERFUMES } from "../../../apollo/user/query";
import { T } from "../../types/common";
import { sweetMixinErrorAlert, sweetTopSmallSuccessAlert } from "../../sonner";

interface TrendPerfumesProps {
  initialInput: PerfumesInquiry;
}

const TrendPerfumes = (props: TrendPerfumesProps) => {
  const { initialInput } = props;
  const device = useDeviceDetect();
  const [trendPerfumes, setTrendPerfumes] = useState<Perfume[]>([]);

  /** APOLLO REQUESTS **/
  const [likeTargetPerfume] = useMutation(LIKE_TARGET_PERFUME);

  const {
    loading: getPerfumesLoading,
    data: getPerfumessData,
    error: getPerfumesError,
    refetch: getPerfumesRefetch,
  } = useQuery(GET_PERFUMES, {
    fetchPolicy: "cache-and-network",
    variables: { input: initialInput },
    notifyOnNetworkStatusChange: true,
    onCompleted: (data: T) => {
      setTrendPerfumes(data?.getPerfumes?.list);
    },
  });

  /** HANDLERS **/

  const likePerfumeHandler = async (user: T, id: string) => {
    try {
      if (!id) return;
      if (!user._id) throw new Error(Message.NOT_AUTHENTICATED);
      //execute like tartget Property mutation
      await likeTargetPerfume({
        variables: { input: id },
      });
      await getPerfumesRefetch({ input: initialInput });
      //execute get property refetch
      await sweetTopSmallSuccessAlert("success", 800);
    } catch (err: any) {
      console.log("ERROR likePropertyHandler", err.message);
      sweetMixinErrorAlert(err.message).then();
    }
  };

  if (device === "mobile") {
    return (
      <Stack className={"trend-perfumes"}>
        <Stack className={"container"}>
          <Stack className={"info-box"}>
            <span>Trend Perfumes</span>
          </Stack>
          <Stack className={"card-box"}>
            {trendPerfumes.length === 0 ? (
              <Box component={"div"} className={"empty-list"}>
                Trends Empty
              </Box>
            ) : (
              <Swiper
                className={"trend-perfume-swiper"}
                slidesPerView={"auto"}
                centeredSlides={true}
                spaceBetween={15}
                modules={[Autoplay]}
              >
                {trendPerfumes.map((perfume: Perfume) => {
                  return (
                    <SwiperSlide
                      key={perfume._id}
                      className={"trend-perfume-slide"}
                    >
                      <TrendPerfumeCard perfume={perfume} />
                    </SwiperSlide>
                  );
                })}
              </Swiper>
            )}
          </Stack>
        </Stack>
      </Stack>
    );
  } else {
    return (
      <Stack className={"trend-perfumes"}>
        <Stack className={"container"}>
          <Stack className={"info-box"}>
            <Box component={"div"} className={"left"}>
              <span>Trend Perfumes</span>
              <p>Trend is based on likes</p>
            </Box>
            <Box component={"div"} className={"right"}>
              <div className={"pagination-box"}>
                <WestIcon className={"swiper-trend-prev"} />
                <div className={"swiper-trend-pagination"}></div>
                <EastIcon className={"swiper-trend-next"} />
              </div>
            </Box>
          </Stack>
          <Stack className={"card-box"}>
            {trendPerfumes.length === 0 ? (
              <Box component={"div"} className={"empty-list"}>
                Trends Empty
              </Box>
            ) : (
              <Swiper
                className={"trend-perfume-swiper"}
                slidesPerView={4}
                spaceBetween={15}
                modules={[Autoplay, Navigation, Pagination]}
                navigation={{
                  nextEl: ".swiper-trend-next",
                  prevEl: ".swiper-trend-prev",
                }}
                pagination={{
                  el: ".swiper-trend-pagination",
                }}
              >
                {trendPerfumes.map((perfume: Perfume) => {
                  return (
                    <SwiperSlide
                      key={perfume._id}
                      className={"trend-perfume-slide"}
                    >
                      <TrendPerfumeCard key={perfume._id} perfume={perfume} />
                    </SwiperSlide>
                  );
                })}
              </Swiper>
            )}
          </Stack>
        </Stack>
      </Stack>
    );
  }
};

TrendPerfumes.defaultProps = {
  initialInput: {
    page: 1,
    limit: 8,
    sort: "perfumeLikes",
    direction: "DESC",
    search: {},
  },
};

export default TrendPerfumes;
