import React from "react";
import { useRouter } from "next/router";
import { Stack } from "@mui/material";
import useDeviceDetect from "../../hooks/useDeviceDetect";
import { Member } from "../../types/member/member";

interface TopExpertProps {
  expert: Member;
}
const TopExpertCard = (props: TopExpertProps) => {
  const { expert } = props;
  const device = useDeviceDetect();
  const router = useRouter();
  const expertImage = expert?.memberImage
    ? `${process.env.REACT_APP_API_URL}/${expert?.memberImage}`
    : "/img/profile/defaultUser.jpg";

  /** HANDLERS **/

  if (device === "mobile") {
    return (
      <Stack className="top-expert-card">
        <img
          src={expertImage}
          alt=""
          onError={(e) => {
            e.currentTarget.src = "/img/profile/defaultUser.svg";
          }}
        />

        <strong>{expert?.memberNick}</strong>
        <span>{expert?.memberType}</span>
      </Stack>
    );
  } else {
    return (
      <Stack className="top-expert-card">
        <img
          src={expertImage}
          alt=""
          onError={(e) => {
            e.currentTarget.src = "/img/profile/defaultUser.svg";
          }}
        />

        <strong>{expert?.memberNick}</strong>
        <span>{expert?.memberType}</span>
      </Stack>
    );
  }
};

export default TopExpertCard;
