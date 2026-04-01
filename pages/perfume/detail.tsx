import { NextPage } from "next";
import { useState } from "react";
import { Stack, Box, Typography, Chip, Divider } from "@mui/material";
import { useRouter } from "next/router";
import { useMutation, useQuery, useReactiveVar } from "@apollo/client";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import WestIcon from "@mui/icons-material/West";
import EastIcon from "@mui/icons-material/East";
import withLayoutBasic from "../../libs/components/layout/layoutBasic";
import TopPerfumeCard from "../../libs/components/homepage/TopPerfumesCard";
import { GET_PERFUME, GET_PERFUMES } from "../../apollo/user/query";
import { LIKE_TARGET_PERFUME } from "../../apollo/user/mutation";
import { Perfume } from "../../libs/types/perfume/perfume";
import { REACT_APP_API_URL } from "../../libs/config";
import { userVar } from "../../apollo/store";
import { T } from "../../libs/types/common";
import { Message } from "../../libs/enums/common.enum";
import { sweetMixinErrorAlert, sweetTopSmallSuccessAlert } from "../../libs/sonner";

export const getServerSideProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ["common"])),
  },
});

const PerfumeDetail: NextPage = () => {
  const router = useRouter();
  const perfumeId = router.query.id as string;
  const user = useReactiveVar(userVar);
  const [perfume, setPerfume] = useState<Perfume | null>(null);
  const [similarPerfumes, setSimilarPerfumes] = useState<Perfume[]>([]);
  const [activeImg, setActiveImg] = useState(0);

  /** APOLLO **/
  const [likeTargetPerfume] = useMutation(LIKE_TARGET_PERFUME);

  const { loading } = useQuery(GET_PERFUME, {
    fetchPolicy: "cache-and-network",
    variables: { input: perfumeId },
    skip: !perfumeId,
    onCompleted: (data: T) => {
      setPerfume(data?.getPerfume ?? null);
    },
  });

  useQuery(GET_PERFUMES, {
    fetchPolicy: "cache-and-network",
    variables: {
      input: {
        page: 1,
        limit: 6,
        sort: "perfumeRank",
        direction: "DESC",
        search: perfume?.perfumeScent
          ? { scentList: [perfume.perfumeScent] }
          : {},
      },
    },
    skip: !perfume,
    onCompleted: (data: T) => {
      setSimilarPerfumes(
        (data?.getPerfumes?.list ?? []).filter(
          (p: Perfume) => p._id !== perfumeId
        )
      );
    },
  });

  /** HANDLERS **/
  const likeHandler = async () => {
    try {
      if (!user._id) throw new Error(Message.NOT_AUTHENTICATED);
      await likeTargetPerfume({ variables: { input: perfumeId } });
      await sweetTopSmallSuccessAlert("success", 800);
    } catch (err: any) {
      sweetMixinErrorAlert(err.message).then();
    }
  };

  if (!perfume && !loading) return null;
  if (!perfume) return null;

  const images = perfume.perfumeImages?.map(
    (img) => `${REACT_APP_API_URL}/${img}`
  ) ?? [];
  const activeImage = images[activeImg] ?? "/img/banner/default-perfume.jpg";
  const isLiked = perfume.meLiked?.[0]?.myFavorite;

  const memberImage = perfume.memberData?.memberImage
    ? `${REACT_APP_API_URL}/${perfume.memberData.memberImage}`
    : "/img/profile/defaultUser.svg";

  const finalPrice = perfume.perfumeDiscount
    ? (perfume.perfumePrice * (1 - perfume.perfumeDiscount / 100)).toFixed(2)
    : null;

  return (
    <Stack id={"perfume-detail-page"}>
      <Stack className={"container"}>
        {/* ── Top: Gallery + Info ──────────────────────── */}
        <Box className={"detail-top"}>
          {/* Gallery */}
          <Box className={"gallery"}>
            <Box className={"main-img"}>
              <img src={activeImage} alt={perfume.perfumeTitle} />
            </Box>
            {images.length > 1 && (
              <Box className={"thumb-row"}>
                {images.map((img, idx) => (
                  <Box
                    key={idx}
                    className={`thumb ${idx === activeImg ? "active" : ""}`}
                    onClick={() => setActiveImg(idx)}
                  >
                    <img src={img} alt="" />
                  </Box>
                ))}
              </Box>
            )}
          </Box>

          {/* Info Panel */}
          <Box className={"info-panel"}>
            <Box className={"brand-row"}>
              <Typography className={"brand"}>{perfume.perfumeBrand}</Typography>
              <Chip
                label={perfume.perfumeType}
                size="small"
                className={"type-chip"}
              />
            </Box>

            <Typography className={"perfume-title"}>
              {perfume.perfumeTitle}
            </Typography>

            <Box className={"price-row"}>
              {finalPrice ? (
                <>
                  <Typography className={"price original"}>
                    ${perfume.perfumePrice}
                  </Typography>
                  <Typography className={"price discounted"}>
                    ${finalPrice}
                  </Typography>
                  <Chip
                    label={`-${perfume.perfumeDiscount}%`}
                    size="small"
                    className={"discount-chip"}
                  />
                </>
              ) : (
                <Typography className={"price"}>
                  ${perfume.perfumePrice}
                </Typography>
              )}
            </Box>

            <Box className={"stats-row"}>
              <Box className={"stat"}>
                <RemoveRedEyeIcon fontSize="small" />
                <span>{perfume.perfumeViews} views</span>
              </Box>
              <Box
                className={`stat like-stat${isLiked ? " liked" : ""}`}
                onClick={likeHandler}
              >
                {isLiked ? (
                  <FavoriteIcon fontSize="small" />
                ) : (
                  <FavoriteBorderIcon fontSize="small" />
                )}
                <span>{perfume.perfumeLikes} likes</span>
              </Box>
            </Box>

            <Divider className={"detail-divider"} />

            <Box className={"attributes"}>
              <Box className={"attr-row"}>
                <Typography className={"attr-label"}>Scent</Typography>
                <Chip
                  label={perfume.perfumeScent}
                  size="small"
                  className={"attr-chip"}
                />
              </Box>
              <Box className={"attr-row"}>
                <Typography className={"attr-label"}>Size</Typography>
                <Typography className={"attr-value"}>
                  {perfume.perfumeSize} ml
                </Typography>
              </Box>
              {perfume.perfumeLongevity && (
                <Box className={"attr-row"}>
                  <Typography className={"attr-label"}>Longevity</Typography>
                  <Chip
                    label={perfume.perfumeLongevity}
                    size="small"
                    className={"attr-chip"}
                  />
                </Box>
              )}
              {perfume.perfumeSeason && perfume.perfumeSeason.length > 0 && (
                <Box className={"attr-row"}>
                  <Typography className={"attr-label"}>Season</Typography>
                  <Box className={"chip-row"}>
                    {perfume.perfumeSeason.map((s) => (
                      <Chip
                        key={s}
                        label={s}
                        size="small"
                        className={"attr-chip"}
                      />
                    ))}
                  </Box>
                </Box>
              )}
            </Box>

            <Divider className={"detail-divider"} />

            <Box className={"seller-row"}>
              <img src={memberImage} alt={perfume.memberData?.memberNick} />
              <Box>
                <Typography className={"seller-label"}>Sold by</Typography>
                <Typography className={"seller-nick"}>
                  {perfume.memberData?.memberNick ?? "Expert"}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>

        {/* ── Description ──────────────────────────────── */}
        {perfume.perfumeDesc && (
          <Box className={"desc-section"}>
            <Typography className={"section-title"}>Description</Typography>
            <Typography className={"desc-text"}>{perfume.perfumeDesc}</Typography>
          </Box>
        )}

        {/* ── Similar Perfumes ─────────────────────────── */}
        {similarPerfumes.length > 0 && (
          <Box className={"similar-section"}>
            <Box className={"similar-header"}>
              <Box>
                <Typography className={"section-title"}>
                  Similar Perfumes
                </Typography>
                <Typography className={"section-sub"}>
                  You might also like these
                </Typography>
              </Box>
              <Box className={"nav-btns"}>
                <WestIcon className={"swiper-similar-prev"} />
                <EastIcon className={"swiper-similar-next"} />
              </Box>
            </Box>
            <Swiper
              className={"similar-swiper"}
              slidesPerView={4}
              spaceBetween={24}
              modules={[Autoplay, Navigation]}
              navigation={{
                nextEl: ".swiper-similar-next",
                prevEl: ".swiper-similar-prev",
              }}
            >
              {similarPerfumes.map((p: Perfume) => (
                <SwiperSlide key={p._id} className={"similar-slide"}>
                  <TopPerfumeCard perfume={p} likePerfumeHandler={() => {}} />
                </SwiperSlide>
              ))}
            </Swiper>
          </Box>
        )}
      </Stack>
    </Stack>
  );
};

export default withLayoutBasic(PerfumeDetail);
