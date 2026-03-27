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

interface TrendPerfumeCardProps {
  perfume: Perfume;
}

const TrendPerfumeCard = ({ perfume }: TrendPerfumeCardProps) => {
  const device = useDeviceDetect();
  const router = useRouter();
  const user = useReactiveVar(userVar);

  const image = `${REACT_APP_API_URL}/${perfume?.perfumeImages?.[0]}`;

  const goDetail = () => {
    router.push(`/perfume/${perfume._id}`);
  };

  const isLiked = perfume?.meLiked?.[0]?.myFavorite;

  return (
    <Stack
      className="trend-card-box"
      key={perfume._id}
      onClick={goDetail}
      sx={{ cursor: "pointer" }}
    >
      <Box
        className="card-img"
        sx={{
          backgroundImage: `url(${image})`,
        }}
      >
        <div>${perfume.perfumePrice}</div>
      </Box>

      <Box className="info">
        <strong className="title">{perfume.perfumeTitle}</strong>

        <p className="desc">{perfume.perfumeDesc ?? "No description"}</p>

        <div className="options">
          <div>
            <span>{perfume.perfumeBrand}</span>
          </div>

          <div>
            <span>{perfume.perfumeSize} ml</span>
          </div>

          <div>
            <span>{perfume.perfumeScent}</span>
          </div>
        </div>

        <Divider sx={{ mt: "15px", mb: "17px" }} />

        <div className="bott">
          <p>{perfume.perfumeType}</p>

          <div className="view-like-box">
            <IconButton size="small">
              <RemoveRedEyeIcon fontSize="small" />
            </IconButton>

            <Typography className="view-cnt">{perfume.perfumeViews}</Typography>

            <IconButton size="small">
              <FavoriteIcon
                fontSize="small"
                sx={{ color: isLiked ? "red" : "inherit" }}
              />
            </IconButton>

            <Typography className="view-cnt">{perfume.perfumeLikes}</Typography>
          </div>
        </div>
      </Box>
    </Stack>
  );
};

export default TrendPerfumeCard;
