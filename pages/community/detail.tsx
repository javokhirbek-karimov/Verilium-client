import React, { useEffect, useState } from "react";
import { useTranslation } from "next-i18next";
import { NextPage } from "next";
import { useRouter } from "next/router";
import useDeviceDetect from "../../libs/hooks/useDeviceDetect";
import withLayoutBasic from "../../libs/components/layout/layoutBasic";
import {
  Button,
  Stack,
  Typography,
  IconButton,
  Backdrop,
  Pagination,
} from "@mui/material";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import EditIcon from "@mui/icons-material/Edit";
import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ChatIcon from "@mui/icons-material/Chat";
import ChatBubbleOutlineRoundedIcon from "@mui/icons-material/ChatBubbleOutlineRounded";
import { useMutation, useQuery, useReactiveVar } from "@apollo/client";
import Moment from "react-moment";
import { userVar } from "../../apollo/store";
import {
  CommentInput,
  CommentsInquiry,
} from "../../libs/types/comment/comment.input";
import { Comment } from "../../libs/types/comment/comment";
import dynamic from "next/dynamic";
import { CommentGroup, CommentStatus } from "../../libs/enums/comment.enum";
import { T } from "../../libs/types/common";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { BoardArticle } from "../../libs/types/board-article/board-article";
import {
  CREATE_COMMENT,
  LIKE_TARGET_BOARD_ARTICLE,
  UPDATE_COMMENT,
} from "../../apollo/user/mutation";
import { GET_BOARD_ARTICLE, GET_COMMENTS } from "../../apollo/user/query";
import { Messages } from "../../libs/config";
import {
  sweetConfirmAlert,
  sweetMixinErrorAlert,
  sweetMixinSuccessAlert,
  sweetTopSmallSuccessAlert,
} from "../../libs/sonner";
import { CommentUpdate } from "../../libs/types/comment/comment.update";
import { REACT_APP_API_URL } from "../../libs/config";

const ToastViewerComponent = dynamic(
  () => import("../../libs/components/community/TViewer"),
  { ssr: false },
);

export const getStaticProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ["common"])),
  },
});

const CommunityDetail: NextPage = ({ initialInput }: T) => {
  const { t } = useTranslation("common");
  const device = useDeviceDetect();
  const router = useRouter();
  const { query } = router;

  const articleId = query?.id as string;
  const articleCategory = query?.articleCategory as string;

  const [comment, setComment] = useState<string>("");
  const [wordsCnt, setWordsCnt] = useState<number>(0);
  const [updatedCommentWordsCnt, setUpdatedCommentWordsCnt] =
    useState<number>(0);
  const user = useReactiveVar(userVar);
  const [comments, setComments] = useState<Comment[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [searchFilter, setSearchFilter] = useState<CommentsInquiry>({
    ...initialInput,
  });
  const [memberImage, setMemberImage] = useState<string>(
    "/img/community/articleImg.png",
  );
  const [openBackdrop, setOpenBackdrop] = useState<boolean>(false);
  const [updatedComment, setUpdatedComment] = useState<string>("");
  const [updatedCommentId, setUpdatedCommentId] = useState<string>("");
  const [likeLoading, setLikeLoading] = useState<boolean>(false);
  const [boardArticle, setBoardArticle] = useState<BoardArticle>();

  /** APOLLO REQUESTS **/
  const [likeTargetArticle] = useMutation(LIKE_TARGET_BOARD_ARTICLE);
  const [createComment] = useMutation(CREATE_COMMENT);
  const [updateComment] = useMutation(UPDATE_COMMENT);

  const { data: getBoardArticleData, refetch: getBoardArticleRefetch } =
    useQuery(GET_BOARD_ARTICLE, {
      fetchPolicy: "network-only",
      variables: { input: articleId },
      skip: !articleId,
      notifyOnNetworkStatusChange: true,
    });

  const { data: getCommentsData, refetch: getCommentsRefetch } = useQuery(
    GET_COMMENTS,
    {
      fetchPolicy: "network-only",
      variables: { input: searchFilter },
      skip: !searchFilter.search.commentRefId,
      notifyOnNetworkStatusChange: true,
    },
  );

  /** LIFECYCLES **/
  useEffect(() => {
    if (getBoardArticleData?.getBoardArticle) {
      setBoardArticle(getBoardArticleData.getBoardArticle);
      if (getBoardArticleData.getBoardArticle?.memberData?.memberImage) {
        setMemberImage(
          `${REACT_APP_API_URL}/${getBoardArticleData.getBoardArticle.memberData.memberImage}`,
        );
      }
    }
  }, [getBoardArticleData]);

  useEffect(() => {
    if (getCommentsData) {
      setComments(getCommentsData?.getComments?.list);
      setTotal(getCommentsData?.getComments?.metaCounter[0]?.total || 0);
    }
  }, [getCommentsData]);

  useEffect(() => {
    if (articleId)
      setSearchFilter({ ...searchFilter, search: { commentRefId: articleId } });
  }, [articleId]);

  /** HANDLERS **/
  const getCommentMemberImage = (imageUrl: string | undefined) => {
    if (imageUrl) return `${REACT_APP_API_URL}/${imageUrl}`;
    return "/img/community/articleImg.png";
  };

  const goMemberPage = (id: any) => {
    if (id === user?._id) router.push("/mypage");
    else router.push(`/member?memberId=${id}`);
  };

  const cancelButtonHandler = () => {
    setOpenBackdrop(false);
    setUpdatedComment("");
    setUpdatedCommentWordsCnt(0);
  };

  const updateCommentInputHandler = (value: string) => {
    if (value.length > 100) return;
    setUpdatedCommentWordsCnt(value.length);
    setUpdatedComment(value);
  };

  const paginationHandler = (_: T, value: number) => {
    setSearchFilter({ ...searchFilter, page: value });
  };

  const likeBoardArticleHandler = async (user: any, id: string) => {
    try {
      if (!id) return;
      if (!user._id) throw new Error(Messages.error2);
      setLikeLoading(true);
      await likeTargetArticle({ variables: { input: id } });
      await getBoardArticleRefetch({ input: articleId });
      await sweetTopSmallSuccessAlert("success", 800);
    } catch (err: any) {
      sweetMixinErrorAlert(err.message).then();
    } finally {
      setLikeLoading(false);
    }
  };

  const createCommentHandler = async () => {
    if (!comment) return;
    try {
      if (!user._id) throw new Error(Messages.error2);
      const commentInput: CommentInput = {
        commentGroup: CommentGroup.ARTICLE,
        commentRefId: articleId,
        commentContent: comment,
      };
      await createComment({ variables: { input: commentInput } });
      await getCommentsRefetch({ input: searchFilter });
      setComment("");
      await sweetMixinSuccessAlert("Successfully commented");
    } catch (err: any) {
      sweetMixinErrorAlert(err.message).then();
    }
  };

  const updateButtonHandler = async (
    commentId: string,
    commentStatus?: CommentStatus.DELETED,
  ) => {
    try {
      if (!user?._id) throw new Error(Messages.error2);
      if (!commentId) throw new Error("Select a comment to update!");
      if (
        updatedComment ===
        comments?.find((c) => c?._id === commentId)?.commentContent
      )
        return;

      const updateData: CommentUpdate = {
        _id: commentId,
        ...(commentStatus && { commentStatus }),
        ...(updatedComment && { commentContent: updatedComment }),
      };

      if (!updateData?.commentContent && !updateData?.commentStatus)
        throw new Error("Provide data to update your comment!");

      if (commentStatus) {
        if (await sweetConfirmAlert("Do you want to delete the comment?")) {
          await updateComment({ variables: { input: updateData } });
          await sweetMixinSuccessAlert("Successfully deleted!");
        } else return;
      } else {
        await updateComment({ variables: { input: updateData } });
        await sweetMixinSuccessAlert("Successfully updated!");
      }

      await getCommentsRefetch({ input: searchFilter });
    } catch (error: any) {
      await sweetMixinErrorAlert(error.message);
    } finally {
      setOpenBackdrop(false);
      setUpdatedComment("");
      setUpdatedCommentWordsCnt(0);
      setUpdatedCommentId("");
    }
  };

  const liked = boardArticle?.meLiked && boardArticle?.meLiked[0]?.myFavorite;

  if (device === "mobile") {
    return (
      <div id="community-detail-page-mobile">
        {boardArticle?.articleImage && (
          <div className="mobile-article-image">
            <img
              src={`${REACT_APP_API_URL}/${boardArticle.articleImage}`}
              alt={boardArticle.articleTitle}
              onError={(e) => { e.currentTarget.style.display = "none"; }}
            />
          </div>
        )}

        <div className="mobile-detail-container">
          <div className="mobile-article-meta">
            <span className="category-badge">{articleCategory}</span>
            <span suppressHydrationWarning>
              <Moment className="date-text" format={"MMM DD, YYYY"}>
                {boardArticle?.createdAt}
              </Moment>
            </span>
          </div>

          <Typography component="h1" className="mobile-article-title">
            {boardArticle?.articleTitle}
          </Typography>

          <div className="mobile-author-row">
            <img
              src={memberImage}
              alt=""
              className="author-avatar"
              onClick={() => goMemberPage(boardArticle?.memberData?._id)}
            />
            <div className="author-info">
              <Typography
                className="author-nick"
                onClick={() => goMemberPage(boardArticle?.memberData?._id)}
              >
                {boardArticle?.memberData?.memberNick}
              </Typography>
              <div className="mobile-stats">
                <span className="stat-item">
                  <VisibilityIcon /> {boardArticle?.articleViews}
                </span>
                <span className="stat-item">
                  {liked ? <ThumbUpAltIcon /> : <ThumbUpOffAltIcon />}
                  {boardArticle?.articleLikes}
                </span>
                <span className="stat-item">
                  {total > 0 ? <ChatIcon /> : <ChatBubbleOutlineRoundedIcon />}
                  {total}
                </span>
              </div>
            </div>
          </div>

          <div className="mobile-article-body">
            <ToastViewerComponent
              markdown={boardArticle?.articleContent}
              className={"ytb_play"}
            />
          </div>

          <div className="mobile-like-row">
            <Button
              className={`like-btn ${liked ? "liked" : ""}`}
              startIcon={liked ? <ThumbUpAltIcon /> : <ThumbUpOffAltIcon />}
              onClick={() => likeBoardArticleHandler(user, boardArticle?._id || "")}
              disabled={likeLoading}
            >
              {boardArticle?.articleLikes} {t("Likes")}
            </Button>
          </div>

          <div className="mobile-comments-section">
            <Typography className="comments-heading">
              {t("Comments")} <span className="count">{total}</span>
            </Typography>

            <div className="comment-input-box">
              <input
                type="text"
                placeholder={t("Share your thoughts…")}
                value={comment}
                onChange={(e) => {
                  if (e.target.value.length > 100) return;
                  setWordsCnt(e.target.value.length);
                  setComment(e.target.value);
                }}
                onKeyDown={(e) => e.key === "Enter" && createCommentHandler()}
              />
              <div className="input-footer">
                <span className="word-count">{wordsCnt}/100</span>
                <Button className="submit-btn" onClick={createCommentHandler}>
                  {t("Post")}
                </Button>
              </div>
            </div>

            {comments?.map((commentData) => (
              <div className="comment-item" key={commentData?._id}>
                <img
                  src={getCommentMemberImage(commentData?.memberData?.memberImage)}
                  alt=""
                  className="commenter-avatar"
                  onClick={() => goMemberPage(commentData?.memberData?._id as string)}
                />
                <div className="comment-body">
                  <div className="comment-top">
                    <Typography
                      className="commenter-name"
                      onClick={() => goMemberPage(commentData?.memberData?._id as string)}
                    >
                      {commentData?.memberData?.memberNick}
                    </Typography>
                    <span suppressHydrationWarning>
                      <Moment className="comment-date" format={"DD MMM · HH:mm"}>
                        {commentData?.createdAt}
                      </Moment>
                    </span>
                  </div>
                  <Typography className="comment-text">
                    {commentData?.commentContent}
                  </Typography>
                </div>
              </div>
            ))}

            {total > 0 && (
              <Stack className="comments-pagination">
                <Pagination
                  count={Math.ceil(total / searchFilter.limit) || 1}
                  page={searchFilter.page}
                  shape="circular"
                  color="primary"
                  onChange={paginationHandler}
                />
              </Stack>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div id="community-detail-page">
      <div className="detail-container">
        {/* ── ARTICLE HEADER ── */}
        <div className="article-header">
          <div className="article-meta">
            <span className="category-badge">{articleCategory}</span>
            <span className="dot" />
            <span suppressHydrationWarning>
              <Moment className="date-text" format={"MMM DD, YYYY"}>
                {boardArticle?.createdAt}
              </Moment>
            </span>
          </div>

          <Typography component="h1" className="article-title">
            {boardArticle?.articleTitle}
          </Typography>

          <div className="author-row">
            <img
              src={memberImage}
              alt=""
              className="author-avatar"
              onClick={() => goMemberPage(boardArticle?.memberData?._id)}
            />
            <Typography
              className="author-nick"
              onClick={() => goMemberPage(boardArticle?.memberData?._id)}
            >
              {boardArticle?.memberData?.memberNick}
            </Typography>

            <span className="sep" />

            <div className="stats">
              <span className="stat-item">
                <VisibilityIcon />
                {boardArticle?.articleViews}
              </span>
              <span className="stat-item">
                {liked ? <ThumbUpAltIcon /> : <ThumbUpOffAltIcon />}
                {boardArticle?.articleLikes}
              </span>
              <span className="stat-item">
                {total > 0 ? <ChatIcon /> : <ChatBubbleOutlineRoundedIcon />}
                {total}
              </span>
            </div>
          </div>
        </div>

        {/* ── ARTICLE IMAGE ── */}
        {boardArticle?.articleImage && (
          <div className="article-image">
            <img
              src={`${REACT_APP_API_URL}/${boardArticle.articleImage}`}
              alt={boardArticle.articleTitle}
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
          </div>
        )}

        {/* ── ARTICLE BODY ── */}
        <div className="article-body">
          <ToastViewerComponent
            markdown={boardArticle?.articleContent}
            className={"ytb_play"}
          />
        </div>

        {/* ── LIKE BUTTON ── */}
        <div className="like-row">
          <Button
            className={`like-btn ${liked ? "liked" : ""}`}
            startIcon={liked ? <ThumbUpAltIcon /> : <ThumbUpOffAltIcon />}
            onClick={() =>
              likeBoardArticleHandler(user, boardArticle?._id || "")
            }
            disabled={likeLoading}
          >
            {boardArticle?.articleLikes} {t("Likes")}
          </Button>
        </div>

        {/* ── COMMENTS ── */}
        <div className="comments-section">
          <Typography className="comments-heading">
            {t("Comments")}
            <span className="count">{total}</span>
          </Typography>

          {/* Input */}
          <div className="comment-input-box">
            <input
              type="text"
              placeholder={t("Share your thoughts…")}
              value={comment}
              onChange={(e) => {
                if (e.target.value.length > 100) return;
                setWordsCnt(e.target.value.length);
                setComment(e.target.value);
              }}
              onKeyDown={(e) => e.key === "Enter" && createCommentHandler()}
            />
            <div className="input-footer">
              <span className="word-count">{wordsCnt}/100</span>
              <Button className="submit-btn" onClick={createCommentHandler}>
                {t("Post")}
              </Button>
            </div>
          </div>

          {/* Comment list */}
          {comments?.map((commentData) => (
            <div className="comment-item" key={commentData?._id}>
              <img
                src={getCommentMemberImage(
                  commentData?.memberData?.memberImage,
                )}
                alt=""
                className="commenter-avatar"
                onClick={() =>
                  goMemberPage(commentData?.memberData?._id as string)
                }
              />
              <div className="comment-body">
                <div className="comment-top">
                  <Typography
                    className="commenter-name"
                    onClick={() =>
                      goMemberPage(commentData?.memberData?._id as string)
                    }
                  >
                    {commentData?.memberData?.memberNick}
                  </Typography>
                  <span suppressHydrationWarning>
                    <Moment
                      className="comment-date"
                      format={"DD MMM YYYY · HH:mm"}
                    >
                      {commentData?.createdAt}
                    </Moment>
                  </span>
                  {commentData?.memberId === user?._id && (
                    <div className="comment-actions">
                      <IconButton
                        size="small"
                        onClick={() => {
                          setUpdatedCommentId(commentData?._id);
                          updateButtonHandler(
                            commentData?._id,
                            CommentStatus.DELETED,
                          );
                        }}
                      >
                        <DeleteForeverIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => {
                          setUpdatedComment(commentData?.commentContent);
                          setUpdatedCommentWordsCnt(
                            commentData?.commentContent?.length,
                          );
                          setUpdatedCommentId(commentData?._id);
                          setOpenBackdrop(true);
                        }}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </div>
                  )}
                </div>
                <Typography className="comment-text">
                  {commentData?.commentContent}
                </Typography>
              </div>
            </div>
          ))}

          {total > 0 && (
            <Stack className="comments-pagination">
              <Pagination
                count={Math.ceil(total / searchFilter.limit) || 1}
                page={searchFilter.page}
                shape="circular"
                color="primary"
                onChange={paginationHandler}
              />
            </Stack>
          )}
        </div>
      </div>

      {/* ── EDIT COMMENT BACKDROP ── */}
      <Backdrop
        sx={{ zIndex: 1200, backdropFilter: "blur(4px)" }}
        open={openBackdrop}
        onClick={cancelButtonHandler}
      >
        <div
          className="edit-comment-modal"
          onClick={(e) => e.stopPropagation()}
        >
          <Typography className="modal-title">{t("Edit Comment")}</Typography>
          <input
            autoFocus
            value={updatedComment}
            onChange={(e) => updateCommentInputHandler(e.target.value)}
            type="text"
            className="modal-input"
          />
          <div className="modal-footer">
            <span className="modal-count">{updatedCommentWordsCnt}/100</span>
            <div className="modal-btns">
              <Button className="cancel-btn" onClick={cancelButtonHandler}>
                {t("Cancel")}
              </Button>
              <Button
                className="update-btn"
                onClick={() => updateButtonHandler(updatedCommentId, undefined)}
              >
                {t("Update")}
              </Button>
            </div>
          </div>
        </div>
      </Backdrop>
    </div>
  );
};

CommunityDetail.defaultProps = {
  initialInput: {
    page: 1,
    limit: 5,
    sort: "createdAt",
    direction: "DESC",
    search: { commentRefId: "" },
  },
};

export default withLayoutBasic(CommunityDetail);
