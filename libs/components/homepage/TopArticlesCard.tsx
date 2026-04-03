import React from "react";
import { Stack, Box, Typography, Chip } from "@mui/material";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import moment from "moment";
import { BoardArticle } from "../../types/board-article/board-article";
import { REACT_APP_API_URL } from "../../config";

interface TopArticlesCardProps {
  article: BoardArticle;
  onClick: () => void;
}

const TopArticlesCard = ({ article, onClick }: TopArticlesCardProps) => {
  const image = article?.articleImage
    ? `${REACT_APP_API_URL}/${article.articleImage}`
    : "/img/community/communityImg.png";

  const memberImage = article?.memberData?.memberImage
    ? `${REACT_APP_API_URL}/${article.memberData.memberImage}`
    : "/img/profile/defaultUser.svg";

  return (
    <Stack className={"article-card"} onClick={onClick}>
      {/* Thumbnail */}
      <Box
        className={"article-img"}
        style={{ backgroundImage: `url(${image})` }}
      >
        <Chip
          label={article?.articleCategory ?? "FREE"}
          className={"category-badge"}
          size="small"
        />
      </Box>

      {/* Content */}
      <Box className={"article-content"}>
        <Typography className={"article-title"}>
          {article?.articleTitle}
        </Typography>

        {article?.articleContent && (
          <Typography className={"article-excerpt"}>
            {article.articleContent}
          </Typography>
        )}

        <Box className={"article-meta"}>
          <Box className={"author"}>
            <img
              src={memberImage}
              alt={article?.memberData?.memberNick}
              onError={(e) => {
                e.currentTarget.src = "/img/profile/defaultUser.svg";
              }}
            />
            <span>{article?.memberData?.memberNick ?? "Anonymous"}</span>
          </Box>
          <Box className={"stats"}>
            <Box className={"stat"}>
              <RemoveRedEyeIcon />
              <span>{article?.articleViews ?? 0}</span>
            </Box>
            <Box className={"stat"}>
              <FavoriteBorderIcon />
              <span>{article?.articleLikes ?? 0}</span>
            </Box>
          </Box>
        </Box>

        <Typography className={"article-date"}>
          {moment(article?.createdAt).format("MMM DD, YYYY")}
        </Typography>
      </Box>
    </Stack>
  );
};

export default TopArticlesCard;
