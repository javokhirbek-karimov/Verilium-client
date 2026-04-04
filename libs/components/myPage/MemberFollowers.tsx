import React, { useState } from "react";
import { Stack, Typography, Button, Pagination } from "@mui/material";
import { useQuery } from "@apollo/client";
import { useReactiveVar } from "@apollo/client";
import { userVar } from "../../../apollo/store";
import { REACT_APP_API_URL } from "../../config";
import { T } from "../../types/common";
import useDeviceDetect from "../../hooks/useDeviceDetect";
import { useRouter } from "next/router";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";

interface MemberFollowersProps {
  subscribeHandler: (id: string, refetch: any, query: any) => void;
  unsubscribeHandler: (id: string, refetch: any, query: any) => void;
  likeMemberHandler: (id: string, refetch: any, query: any) => void;
  redirectToMemberPageHandler: (memberId: string) => void;
}

const MemberFollowers = ({
  redirectToMemberPageHandler,
}: MemberFollowersProps) => {
  const device = useDeviceDetect();

  if (device === "mobile") return <div>FOLLOWERS MOBILE</div>;

  return (
    <div id="member-follows-page">
      <Stack className="main-title-box">
        <Typography className="main-title">My Followers</Typography>
        <Typography className="sub-title">
          People who follow you
        </Typography>
      </Stack>
      <Stack className="follows-empty">
        <PeopleAltOutlinedIcon className="empty-icon" />
        <Typography className="empty-text">Followers list coming soon</Typography>
      </Stack>
    </div>
  );
};

export default MemberFollowers;
