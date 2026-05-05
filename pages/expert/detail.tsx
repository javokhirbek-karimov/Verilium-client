import React, { ChangeEvent, useEffect, useState } from "react";
import { useTranslation } from "next-i18next";
import { NextPage } from "next";
import useDeviceDetect from "../../libs/hooks/useDeviceDetect";
import withLayoutBasic from "../../libs/components/layout/layoutBasic";
import PerfumeCard from "../../libs/components/perfume/PerfumeCard";
import ReviewCard from "../../libs/components/expert/ReviewCard";
import {
  Avatar,
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
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
import GroupsIcon from "@mui/icons-material/Groups";
import CloseIcon from "@mui/icons-material/Close";
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
  SUBSCRIBE,
  UNSUBSCRIBE,
} from "../../apollo/user/mutation";
import {
  GET_MEMBER,
  GET_PERFUMES,
  GET_COMMENTS,
  GET_MEMBER_FOLLOWERS,
  GET_MEMBER_FOLLOWINGS,
} from "../../apollo/user/query";
import { T } from "../../libs/types/common";
import { FollowInquiry } from "../../libs/types/follow/follow.input";
import { Follower, Following } from "../../libs/types/follow/follow";

export const getStaticProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ["common"])),
  },
});

const ExpertDetail: NextPage = ({ initialPerfumes, initialComment }: any) => {
  const { t } = useTranslation("common");
  const device = useDeviceDetect();
  const router = useRouter();
  const user = useReactiveVar(userVar);

  const [expertId, setExpertId] = useState<string | null>(null);
  const [expert, setExpert] = useState<Member | null>(null);
  const [perfumesInquiry, setPerfumesInquiry] = useState<PerfumesInquiry>(initialPerfumes);
  const [expertPerfumes, setExpertPerfumes] = useState<Perfume[]>([]);
  const [perfumeTotal, setPerfumeTotal] = useState<number>(0);
  const [commentInquiry, setCommentInquiry] = useState<CommentsInquiry>(initialComment);
  const [expertComments, setExpertComments] = useState<Comment[]>([]);
  const [commentTotal, setCommentTotal] = useState<number>(0);
  const [insertCommentData, setInsertCommentData] = useState<CommentInput>({
    commentGroup: CommentGroup.MEMBER,
    commentContent: "",
    commentRefId: "",
  });

  // Modal state
  const [followersOpen, setFollowersOpen] = useState(false);
  const [followingsOpen, setFollowingsOpen] = useState(false);
  const [followersInquiry, setFollowersInquiry] = useState<FollowInquiry>({
    page: 1,
    limit: 10,
    search: { followingId: "" },
  });
  const [followingsInquiry, setFollowingsInquiry] = useState<FollowInquiry>({
    page: 1,
    limit: 10,
    search: { followerId: "" },
  });

  /** APOLLO REQUESTS **/
  const [createComment] = useMutation(CREATE_COMMENT);
  const [likeTargetMember] = useMutation(LIKE_TARGET_PERFUME);
  const [likeTargetPerfume] = useMutation(LIKE_TARGET_PERFUME);
  const [subscribe] = useMutation(SUBSCRIBE);
  const [unsubscribe] = useMutation(UNSUBSCRIBE);

  const { data: getMemberData, refetch: getMemberRefetch } = useQuery(GET_MEMBER, {
    fetchPolicy: "network-only",
    variables: { input: expertId },
    skip: !expertId,
  });

  const { data: getPerfumesData, refetch: getPerfumesRefetch } = useQuery(GET_PERFUMES, {
    fetchPolicy: "network-only",
    variables: { input: perfumesInquiry },
    skip: !perfumesInquiry.search.memberId,
    notifyOnNetworkStatusChange: true,
  });

  const { data: getCommentsData, refetch: getCommentsRefetch } = useQuery(GET_COMMENTS, {
    fetchPolicy: "network-only",
    variables: { input: commentInquiry },
    skip: !commentInquiry.search.commentRefId,
    notifyOnNetworkStatusChange: true,
  });

  const { data: followersData, refetch: followersRefetch } = useQuery(GET_MEMBER_FOLLOWERS, {
    fetchPolicy: "network-only",
    variables: { input: followersInquiry },
    skip: !followersOpen || !followersInquiry.search.followingId,
  });

  const { data: followingsData, refetch: followingsRefetch } = useQuery(GET_MEMBER_FOLLOWINGS, {
    fetchPolicy: "network-only",
    variables: { input: followingsInquiry },
    skip: !followingsOpen || !followingsInquiry.search.followerId,
  });

  const followersList: Follower[] = followersData?.getMemberFollowers?.list ?? [];
  const followersTotal: number = followersData?.getMemberFollowers?.metaCounter?.[0]?.total ?? 0;
  const followingsList: Following[] = followingsData?.getMemberFollowings?.list ?? [];
  const followingsTotal: number = followingsData?.getMemberFollowings?.metaCounter?.[0]?.total ?? 0;

  /** LIFECYCLES **/
  useEffect(() => {
    if (getMemberData?.getMember) {
      const member = getMemberData.getMember;
      setExpert(member);
      setPerfumesInquiry({ ...perfumesInquiry, search: { memberId: member._id } });
      setCommentInquiry({ ...commentInquiry, search: { commentRefId: member._id } });
      setInsertCommentData({ ...insertCommentData, commentRefId: member._id });
    }
  }, [getMemberData]);

  useEffect(() => {
    if (getPerfumesData) {
      setExpertPerfumes(getPerfumesData?.getPerfumes?.list ?? []);
      setPerfumeTotal(getPerfumesData?.getPerfumes?.metaCounter?.[0]?.total ?? 0);
    }
  }, [getPerfumesData]);

  useEffect(() => {
    if (getCommentsData) {
      setExpertComments(getCommentsData?.getComments?.list ?? []);
      setCommentTotal(getCommentsData?.getComments?.metaCounter?.[0]?.total ?? 0);
    }
  }, [getCommentsData]);

  useEffect(() => {
    if (router.query.expertId) setExpertId(router.query.expertId as string);
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
      if (memberId === user?._id) await router.push(`/mypage?memberId=${memberId}`);
      else await router.push(`/member?memberId=${memberId}`);
    } catch (error) {
      await sweetErrorHandling(error);
    }
  };

  const openFollowersModal = () => {
    if (!expertId) return;
    setFollowersInquiry({ page: 1, limit: 10, search: { followingId: expertId } });
    setFollowersOpen(true);
  };

  const openFollowingsModal = () => {
    if (!expertId) return;
    setFollowingsInquiry({ page: 1, limit: 10, search: { followerId: expertId } });
    setFollowingsOpen(true);
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

  const followExpertHandler = async () => {
    try {
      if (!user._id) throw new Error(Message.NOT_AUTHENTICATED);
      const isFollowing = expert?.meFollowed?.[0]?.myFollowing;
      if (isFollowing) {
        await unsubscribe({ variables: { input: expertId } });
        await sweetTopSmallSuccessAlert("Unfollowed!", 800);
      } else {
        await subscribe({ variables: { input: expertId } });
        await sweetTopSmallSuccessAlert("Followed!", 800);
      }
      await getMemberRefetch({ input: expertId });
    } catch (err: any) {
      sweetMixinErrorAlert(err.message);
    }
  };

  const followInModalHandler = async (
    targetId: string,
    currentlyFollowing: boolean,
    refetch: any,
    inquiry: FollowInquiry,
  ) => {
    try {
      if (!user._id) throw new Error(Message.NOT_AUTHENTICATED);
      if (currentlyFollowing) {
        await unsubscribe({ variables: { input: targetId } });
        await sweetTopSmallSuccessAlert("Unfollowed!", 800);
      } else {
        await subscribe({ variables: { input: targetId } });
        await sweetTopSmallSuccessAlert("Followed!", 800);
      }
      await refetch({ input: inquiry });
    } catch (err: any) {
      sweetMixinErrorAlert(err.message);
    }
  };

  const perfumePaginationChangeHandler = async (_: ChangeEvent<unknown>, value: number) => {
    setPerfumesInquiry({ ...perfumesInquiry, page: value });
  };

  const commentPaginationChangeHandler = async (_: ChangeEvent<unknown>, value: number) => {
    setCommentInquiry({ ...commentInquiry, page: value });
  };

  const createCommentHandler = async () => {
    try {
      if (!user._id) throw new Error(Message.NOT_AUTHENTICATED);
      if (user._id === expertId) throw new Error("Cannot write a review for yourself");
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
  const isFollowing = expert?.meFollowed?.[0]?.myFollowing;

  if (device === "mobile") return <div>EXPERT DETAIL PAGE MOBILE</div>;

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
              <Typography className={"expert-desc"}>{expert.memberDesc}</Typography>
            )}
            <Box className={"stats-row"}>
              <Box className={"stat"}>
                <RemoveRedEyeIcon fontSize="small" />
                <span>{expert?.memberViews ?? 0} {t("views")}</span>
              </Box>
              <Box
                className={`stat like-stat${isLiked ? " liked" : ""}`}
                onClick={likeExpertHandler}
              >
                {isLiked ? <FavoriteIcon fontSize="small" /> : <FavoriteBorderIcon fontSize="small" />}
                <span>{expert?.memberLikes ?? 0} {t("likes")}</span>
              </Box>
              <Box className={"stat"}>
                <LocalFloristIcon fontSize="small" />
                <span>{(expert as any)?.memberPerfumes ?? 0} {t("perfumes")}</span>
              </Box>
              <Box className={"stat clickable"} onClick={openFollowersModal}>
                <PeopleAltIcon fontSize="small" />
                <span>{expert?.memberFollowers ?? 0} {t("followers")}</span>
              </Box>
              <Box className={"stat clickable"} onClick={openFollowingsModal}>
                <GroupsIcon fontSize="small" />
                <span>{expert?.memberFollowings ?? 0} {t("followings")}</span>
              </Box>
            </Box>

            {user._id && user._id !== expertId && (
              <Button
                className={`follow-btn${isFollowing ? " following" : ""}`}
                onClick={followExpertHandler}
              >
                {isFollowing ? t("Unfollow") : t("Follow")}
              </Button>
            )}

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
          <Typography className={"section-title"}>{t("Perfumes")}</Typography>
          {perfumeTotal > 0 ? (
            <>
              <Box className={"card-grid"}>
                {expertPerfumes.map((perfume: Perfume) => (
                  <PerfumeCard
                    key={perfume._id}
                    perfume={perfume}
                    onClick={() => router.push(`/perfume/detail?id=${perfume._id}`)}
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
                  {perfumeTotal} {perfumeTotal > 1 ? t("perfumes") : t("perfume")} {t("available")}
                </Typography>
              </Stack>
            </>
          ) : (
            <Box className={"empty-state"}>
              <img src="/img/icons/icoAlert.svg" alt="" />
              <Typography>{t("No perfumes found")}</Typography>
            </Box>
          )}
        </Box>

        {/* ── Reviews Section ──────────────────────────── */}
        <Box className={"reviews-section"}>
          <Typography className={"section-title"}>
            {t("Reviews")}
            {commentTotal > 0 && <span className={"review-count"}>{commentTotal}</span>}
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
              {t("No reviews yet. Be the first to share your experience!")}
            </Typography>
          )}

          <Box className={"comment-form"}>
            <Typography className={"form-title"}>{t("Leave a Review")}</Typography>
            <TextField
              className={"comment-input"}
              multiline
              rows={3}
              placeholder={
                user._id
                  ? t("Share your experience with this expert...")
                  : t("Please log in to leave a review")
              }
              value={insertCommentData.commentContent}
              onChange={({ target: { value } }) =>
                setInsertCommentData({ ...insertCommentData, commentContent: value })
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
              {t("Post Review")}
            </Button>
          </Box>
        </Box>
      </Stack>

      {/* ── Followers Modal ───────────────────────────── */}
      <Dialog
        open={followersOpen}
        onClose={() => setFollowersOpen(false)}
        className={"follow-modal"}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle className={"modal-title"}>
          {t("Followers")}
          <span className={"modal-count"}>{followersTotal}</span>
          <IconButton className={"modal-close"} onClick={() => setFollowersOpen(false)}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent className={"modal-content"}>
          {followersList.length === 0 ? (
            <Box className={"modal-empty"}>
              <PeopleAltIcon />
              <Typography>{t("No followers yet")}</Typography>
            </Box>
          ) : (
            <>
              {followersList.map((item: Follower) => {
                const member = item.followerData;
                if (!member) return null;
                const avatar = member.memberImage
                  ? `${REACT_APP_API_URL}/${member.memberImage}`
                  : "/img/profile/defaultUser.svg";
                const alreadyFollowing = item.meFollowed?.[0]?.myFollowing;

                return (
                  <Box key={item._id} className={"modal-member-row"}>
                    <Box
                      className={"modal-member-info"}
                      onClick={() => { setFollowersOpen(false); redirectToMemberPageHandler(member._id); }}
                    >
                      <img
                        src={avatar}
                        alt={member.memberNick}
                        className={"modal-avatar"}
                        onError={(e) => { e.currentTarget.src = "/img/profile/defaultUser.svg"; }}
                      />
                      <Box>
                        <Typography className={"modal-name"}>
                          {member.memberFullName ?? member.memberNick}
                        </Typography>
                        <Typography className={"modal-meta"}>
                          {member.memberFollowers ?? 0} {t("followers")}
                        </Typography>
                      </Box>
                    </Box>
                    {user._id && user._id !== member._id && (
                      <Button
                        className={`modal-follow-btn${alreadyFollowing ? " following" : ""}`}
                        onClick={() =>
                          followInModalHandler(member._id, !!alreadyFollowing, followersRefetch, followersInquiry)
                        }
                      >
                        {alreadyFollowing ? t("Unfollow") : t("Follow")}
                      </Button>
                    )}
                  </Box>
                );
              })}
              {followersTotal > followersInquiry.limit && (
                <Box className={"modal-pagination"}>
                  <Pagination
                    page={followersInquiry.page}
                    count={Math.ceil(followersTotal / followersInquiry.limit)}
                    onChange={(_, value) =>
                      setFollowersInquiry({ ...followersInquiry, page: value })
                    }
                    shape="circular"
                    size="small"
                  />
                </Box>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* ── Followings Modal ──────────────────────────── */}
      <Dialog
        open={followingsOpen}
        onClose={() => setFollowingsOpen(false)}
        className={"follow-modal"}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle className={"modal-title"}>
          {t("Followings")}
          <span className={"modal-count"}>{followingsTotal}</span>
          <IconButton className={"modal-close"} onClick={() => setFollowingsOpen(false)}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent className={"modal-content"}>
          {followingsList.length === 0 ? (
            <Box className={"modal-empty"}>
              <GroupsIcon />
              <Typography>{t("Not following anyone yet")}</Typography>
            </Box>
          ) : (
            <>
              {followingsList.map((item: Following) => {
                const member = item.followingData;
                if (!member) return null;
                const avatar = member.memberImage
                  ? `${REACT_APP_API_URL}/${member.memberImage}`
                  : "/img/profile/defaultUser.svg";
                const alreadyFollowing = item.meFollowed?.[0]?.myFollowing;

                return (
                  <Box key={item._id} className={"modal-member-row"}>
                    <Box
                      className={"modal-member-info"}
                      onClick={() => { setFollowingsOpen(false); redirectToMemberPageHandler(member._id); }}
                    >
                      <img
                        src={avatar}
                        alt={member.memberNick}
                        className={"modal-avatar"}
                        onError={(e) => { e.currentTarget.src = "/img/profile/defaultUser.svg"; }}
                      />
                      <Box>
                        <Typography className={"modal-name"}>
                          {member.memberFullName ?? member.memberNick}
                        </Typography>
                        <Typography className={"modal-meta"}>
                          {member.memberFollowers ?? 0} {t("followers")}
                        </Typography>
                      </Box>
                    </Box>
                    {user._id && user._id !== member._id && (
                      <Button
                        className={`modal-follow-btn${alreadyFollowing ? " following" : ""}`}
                        onClick={() =>
                          followInModalHandler(member._id, !!alreadyFollowing, followingsRefetch, followingsInquiry)
                        }
                      >
                        {alreadyFollowing ? t("Unfollow") : t("Follow")}
                      </Button>
                    )}
                  </Box>
                );
              })}
              {followingsTotal > followingsInquiry.limit && (
                <Box className={"modal-pagination"}>
                  <Pagination
                    page={followingsInquiry.page}
                    count={Math.ceil(followingsTotal / followingsInquiry.limit)}
                    onChange={(_, value) =>
                      setFollowingsInquiry({ ...followingsInquiry, page: value })
                    }
                    shape="circular"
                    size="small"
                  />
                </Box>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>
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
