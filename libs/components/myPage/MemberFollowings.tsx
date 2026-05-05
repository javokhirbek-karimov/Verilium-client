import React, { useState } from "react";
import { useTranslation } from "next-i18next";
import { Stack, Typography, Button, Pagination } from "@mui/material";
import { useQuery, useReactiveVar } from "@apollo/client";
import { userVar } from "../../../apollo/store";
import { REACT_APP_API_URL } from "../../config";
import useDeviceDetect from "../../hooks/useDeviceDetect";
import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";
import { GET_MEMBER_FOLLOWINGS } from "../../../apollo/user/query";
import { FollowInquiry } from "../../types/follow/follow.input";
import { Following } from "../../types/follow/follow";

interface MemberFollowingsProps {
  subscribeHandler: (id: string, refetch: any, query: any) => void;
  unsubscribeHandler: (id: string, refetch: any, query: any) => void;
  likeMemberHandler: (id: string, refetch: any, query: any) => void;
  redirectToMemberPageHandler: (memberId: string) => void;
}

const MemberFollowings = ({
  subscribeHandler,
  unsubscribeHandler,
  redirectToMemberPageHandler,
}: MemberFollowingsProps) => {
  const { t } = useTranslation("common");
  const device = useDeviceDetect();
  const user = useReactiveVar(userVar);

  const [followingsInquiry, setFollowingsInquiry] = useState<FollowInquiry>({
    page: 1,
    limit: 10,
    search: { followerId: user._id },
  });

  const { data, refetch } = useQuery(GET_MEMBER_FOLLOWINGS, {
    fetchPolicy: "network-only",
    variables: { input: followingsInquiry },
    skip: !user._id,
  });

  const followings: Following[] = data?.getMemberFollowings?.list ?? [];
  const total: number = data?.getMemberFollowings?.metaCounter?.[0]?.total ?? 0;

  if (device === "mobile") return <div>FOLLOWINGS MOBILE</div>;

  return (
    <div id="member-follows-page">
      <Stack className="main-title-box">
        <Typography className="main-title">{t("My Followings")}</Typography>
        <Typography className="sub-title">
          {t("People you follow")}
          {total > 0 && ` (${total})`}
        </Typography>
      </Stack>

      {followings.length === 0 ? (
        <Stack className="follows-empty">
          <PersonAddAltIcon className="empty-icon" />
          <Typography className="empty-text">{t("Not following anyone yet")}</Typography>
        </Stack>
      ) : (
        <>
          <Stack className="follows-list-box">
            <Stack className="listing-title-box">
              <Typography className="title-text" sx={{ width: 280 }}>{t("Member")}</Typography>
              <Typography className="title-text" sx={{ width: 240 }}>{t("Stats")}</Typography>
              <Typography className="title-text">{t("Action")}</Typography>
            </Stack>

            {followings.map((following: Following) => {
              const member = following.followingData;
              if (!member) return null;
              const isFollowing = following.meFollowed?.[0]?.myFollowing;
              const avatar = member.memberImage
                ? `${REACT_APP_API_URL}/${member.memberImage}`
                : "/img/profile/defaultUser.svg";

              return (
                <Stack key={following._id} className="follows-card-box">
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
                          ? unsubscribeHandler(member._id, refetch, followingsInquiry)
                          : subscribeHandler(member._id, refetch, followingsInquiry)
                      }
                    >
                      {isFollowing ? t("Unfollow") : t("Follow")}
                    </Button>
                  </Stack>
                </Stack>
              );
            })}
          </Stack>

          {total > followingsInquiry.limit && (
            <Stack className="pagination-config">
              <Pagination
                page={followingsInquiry.page}
                count={Math.ceil(total / followingsInquiry.limit)}
                onChange={(_, value) =>
                  setFollowingsInquiry({ ...followingsInquiry, page: value })
                }
                shape="circular"
                color="primary"
              />
              <Stack className="total-result">
                <Typography>{total} {t("followings")}</Typography>
              </Stack>
            </Stack>
          )}
        </>
      )}
    </div>
  );
};

export default MemberFollowings;
