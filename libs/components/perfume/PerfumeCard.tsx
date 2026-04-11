import React from "react";
import { Stack, Box, Typography, Chip } from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import { useReactiveVar } from "@apollo/client";
import { Perfume } from "../../types/perfume/perfume";
import { REACT_APP_API_URL } from "../../config";
import { userVar } from "../../../apollo/store";
import { T } from "../../types/common";

interface PerfumeCardProps {
  perfume: Perfume;
  onClick: () => void;
  onLike: (user: T, id: string) => void;
}

const PerfumeCard = ({ perfume, onClick, onLike }: PerfumeCardProps) => {
  const user = useReactiveVar(userVar);
  const isLiked = perfume?.meLiked?.[0]?.myFavorite;
  const image = perfume?.perfumeImages?.[0]
    ? `${REACT_APP_API_URL}/${perfume.perfumeImages[0]}`
    : "/img/banner/default-perfume.jpg";

  return (
    <Stack className={"perfume-card"}>
      <Box
        className={"card-img"}
        style={{ backgroundImage: `url(${image})` }}
        onClick={onClick}
      >
        {perfume?.perfumeDiscount && (
          <span className={"discount-badge"}>-{perfume.perfumeDiscount}%</span>
        )}
        <span className={"price-badge"}>${perfume.perfumePrice}</span>
      </Box>

      <Box className={"card-info"} onClick={onClick}>
        <Typography className={"card-brand"}>{perfume.perfumeBrand}</Typography>
        <Typography className={"card-title"}>{perfume.perfumeTitle}</Typography>
        <Box className={"card-chips"}>
          <Chip
            label={perfume.perfumeScent}
            size="small"
            className={"scent-chip"}
          />
          <Chip
            label={`${perfume.perfumeSize}ml`}
            size="small"
            className={"size-chip"}
          />
        </Box>
      </Box>

      <Box className={"card-footer"}>
        <Typography className={"card-type"}>{perfume.perfumeType}</Typography>
        <Box className={"card-stats"}>
          <Box className={"stat"}>
            <RemoveRedEyeIcon fontSize="small" />
            <span>{perfume.perfumeViews}</span>
          </Box>
          <Box
            className={`stat like-btn${isLiked ? " liked" : ""}`}
            onClick={(e: React.MouseEvent<HTMLDivElement>) => {
              e.stopPropagation();
              onLike(user, perfume._id);
            }}
          >
            {isLiked ? (
              <FavoriteIcon fontSize="small" />
            ) : (
              <FavoriteBorderIcon fontSize="small" />
            )}
            <span>{perfume.perfumeLikes}</span>
          </Box>
        </Box>
      </Box>
    </Stack>
  );
};

export default PerfumeCard;
