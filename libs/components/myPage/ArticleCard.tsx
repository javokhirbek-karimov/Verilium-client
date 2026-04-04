import React from "react";
import { useRouter } from "next/router";
import { Stack, Typography } from "@mui/material";
import useDeviceDetect from "../../hooks/useDeviceDetect";
import { BoardArticle } from "../../types/board-article/board-article";
import { REACT_APP_API_URL } from "../../config";
import Moment from "react-moment";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import IconButton from "@mui/material/IconButton";
import { useReactiveVar } from "@apollo/client";
import { userVar } from "../../../apollo/store";

interface ArticleProps {
  boardArticle: BoardArticle;
  likeArticleHandler: any;
}

const Article = ({ boardArticle, likeArticleHandler }: ArticleProps) => {
  const device = useDeviceDetect();
  const router = useRouter();
  const user = useReactiveVar(userVar);

  const imagePath = boardArticle?.articleImage
    ? `${REACT_APP_API_URL}/${boardArticle.articleImage}`
    : "/img/community/communityImg.png";

  const goDetail = () => {
    router.push({
      pathname: "/community/detail",
      query: {
        articleCategory: boardArticle?.articleCategory,
        id: boardArticle?._id,
      },
    });
  };

  if (device === "mobile") {
    return <div>ARTICLE CARD MOBILE</div>;
  }

  return (
    <Stack className="article-card-config" onClick={goDetail}>
      <Stack className="image-box">
        <img
          src={imagePath}
          alt=""
          className="card-img"
          onError={(e) => {
            e.currentTarget.src = "/img/community/communityImg.png";
          }}
        />
        <Stack className="date-badge">
          <Typography className="month">
            <Moment format="MMM">{boardArticle?.createdAt}</Moment>
          </Typography>
          <Typography className="day">
            <Moment format="DD">{boardArticle?.createdAt}</Moment>
          </Typography>
        </Stack>
        <Stack className="category-badge">
          <Typography>{boardArticle?.articleCategory}</Typography>
        </Stack>
      </Stack>

      <Stack className="content-box">
        <Typography className="article-title">
          {boardArticle?.articleTitle}
        </Typography>

        <Stack className="stats-row">
          <IconButton className="stat-btn" size="small">
            <RemoveRedEyeIcon fontSize="small" />
          </IconButton>
          <Typography className="stat-cnt">
            {boardArticle?.articleViews ?? 0}
          </Typography>
          <IconButton
            className="stat-btn"
            size="small"
            onClick={(e: any) => {
              e.stopPropagation();
              likeArticleHandler(e, user, boardArticle._id);
            }}
          >
            {boardArticle?.meLiked?.[0]?.myFavorite ? (
              <FavoriteIcon fontSize="small" />
            ) : (
              <FavoriteBorderIcon fontSize="small" />
            )}
          </IconButton>
          <Typography className="stat-cnt">
            {boardArticle?.articleLikes ?? 0}
          </Typography>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default Article;
