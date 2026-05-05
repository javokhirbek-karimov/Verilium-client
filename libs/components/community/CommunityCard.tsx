import React from "react";
import { useRouter } from "next/router";
import useDeviceDetect from "../../hooks/useDeviceDetect";
import { Stack, Typography } from "@mui/material";
import { BoardArticle } from "../../types/board-article/board-article";
import Moment from "react-moment";
import { REACT_APP_API_URL } from "../../config";
import { useReactiveVar } from "@apollo/client";
import { userVar } from "../../../apollo/store";
import IconButton from "@mui/material/IconButton";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";

interface CommunityCardProps {
  boardArticle: BoardArticle;
  size?: string;
  likeArticleHandler: any;
}

const CommunityCard = (props: CommunityCardProps) => {
  const { boardArticle, size = "normal", likeArticleHandler } = props;
  const device = useDeviceDetect();
  const router = useRouter();
  const user = useReactiveVar(userVar);
  const imagePath: string = boardArticle?.articleImage
    ? `${REACT_APP_API_URL}/${boardArticle?.articleImage}`
    : "/img/community/communityImg.png";

  /** HANDLERS **/
  const chooseArticleHandler = (
    e: React.SyntheticEvent,
    boardArticle: BoardArticle,
  ) => {
    router.push({
      pathname: "/community/detail",
      query: {
        articleCategory: boardArticle?.articleCategory,
        id: boardArticle?._id,
      },
    });
  };

  const goMemberPage = (id: string) => {
    if (id === user?._id) router.push("/mypage");
    else router.push(`/member?memberId=${id}`);
  };

  if (device === "mobile") {
    return (
      <div
        className="mob-community-card"
        onClick={(e: any) => chooseArticleHandler(e, boardArticle)}
      >
        <div
          className="mob-card-img"
          style={{ backgroundImage: `url(${imagePath})` }}
        >
          <span className="mob-category-badge">{boardArticle?.articleCategory}</span>
        </div>
        <div className="mob-card-body">
          <p className="mob-card-title">{boardArticle?.articleTitle}</p>
          <div className="mob-card-footer">
            <div className="mob-card-author">
              <img
                src={
                  boardArticle?.memberData?.memberImage
                    ? `${REACT_APP_API_URL}/${boardArticle.memberData.memberImage}`
                    : "/img/profile/defaultUser.svg"
                }
                alt=""
                onError={(e) => { e.currentTarget.src = "/img/profile/defaultUser.svg"; }}
              />
              <span>{boardArticle?.memberData?.memberNick ?? "Anonymous"}</span>
            </div>
            <div className="mob-card-stats">
              <span className="stat-item">
                <RemoveRedEyeIcon />
                {boardArticle?.articleViews ?? 0}
              </span>
              <span
                className="stat-item like-stat"
                onClick={(e: any) => {
                  e.stopPropagation();
                  likeArticleHandler(e, user, boardArticle._id);
                }}
              >
                {boardArticle?.meLiked?.[0]?.myFavorite
                  ? <FavoriteIcon style={{ color: "#e53935" }} />
                  : <FavoriteBorderIcon />}
                {boardArticle?.articleLikes ?? 0}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <Stack
        sx={{ width: size === "small" ? "285px" : "317px" }}
        className="community-general-card-config"
        onClick={(e: any) => chooseArticleHandler(e, boardArticle)}
      >
        <Stack className="image-box">
          <img src={imagePath} alt="" className="card-img" onError={(e) => { e.currentTarget.src = "/img/community/communityImg.png"; }} />
        </Stack>
        <Stack className="desc-box" sx={{ marginTop: "-20px" }}>
          <Stack>
            <Typography
              className="desc"
              onClick={(e: any) => {
                e.stopPropagation();
                goMemberPage(boardArticle?.memberData?._id as string);
              }}
            >
              {boardArticle?.memberData?.memberNick}
            </Typography>
            <Typography className="title">
              {boardArticle?.articleTitle}
            </Typography>
          </Stack>
          <Stack className={"buttons"}>
            <IconButton color={"default"}>
              <RemoveRedEyeIcon />
            </IconButton>
            <Typography className="view-cnt">
              {boardArticle?.articleViews}
            </Typography>
            <IconButton
              color={"default"}
              onClick={(e: any) =>
                likeArticleHandler(e, user, boardArticle._id)
              }
            >
              {boardArticle?.meLiked && boardArticle?.meLiked[0]?.myFavorite ? (
                <FavoriteIcon color={"primary"} />
              ) : (
                <FavoriteBorderIcon />
              )}
            </IconButton>
            <Typography className="view-cnt">
              {boardArticle?.articleLikes}
            </Typography>
          </Stack>
        </Stack>
        <Stack className="date-box" suppressHydrationWarning>
          <Moment className="month" format={"MMMM"}>
            {boardArticle?.createdAt}
          </Moment>
          <Typography className="day" suppressHydrationWarning>
            <Moment format={"DD"}>{boardArticle?.createdAt}</Moment>
          </Typography>
        </Stack>
      </Stack>
    );
  }
};

export default CommunityCard;
