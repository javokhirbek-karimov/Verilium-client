import React from "react";
import { useTranslation } from "next-i18next";
import { Stack, Typography } from "@mui/material";
import useDeviceDetect from "../../hooks/useDeviceDetect";
import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";

interface MemberFollowingsProps {
  subscribeHandler: (id: string, refetch: any, query: any) => void;
  unsubscribeHandler: (id: string, refetch: any, query: any) => void;
  likeMemberHandler: (id: string, refetch: any, query: any) => void;
  redirectToMemberPageHandler: (memberId: string) => void;
}

const MemberFollowings = ({
  redirectToMemberPageHandler,
}: MemberFollowingsProps) => {
  const { t } = useTranslation("common");
  const device = useDeviceDetect();

  if (device === "mobile") return <div>FOLLOWINGS MOBILE</div>;

  return (
    <div id="member-follows-page">
      <Stack className="main-title-box">
        <Typography className="main-title">{t("My Followings")}</Typography>
        <Typography className="sub-title">{t("People you follow")}</Typography>
      </Stack>
      <Stack className="follows-empty">
        <PersonAddAltIcon className="empty-icon" />
        <Typography className="empty-text">{t("Followings list coming soon")}</Typography>
      </Stack>
    </div>
  );
};

export default MemberFollowings;
