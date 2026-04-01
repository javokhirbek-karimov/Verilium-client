import React, { useState } from "react";
import { Stack, Box } from "@mui/material";
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

interface TopPerfumesProps {
  initialInput: PerfumesInquiry;
}

const TopPerfumes = (props: TopPerfumesProps) => {
  const { initialInput } = props;
  const device = useDeviceDetect();
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
    onCompleted: (data: T) => {
      setTopPerfumes(data?.getPerfumes?.list);
    },
  });

  const likePerfumeHandler = async (user: T, id: string) => {
    try {
      if (!id) return;
      if (!user._id) throw new Error(Message.NOT_AUTHENTICATED);
      await likeTargetPerfume({
        variables: { input: id },
      });
      await getPerfumesRefetch({ input: initialInput });
      await sweetTopSmallSuccessAlert("success", 800);
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
            <span>Top perfumes</span>
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
          <Stack className={"info-box"}>
            <Box component={"div"} className={"left"}>
              <span>Top perfumes</span>
              <p>Check out our Top Perfumes</p>
            </Box>
          </Stack>
          <Stack className={"card-box"}>
            <Swiper
              className={"top-perfume-swiper"}
              slidesPerView={4}
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
function likeTargetPerfume(arg0: { variables: { input: string } }) {
  throw new Error("Function not implemented.");
}
