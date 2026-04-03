import React, { ChangeEvent, useEffect, useState } from "react";
import { NextPage } from "next";
import useDeviceDetect from "../../libs/hooks/useDeviceDetect";
import withLayoutBasic from "../../libs/components/layout/layoutBasic";
import PerfumeCard from "../../libs/components/perfume/PerfumeCard";
import ReviewCard from "../../libs/components/expert/ReviewCard";
import {
  Avatar,
  Box,
  Button,
  Divider,
  Pagination,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import SendIcon from "@mui/icons-material/Send";
import LocalFloristIcon from "@mui/icons-material/LocalFlorist";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import { useMutation, useQuery, useReactiveVar } from "@apollo/client";
import { useRouter } from "next/router";
import { Perfume } from "../../libs/types/perfume/perfume";
import { Member } from "../../libs/types/member/member";
import {
  sweetErrorHandling,
  sweetMixinErrorAlert,
  sweetTopSmallSuccessAlert,
} from "../../libs/sonner";
import { userVar } from "../../apollo/store";
import { PerfumesInquiry } from "../../libs/types/perfume/perfume.input";
import {
  CommentInput,
  CommentsInquiry,
} from "../../libs/types/comment/comment.input";
import { Comment } from "../../libs/types/comment/comment";
import { CommentGroup } from "../../libs/enums/comment.enum";
import { Message } from "../../libs/enums/common.enum";
import { REACT_APP_API_URL } from "../../libs/config";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import {
  CREATE_COMMENT,
  LIKE_TARGET_PERFUME,
} from "../../apollo/user/mutation";
import {
  GET_MEMBER,
  GET_PERFUMES,
  GET_COMMENTS,
} from "../../apollo/user/query";
import { T } from "../../libs/types/common";

export const getStaticProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ["common"])),
  },
});

const ExpertDetail: NextPage = ({ initialPerfumes, initialComment }: any) => {
  const device = useDeviceDetect();
  const router = useRouter();
  const user = useReactiveVar(userVar);
  const [expertId, setExpertId] = useState<string | null>(null);
  const [expert, setExpert] = useState<Member | null>(null);
  const [perfumesInquiry, setPerfumesInquiry] =
    useState<PerfumesInquiry>(initialPerfumes);
  const [expertPerfumes, setExpertPerfumes] = useState<Perfume[]>([]);
  const [perfumeTotal, setPerfumeTotal] = useState<number>(0);
  const [commentInquiry, setCommentInquiry] =
    useState<CommentsInquiry>(initialComment);
  const [expertComments, setExpertComments] = useState<Comment[]>([]);
  const [commentTotal, setCommentTotal] = useState<number>(0);
  const [insertCommentData, setInsertCommentData] = useState<CommentInput>({
    commentGroup: CommentGroup.MEMBER,
    commentContent: "",
    commentRefId: "",
  });

  /** APOLLO REQUESTS **/
  const [createComment] = useMutation(CREATE_COMMENT);
  const [likeTargetMember] = useMutation(LIKE_TARGET_PERFUME);
  const [likeTargetPerfume] = useMutation(LIKE_TARGET_PERFUME);

  const { refetch: getMemberRefetch } = useQuery(GET_MEMBER, {
    fetchPolicy: "network-only",
    variables: { input: expertId },
    skip: !expertId,
    onCompleted: (data: T) => {
      setExpert(data?.getMember);
      setPerfumesInquiry({
        ...perfumesInquiry,
        search: { memberId: data?.getMember?._id },
      });
      setCommentInquiry({
        ...commentInquiry,
        search: { commentRefId: data?.getMember?._id },
      });
      setInsertCommentData({
        ...insertCommentData,
        commentRefId: data?.getMember?._id,
      });
    },
  });

  const { refetch: getPerfumesRefetch } = useQuery(GET_PERFUMES, {
    fetchPolicy: "network-only",
    variables: { input: perfumesInquiry },
    skip: !perfumesInquiry.search.memberId,
    notifyOnNetworkStatusChange: true,
    onCompleted: (data: T) => {
      setExpertPerfumes(data?.getPerfumes?.list ?? []);
      setPerfumeTotal(data?.getPerfumes?.metaCounter?.[0]?.total ?? 0);
    },
  });

  const { refetch: getCommentsRefetch } = useQuery(GET_COMMENTS, {
    fetchPolicy: "network-only",
    variables: { input: commentInquiry },
    skip: !commentInquiry.search.commentRefId,
    notifyOnNetworkStatusChange: true,
    onCompleted: (data: T) => {
      setExpertComments(data?.getComments?.list ?? []);
      setCommentTotal(data?.getComments?.metaCounter?.[0]?.total ?? 0);
    },
  });

  /** LIFECYCLES **/
  useEffect(() => {
    if (router.query.agentId) setExpertId(router.query.agentId as string);
  }, [router]);

  useEffect(() => {
    if (perfumesInquiry.search.memberId) {
      getPerfumesRefetch({ variables: { input: perfumesInquiry } });
    }
  }, [perfumesInquiry]);

  useEffect(() => {
    if (commentInquiry.search.commentRefId) {
      getCommentsRefetch({ variables: { input: commentInquiry } });
    }
  }, [commentInquiry]);

  /** HANDLERS **/
  const redirectToMemberPageHandler = async (memberId: string) => {
    try {
      if (memberId === user?._id)
        await router.push(`/mypage?memberId=${memberId}`);
      else await router.push(`/member?memberId=${memberId}`);
    } catch (error) {
      await sweetErrorHandling(error);
    }
  };

  const likeExpertHandler = async () => {
    try {
      if (!user._id) throw new Error(Message.NOT_AUTHENTICATED);
      await likeTargetMember({ variables: { input: expertId } });
      await getMemberRefetch({ input: expertId });
      await sweetTopSmallSuccessAlert("Liked!", 800);
    } catch (err: any) {
      sweetMixinErrorAlert(err.message);
    }
  };

  const likePerfumeHandler = async (_user: T, id: string) => {
    try {
      if (!id) return;
      if (!user._id) throw new Error(Message.NOT_AUTHENTICATED);
      await likeTargetPerfume({ variables: { input: id } });
      await getPerfumesRefetch({ input: perfumesInquiry });
      await sweetTopSmallSuccessAlert("Liked!", 800);
    } catch (err: any) {
      sweetMixinErrorAlert(err.message);
    }
  };

  const perfumePaginationChangeHandler = async (
    _: ChangeEvent<unknown>,
    value: number,
  ) => {
    setPerfumesInquiry({ ...perfumesInquiry, page: value });
  };

  const commentPaginationChangeHandler = async (
    _: ChangeEvent<unknown>,
    value: number,
  ) => {
    setCommentInquiry({ ...commentInquiry, page: value });
  };

  const createCommentHandler = async () => {
    try {
      if (!user._id) throw new Error(Message.NOT_AUTHENTICATED);
      if (user._id === expertId)
        throw new Error("Cannot write a review for yourself");
      await createComment({ variables: { input: insertCommentData } });
      setInsertCommentData({ ...insertCommentData, commentContent: "" });
      await getCommentsRefetch({ input: commentInquiry });
      await sweetTopSmallSuccessAlert("Review posted!", 800);
    } catch (err: any) {
      sweetErrorHandling(err);
    }
  };

  const expertImage = expert?.memberImage
    ? `${REACT_APP_API_URL}/${expert.memberImage}`
    : "/img/profile/defaultUser.svg";

  const isLiked = expert?.meLiked?.[0]?.myFavorite;

  if (device === "mobile") {
    return <div>EXPERT DETAIL PAGE MOBILE</div>;
  }

  return (
    <Stack id={"expert-detail-page"}>
      <Stack className={"container"}>
        <Box className={"expert-hero"}>
          <Box className={"avatar-wrap"}>
            <Avatar
              className={"expert-avatar"}
              src={expertImage}
              onClick={() => redirectToMemberPageHandler(expert?._id as string)}
            />
          </Box>
          <Box className={"hero-info"}>
            <Typography
              className={"expert-name"}
              onClick={() => redirectToMemberPageHandler(expert?._id as string)}
            >
              {expert?.memberFullName ?? expert?.memberNick ?? "Expert"}
            </Typography>
            {expert?.memberDesc && (
              <Typography className={"expert-desc"}>
                {expert.memberDesc}
              </Typography>
            )}
            <Box className={"stats-row"}>
              <Box className={"stat"}>
                <RemoveRedEyeIcon fontSize="small" />
                <span>{expert?.memberViews ?? 0} views</span>
              </Box>
              <Box
                className={`stat like-stat${isLiked ? " liked" : ""}`}
                onClick={likeExpertHandler}
              >
                {isLiked ? (
                  <FavoriteIcon fontSize="small" />
                ) : (
                  <FavoriteBorderIcon fontSize="small" />
                )}
                <span>{expert?.memberLikes ?? 0} likes</span>
              </Box>
              <Box className={"stat"}>
                <LocalFloristIcon fontSize="small" />
                <span>{(expert as any)?.memberPerfumes ?? 0} perfumes</span>
              </Box>
              <Box className={"stat"}>
                <PeopleAltIcon fontSize="small" />
                <span>{expert?.memberFollowers ?? 0} followers</span>
              </Box>
            </Box>
            {expert?.memberPhone && (
              <Box className={"contact-row"}>
                <img src="/img/icons/call.svg" alt="" />
                <span>{expert.memberPhone}</span>
              </Box>
            )}
          </Box>
        </Box>

        <Divider className={"hero-divider"} />

        {/* ── Expert's Perfumes ────────────────────────── */}
        <Box className={"listings-section"}>
          <Typography className={"section-title"}>Perfumes</Typography>
          {perfumeTotal > 0 ? (
            <>
              <Box className={"card-grid"}>
                {expertPerfumes.map((perfume: Perfume) => (
                  <PerfumeCard
                    key={perfume._id}
                    perfume={perfume}
                    onClick={() =>
                      router.push(`/perfume/detail?id=${perfume._id}`)
                    }
                    onLike={likePerfumeHandler}
                  />
                ))}
              </Box>
              <Stack className={"pagination-wrap"}>
                <Pagination
                  page={perfumesInquiry.page}
                  count={Math.ceil(perfumeTotal / perfumesInquiry.limit) || 1}
                  onChange={perfumePaginationChangeHandler}
                  shape="circular"
                  color="primary"
                />
                <Typography className={"total-label"}>
                  {perfumeTotal} perfume{perfumeTotal > 1 ? "s" : ""} available
                </Typography>
              </Stack>
            </>
          ) : (
            <Box className={"empty-state"}>
              <img src="/img/icons/icoAlert.svg" alt="" />
              <Typography>No perfumes found</Typography>
            </Box>
          )}
        </Box>

        {/* ── Reviews Section ──────────────────────────── */}
        <Box className={"reviews-section"}>
          <Typography className={"section-title"}>
            Reviews
            {commentTotal > 0 && (
              <span className={"review-count"}>{commentTotal}</span>
            )}
          </Typography>

          {expertComments.length > 0 ? (
            <>
              <Stack className={"comment-list"}>
                {expertComments.map((comment: Comment) => (
                  <ReviewCard comment={comment} key={comment._id} />
                ))}
              </Stack>
              <Box className={"pagination-wrap"}>
                <Pagination
                  page={commentInquiry.page}
                  count={Math.ceil(commentTotal / commentInquiry.limit) || 1}
                  onChange={commentPaginationChangeHandler}
                  shape="circular"
                  color="primary"
                />
              </Box>
            </>
          ) : (
            <Typography className={"no-reviews"}>
              No reviews yet. Be the first to share your experience!
            </Typography>
          )}

          {/* Write review */}
          <Box className={"comment-form"}>
            <Typography className={"form-title"}>Leave a Review</Typography>
            <TextField
              className={"comment-input"}
              multiline
              rows={3}
              placeholder={
                user._id
                  ? "Share your experience with this expert..."
                  : "Please log in to leave a review"
              }
              value={insertCommentData.commentContent}
              onChange={({ target: { value } }) =>
                setInsertCommentData({
                  ...insertCommentData,
                  commentContent: value,
                })
              }
              disabled={!user._id}
              fullWidth
            />
            <Button
              className={"comment-submit"}
              variant="contained"
              endIcon={<SendIcon />}
              disabled={!insertCommentData.commentContent.trim() || !user._id}
              onClick={createCommentHandler}
            >
              Post Review
            </Button>
          </Box>
        </Box>
      </Stack>
    </Stack>
  );
};

ExpertDetail.defaultProps = {
  initialPerfumes: {
    page: 1,
    limit: 9,
    search: { memberId: "" },
  },
  initialComment: {
    page: 1,
    limit: 5,
    sort: "createdAt",
    direction: "ASC",
    search: { commentRefId: "" },
  },
};

export default withLayoutBasic(ExpertDetail);
