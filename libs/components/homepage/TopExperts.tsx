import React, { useState } from "react";
import { useRouter } from "next/router";
import { Stack, Box } from "@mui/material";
import useDeviceDetect from "../../hooks/useDeviceDetect";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import TopExpertCard from "./TopExpertCard";
import { Member } from "../../types/member/member";
import { ExpertsInquiry } from "../../types/member/member.input";
import { useQuery } from "@apollo/client";
import { GET_EXPERTS } from "../../../apollo/user/query";
import { T } from "../../types/common";

interface TopExpertsProps {
  initialInput: ExpertsInquiry;
}

const TopExperts = (props: TopExpertsProps) => {
  const { initialInput } = props;
  const device = useDeviceDetect();
  const router = useRouter();
  const [topExperts, setTopExperts] = useState<Member[]>([]);

  /** APOLLO REQUESTS **/
  const {
    loading: getExpertsLoading,
    data: getExpertsData,
    error: getExpertsError,
    refetch: getExpertsRefetch,
  } = useQuery(GET_EXPERTS, {
    fetchPolicy: "cache-and-network",
    variables: { input: initialInput },
    notifyOnNetworkStatusChange: true,
    onCompleted: (data: T) => {
      setTopExperts(data?.getExperts?.list);
    },
  });
  /** HANDLERS **/

  if (topExperts) console.log("topExperts:", topExperts);
  if (!topExperts) return null;

  if (device === "mobile") {
    return (
      <Stack className={"top-experts"}>
        <Stack className={"container"}>
          <Stack className={"info-box"}>
            <span>Top Experts</span>
          </Stack>
          <Stack className={"wrapper"}>
            <Swiper
              className={"top-experts-swiper"}
              slidesPerView={4}
              spaceBetween={29}
              modules={[Autoplay, Navigation, Pagination]}
              navigation={{
                nextEl: ".swiper-experts-next",
                prevEl: ".swiper-experts-prev",
              }}
            >
              {topExperts.map((expert: Member) => {
                return (
                  <SwiperSlide
                    className={"top-experts-slide"}
                    key={expert?._id}
                  >
                    <TopExpertCard expert={expert} key={expert?.memberNick} />
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
      <Stack className={"top-experts"}>
        <Stack className={"container"}>
          <Stack className={"info-box"}>
            <Box component={"div"} className={"left"}>
              <span>Top Experts</span>
              <p>Our Top Experts always ready to serve you</p>
            </Box>
            <Box component={"div"} className={"right"}>
              <div className={"more-box"}>
                <span>See All Experts</span>
                <img src="/img/icons/rightup.svg" alt="" />
              </div>
            </Box>
          </Stack>
          <Stack className={"wrapper"}>
            <Box component={"div"} className={"switch-btn swiper-experts-prev"}>
              <ArrowBackIosNewIcon />
            </Box>
            <Box component={"div"} className={"card-wrapper"}>
              <Swiper
                className={"top-experts-swiper"}
                slidesPerView={4}
                spaceBetween={29}
                modules={[Autoplay, Navigation, Pagination]}
                navigation={{
                  nextEl: ".swiper-experts-next",
                  prevEl: ".swiper-experts-prev",
                }}
              >
                {topExperts.map((expert: Member) => {
                  return (
                    <SwiperSlide
                      className={"top-experts-slide"}
                      key={expert?._id}
                    >
                      <TopExpertCard expert={expert} key={expert?.memberNick} />
                    </SwiperSlide>
                  );
                })}
              </Swiper>
            </Box>
            <Box component={"div"} className={"switch-btn swiper-experts-next"}>
              <ArrowBackIosNewIcon />
            </Box>
          </Stack>
        </Stack>
      </Stack>
    );
  }
};

TopExperts.defaultProps = {
  initialInput: {
    page: 1,
    limit: 8,
    sort: "memberRank",
    direction: "DESC",
    search: {},
  },
};

export default TopExperts;
