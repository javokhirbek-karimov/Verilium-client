import React from "react";
import { useRouter } from "next/router";
import { Stack, Box } from "@mui/material";
import useDeviceDetect from "../../hooks/useDeviceDetect";
import { Member } from "../../types/member/member";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import ArticleIcon from "@mui/icons-material/Article";

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

  const goToExpert = () => {
    router.push({ pathname: "/member", query: { memberId: expert?._id } });
  };

  if (device === "mobile") {
    return (
      <Stack className="top-expert-card" onClick={goToExpert}>
        <img
          src={expertImage}
          alt=""
          onError={(e) => {
            e.currentTarget.src = "/img/profile/defaultUser.jpg";
          }}
        />
        <strong>{expert?.memberNick}</strong>
        <span>{expert?.memberType}</span>
      </Stack>
    );
  }

  return (
    <Stack className="top-expert-card" onClick={goToExpert}>
      {/* Cover banner */}
      <Box className="card-cover" />

      {/* Avatar */}
      <Box className="avatar-wrap">
        <img
          src={expertImage}
          alt={expert?.memberNick}
          onError={(e) => {
            e.currentTarget.src = "/img/profile/defaultUser.jpg";
          }}
        />
      </Box>

      {/* Info */}
      <Box className="card-info">
        <strong className="nick">{expert?.memberNick}</strong>
        <span className="type">{expert?.memberType}</span>
        {expert?.memberDesc && (
          <p className="desc">{expert.memberDesc}</p>
        )}
      </Box>

      {/* Stats */}
      <Box className="card-stats">
        <Box className="stat">
          <PeopleAltIcon />
          <span>{expert?.memberFollowers ?? 0}</span>
        </Box>
        <Box className="stat-divider" />
        <Box className="stat">
          <ArticleIcon />
          <span>{expert?.memberArticles ?? 0}</span>
        </Box>
      </Box>
    </Stack>
  );
};

export default TopExpertCard;
