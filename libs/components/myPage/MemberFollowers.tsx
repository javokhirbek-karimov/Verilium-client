import React, { useState } from "react";
import { useTranslation } from "next-i18next";
import { Stack, Typography, Button, Pagination } from "@mui/material";
import { useQuery, useReactiveVar } from "@apollo/client";
import { userVar } from "../../../apollo/store";
import { REACT_APP_API_URL } from "../../config";
import useDeviceDetect from "../../hooks/useDeviceDetect";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import { GET_MEMBER_FOLLOWERS } from "../../../apollo/user/query";
import { FollowInquiry } from "../../types/follow/follow.input";
import { Follower } from "../../types/follow/follow";

interface MemberFollowersProps {
  subscribeHandler: (id: string, refetch: any, query: any) => void;
  unsubscribeHandler: (id: string, refetch: any, query: any) => void;
  likeMemberHandler: (id: string, refetch: any, query: any) => void;
  redirectToMemberPageHandler: (memberId: string) => void;
}

const MemberFollowers = ({
  subscribeHandler,
  unsubscribeHandler,
  redirectToMemberPageHandler,
}: MemberFollowersProps) => {
  const { t } = useTranslation("common");
  const device = useDeviceDetect();
  const user = useReactiveVar(userVar);

  const [followersInquiry, setFollowersInquiry] = useState<FollowInquiry>({
    page: 1,
    limit: 10,
    search: { followingId: user._id },
  });

  const { data, refetch } = useQuery(GET_MEMBER_FOLLOWERS, {
    fetchPolicy: "network-only",
    variables: { input: followersInquiry },
    skip: !user._id,
  });

  const followers: Follower[] = data?.getMemberFollowers?.list ?? [];
  const total: number = data?.getMemberFollowers?.metaCounter?.[0]?.total ?? 0;

  if (device === "mobile") return <div>FOLLOWERS MOBILE</div>;

  return (
    <div id="member-follows-page">
      <Stack className="main-title-box">
        <Typography className="main-title">{t("My Followers")}</Typography>
        <Typography className="sub-title">
          {t("People who follow you")}
          {total > 0 && ` (${total})`}
        </Typography>
      </Stack>

      {followers.length === 0 ? (
        <Stack className="follows-empty">
          <PeopleAltOutlinedIcon className="empty-icon" />
          <Typography className="empty-text">{t("No followers yet")}</Typography>
        </Stack>
      ) : (
        <>
          <Stack className="follows-list-box">
            <Stack className="listing-title-box">
              <Typography className="title-text" sx={{ width: 280 }}>{t("Member")}</Typography>
              <Typography className="title-text" sx={{ width: 240 }}>{t("Stats")}</Typography>
              <Typography className="title-text">{t("Action")}</Typography>
            </Stack>

            {followers.map((follower: Follower) => {
              const member = follower.followerData;
              if (!member) return null;
              const isFollowing = follower.meFollowed?.[0]?.myFollowing;
              const avatar = member.memberImage
                ? `${REACT_APP_API_URL}/${member.memberImage}`
                : "/img/profile/defaultUser.svg";

              return (
                <Stack key={follower._id} className="follows-card-box">
                  <Stack
                    className="info"
                    onClick={() => redirectToMemberPageHandler(member._id)}
                  >
                    <Stack className="image-box">
                      <img
                        src={avatar}
                        alt={member.memberNick}
                        onError={(e) => {
                          e.currentTarget.src = "/img/profile/defaultUser.svg";
                        }}
                      />
                    </Stack>
                    <Stack className="information-box">
                      <Typography className="name">
                        {member.memberFullName ?? member.memberNick}
                      </Typography>
                    </Stack>
                  </Stack>

                  <Stack className="details-box">
                    <Stack className="info-box">
                      <span>{member.memberFollowers ?? 0}</span>
                      <p>{t("followers")}</p>
                    </Stack>
                    <Stack className="info-box">
                      <span>{member.memberFollowings ?? 0}</span>
                      <p>{t("followings")}</p>
                    </Stack>
                  </Stack>

                  <Stack className="action-box">
                    <Button
                      onClick={() =>
                        isFollowing
                          ? unsubscribeHandler(member._id, refetch, followersInquiry)
                          : subscribeHandler(member._id, refetch, followersInquiry)
                      }
                    >
                      {isFollowing ? t("Unfollow") : t("Follow")}
                    </Button>
                  </Stack>
                </Stack>
              );
            })}
          </Stack>

          {total > followersInquiry.limit && (
            <Stack className="pagination-config">
              <Pagination
                page={followersInquiry.page}
                count={Math.ceil(total / followersInquiry.limit)}
                onChange={(_, value) =>
                  setFollowersInquiry({ ...followersInquiry, page: value })
                }
                shape="circular"
                color="primary"
              />
              <Stack className="total-result">
                <Typography>{total} {t("followers")}</Typography>
              </Stack>
            </Stack>
          )}
        </>
      )}
    </div>
  );
};

export default MemberFollowers;
