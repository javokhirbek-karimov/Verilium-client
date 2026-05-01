import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Stack, Box } from "@mui/material";
import useDeviceDetect from "../../hooks/useDeviceDetect";
import { useScrollReveal } from "../../hooks/useScrollReveal";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import WestIcon from "@mui/icons-material/West";
import EastIcon from "@mui/icons-material/East";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import TopExpertCard from "./TopExpertCard";
import { Member } from "../../types/member/member";
import { ExpertsInquiry } from "../../types/member/member.input";
import { useQuery } from "@apollo/client";
import { GET_EXPERTS } from "../../../apollo/user/query";
import { T } from "../../types/common";
import { useTranslation } from "next-i18next";

interface TopExpertsProps {
  initialInput: ExpertsInquiry;
}

const TopExperts = (props: TopExpertsProps) => {
  const { initialInput } = props;
  const device = useDeviceDetect();
  const { t } = useTranslation("common");
  const router = useRouter();
  const [topExperts, setTopExperts] = useState<Member[]>([]);
  const refInfo = useScrollReveal();
  const refWrapper = useScrollReveal();

  /** APOLLO REQUESTS **/
  const { data: getExpertsData, refetch: getExpertsRefetch } = useQuery(
    GET_EXPERTS,
    {
      fetchPolicy: "cache-and-network",
      variables: { input: initialInput },
      notifyOnNetworkStatusChange: true,
    },
  );

  useEffect(() => {
    if (getExpertsData?.getExperts?.list) {
      setTopExperts(getExpertsData.getExperts.list);
    }
  }, [getExpertsData]);

  /** HANDLERS **/

  if (device === "mobile") {
    return (
      <Stack className={"top-experts"}>
        <Stack className={"container"}>
          <Stack className={"info-box"}>
            <span>{t("Top Experts")}</span>
          </Stack>
          <Stack className={"card-box"}>
            {topExperts.length === 0 ? (
              <Box component={"div"} className={"empty-list"}>
                {t("No experts")}
              </Box>
            ) : (
              <>
                <div className={"experts-nav-box"}>
                  <div className={"swiper-experts-mob-prev"}>
                    <WestIcon />
                  </div>
                  <div className={"swiper-experts-mob-pagination"}></div>
                  <div className={"swiper-experts-mob-next"}>
                    <EastIcon />
                  </div>
                </div>
                <Swiper
                  className={"top-experts-swiper"}
                  slidesPerView={2}
                  slidesPerGroup={2}
                  spaceBetween={12}
                  modules={[Navigation, Pagination]}
                  navigation={{
                    nextEl: ".swiper-experts-mob-next",
                    prevEl: ".swiper-experts-mob-prev",
                  }}
                  pagination={{
                    el: ".swiper-experts-mob-pagination",
                    clickable: true,
                  }}
                >
                  {topExperts.map((expert: Member) => (
                    <SwiperSlide
                      className={"top-experts-slide"}
                      key={expert?._id}
                    >
                      <TopExpertCard expert={expert} key={expert?.memberNick} />
                    </SwiperSlide>
                  ))}
                </Swiper>
              </>
            )}
          </Stack>
        </Stack>
      </Stack>
    );
  } else {
    return (
      <Stack className={"top-experts"}>
        <Stack className={"container"}>
          <Stack ref={refInfo} className={"info-box sr-hidden"}>
            <Box component={"div"} className={"left"}>
              <span>{t("Top Experts")}</span>
              <p>{t("Our Top Experts always ready to serve you")}</p>
            </Box>
            <Box component={"div"} className={"right"}>
              <div className={"more-box"}>
                <span>{t("See All Experts")}</span>
                <img src="/img/icons/rightup.svg" alt="" />
              </div>
            </Box>
          </Stack>
          <Stack ref={refWrapper} className={"wrapper sr-hidden sr-delay-1"}>
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
