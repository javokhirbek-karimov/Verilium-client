import React from "react";
import useDeviceDetect from "../../hooks/useDeviceDetect";
import { Stack, Box, Typography } from "@mui/material";
import Link from "next/link";
import { REACT_APP_API_URL } from "../../config";
import IconButton from "@mui/material/IconButton";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { useReactiveVar } from "@apollo/client";
import { userVar } from "../../../apollo/store";

interface ExpertCardProps {
  expert: any;
  likeMemberHandler: any;
}

const ExpertCard = (props: ExpertCardProps) => {
  const { expert, likeMemberHandler } = props;
  const device = useDeviceDetect();
  const user = useReactiveVar(userVar);
  const imagePath: string = expert?.memberImage
    ? `${REACT_APP_API_URL}/${expert?.memberImage}`
    : "/img/profile/defaultUser.svg";

  if (device === "mobile") {
    return <div>EXPERT CARD</div>;
  } else {
    return (
      <Stack className="expert-general-card">
        <Link
          href={{
            pathname: "/expert/detail",
            query: { expertId: expert?._id },
          }}
        >
          <Box
            component={"div"}
            className={"expert-img"}
            style={{
              backgroundImage: `url(${imagePath})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
          >
            <div>{expert?.memberProperties} properties</div>
          </Box>
        </Link>

        <Stack className={"expert-desc"}>
          <Box component={"div"} className={"expert-info"}>
            <Link
              href={{
                pathname: "/expert/detail",
                query: { expertId: "id" },
              }}
            >
              <strong>{expert?.memberFullName ?? expert?.memberNick}</strong>
            </Link>
            <span>Expert</span>
          </Box>
          <Box component={"div"} className={"buttons"}>
            <IconButton color={"default"}>
              <RemoveRedEyeIcon />
            </IconButton>
            <Typography className="view-cnt">{expert?.memberViews}</Typography>
            <IconButton
              color={"default"}
              onClick={() => likeMemberHandler(user, expert?._id)}
            >
              {expert?.meLiked && expert?.meLiked[0]?.myFavorite ? (
                <FavoriteIcon color={"primary"} />
              ) : (
                <FavoriteBorderIcon />
              )}
            </IconButton>
            <Typography className="view-cnt">{expert?.memberLikes}</Typography>
          </Box>
        </Stack>
      </Stack>
    );
  }
};

export default ExpertCard;
