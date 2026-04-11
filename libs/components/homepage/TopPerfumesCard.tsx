import React from "react";
import { Stack, Box, Divider, Typography } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import useDeviceDetect from "../../hooks/useDeviceDetect";
import FavoriteIcon from "@mui/icons-material/Favorite";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import { Perfume } from "../../types/perfume/perfume";
import { REACT_APP_API_URL } from "../../config";
import { useRouter } from "next/router";
import { useReactiveVar } from "@apollo/client";
import { userVar } from "../../../apollo/store";

interface TopPerfumeCardProps {
  perfume: Perfume;
  likePerfumeHandler: any;
}

const TopPerfumeCard = (props: TopPerfumeCardProps) => {
  const { perfume, likePerfumeHandler } = props;
  const device = useDeviceDetect();
  const router = useRouter();
  const user = useReactiveVar(userVar);
  const isLiked = perfume?.meLiked?.[0]?.myFavorite;

  /** HANDLERS **/
  const pushDetailHandler = async (perfumeId: string) => {
    await router.push({
      pathname: "/perfume/detail",
      query: { id: perfumeId },
    });
  };

  if (device === "mobile") {
    return (
      <Stack className="top-card-box">
        <Box
          component={"div"}
          className={"card-img"}
          style={{
            backgroundImage: `url(${REACT_APP_API_URL}/${perfume?.perfumeImages?.[0]})`,
          }}
          onClick={() => pushDetailHandler(perfume._id)}
        >
          <div>${perfume?.perfumePrice}</div>
        </Box>

        <Box component={"div"} className={"info"}>
          <strong
            className={"title"}
            onClick={() => pushDetailHandler(perfume._id)}
          >
            {perfume?.perfumeTitle}
          </strong>

          <div className={"options"}>
            <div>
              <span>{perfume?.perfumeBrand}</span>
            </div>
            <div>
              <span>{perfume?.perfumeSize} ml</span>
            </div>
            <div>
              <span>{perfume?.perfumeScent}</span>
            </div>
          </div>

          <Divider sx={{ mt: "15px", mb: "17px" }} />

          <div className={"bott"}>
            <p>{perfume?.perfumeType}</p>
            <div className="view-like-box">
              <IconButton color={"default"} size="small">
                <RemoveRedEyeIcon fontSize="small" />
              </IconButton>
              <Typography className="view-cnt">
                {perfume?.perfumeViews}
              </Typography>
              <IconButton
                color={"default"}
                size="small"
                onClick={() => likePerfumeHandler(user, perfume?._id)}
              >
                <FavoriteIcon
                  fontSize="small"
                  style={{ color: isLiked ? "red" : "inherit" }}
                />
              </IconButton>
              <Typography className="view-cnt">
                {perfume?.perfumeLikes}
              </Typography>
            </div>
          </div>
        </Box>
      </Stack>
    );
  }

  return (
    <Stack className="top-card-box">
      <Box
        component={"div"}
        className={"card-img"}
        style={{
          backgroundImage: `url(${REACT_APP_API_URL}/${perfume?.perfumeImages?.[0]}))`,
        }}
        onClick={() => pushDetailHandler(perfume._id)}
      >
        {/* Price badge */}
        <div className="price-badge">${perfume?.perfumePrice}</div>

        {/* Discount badge */}
        {perfume?.perfumeDiscount && (
          <div className="discount-badge">-{perfume.perfumeDiscount}%</div>
        )}
      </Box>

      <Box component={"div"} className={"info"}>
        <strong
          className={"title"}
          onClick={() => pushDetailHandler(perfume._id)}
        >
          {perfume?.perfumeTitle}
        </strong>

        <p className={"desc"}>
          {perfume?.perfumeDesc ?? "No description available"}
        </p>

        <div className={"options"}>
          <div>
            <span>{perfume?.perfumeBrand}</span>
          </div>
          <div>
            <span>{perfume?.perfumeSize} ml</span>
          </div>
          <div>
            <span>{perfume?.perfumeScent}</span>
          </div>
          {perfume?.perfumeLongevity && (
            <div>
              <span>{perfume.perfumeLongevity}</span>
            </div>
          )}
        </div>

        <Divider sx={{ mt: "15px", mb: "17px" }} />

        <div className={"bott"}>
          <p>{perfume?.perfumeType}</p>
          <div className="view-like-box">
            <IconButton color={"default"} size="small">
              <RemoveRedEyeIcon fontSize="small" />
            </IconButton>
            <Typography className="view-cnt">
              {perfume?.perfumeViews}
            </Typography>
            <IconButton
              color={"default"}
              size="small"
              onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                e.stopPropagation();
                likePerfumeHandler(user, perfume?._id);
              }}
            >
              <FavoriteIcon
                fontSize="small"
                style={{ color: isLiked ? "red" : "inherit" }}
              />
            </IconButton>
            <Typography className="view-cnt">
              {perfume?.perfumeLikes}
            </Typography>
          </div>
        </div>
      </Box>
    </Stack>
  );
};

export default TopPerfumeCard;
