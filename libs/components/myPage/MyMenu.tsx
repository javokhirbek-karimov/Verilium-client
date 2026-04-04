import React from "react";
import { useRouter } from "next/router";
import { Stack, Typography } from "@mui/material";
import Link from "next/link";
import useDeviceDetect from "../../hooks/useDeviceDetect";
import { useReactiveVar } from "@apollo/client";
import { userVar } from "../../../apollo/store";
import { REACT_APP_API_URL } from "../../config";
import { logOut } from "../../auth";
import { sweetConfirmAlert } from "../../sonner";

// MUI icons
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import LocalFloristIcon from "@mui/icons-material/LocalFlorist";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";
import ArticleOutlinedIcon from "@mui/icons-material/ArticleOutlined";
import EditNoteIcon from "@mui/icons-material/EditNote";
import ManageAccountsOutlinedIcon from "@mui/icons-material/ManageAccountsOutlined";
import LogoutIcon from "@mui/icons-material/Logout";

const MyMenu = () => {
  const device = useDeviceDetect();
  const router = useRouter();
  const category: string = (router.query?.category as string) ?? "myProfile";
  const user = useReactiveVar(userVar);

  const isActive = (cat: string) => category === cat;

  /** HANDLERS **/
  const logoutHandler = async () => {
    try {
      if (await sweetConfirmAlert("Do you want to logout?")) logOut();
    } catch (err: any) {
      console.log("ERROR, logoutHandler:", err.message);
    }
  };

  if (device === "mobile") {
    return <div>MY MENU MOBILE</div>;
  }

  return (
    <Stack className="my-menu">
      {/* ── Profile ─────────────────────────────────────────────────── */}
      <Stack className="menu-profile">
        <img
          className="avatar"
          src={
            user?.memberImage
              ? `${REACT_APP_API_URL}/${user?.memberImage}`
              : "/img/profile/defaultUser.svg"
          }
          alt="avatar"
          onError={(e) => {
            e.currentTarget.src = "/img/profile/defaultUser.svg";
          }}
        />
        <Stack className="profile-info">
          <Typography className="nick">{user?.memberNick}</Typography>
          {user?.memberType === "ADMIN" ? (
            <a href="/_admin/users" target={"_blank"}>
              <Typography className={"view-list"}>
                {user?.memberType}
              </Typography>
            </a>
          ) : (
            <Typography className={"view-list"}>{user?.memberType}</Typography>
          )}
        </Stack>
      </Stack>

      {/* ── Collection (EXPERT only) ─────────────────────────────────── */}
      {(user?.memberType === "EXPERT" || user?.memberType === "AGENT") && (
        <Stack className="menu-section">
          <Typography className="section-label">Collection</Typography>
          <MenuItem
            href="addPerfume"
            active={isActive("addPerfume")}
            icon={<AddCircleOutlineIcon fontSize="small" />}
            label="Add Perfume"
          />
          <MenuItem
            href="myPerfumes"
            active={isActive("myPerfumes")}
            icon={<LocalFloristIcon fontSize="small" />}
            label="My Perfumes"
          />
        </Stack>
      )}

      {/* ── Explore ─────────────────────────────────────────────────── */}
      <Stack className="menu-section">
        <Typography className="section-label">Explore</Typography>
        <MenuItem
          href="myFavorites"
          active={isActive("myFavorites")}
          icon={<FavoriteBorderIcon fontSize="small" />}
          label="My Favorites"
        />
        <MenuItem
          href="recentlyVisited"
          active={isActive("recentlyVisited")}
          icon={<VisibilityOutlinedIcon fontSize="small" />}
          label="Recently Visited"
        />
      </Stack>

      {/* ── Community ───────────────────────────────────────────────── */}
      <Stack className="menu-section">
        <Typography className="section-label">Community</Typography>
        <MenuItem
          href="myArticles"
          active={isActive("myArticles")}
          icon={<ArticleOutlinedIcon fontSize="small" />}
          label="My Articles"
        />
        <MenuItem
          href="writeArticle"
          active={isActive("writeArticle")}
          icon={<EditNoteIcon fontSize="small" />}
          label="Write Article"
        />
      </Stack>

      {/* ── Social ──────────────────────────────────────────────────── */}
      <Stack className="menu-section">
        <Typography className="section-label">Social</Typography>
        <MenuItem
          href="followers"
          active={isActive("followers")}
          icon={<PeopleAltOutlinedIcon fontSize="small" />}
          label="My Followers"
        />
        <MenuItem
          href="followings"
          active={isActive("followings")}
          icon={<PersonAddAltIcon fontSize="small" />}
          label="My Followings"
        />
      </Stack>

      {/* ── Account ─────────────────────────────────────────────────── */}
      <Stack className="menu-section">
        <Typography className="section-label">Account</Typography>
        <MenuItem
          href="myProfile"
          active={isActive("myProfile")}
          icon={<ManageAccountsOutlinedIcon fontSize="small" />}
          label="My Profile"
        />
        <Stack className={`menu-item logout`} onClick={logoutHandler}>
          <LogoutIcon fontSize="small" className="item-icon" />
          <Typography className="item-label">Logout</Typography>
        </Stack>
      </Stack>
    </Stack>
  );
};

/** Reusable nav item ─────────────────────────────────────────────────────── */
interface MenuItemProps {
  href: string;
  active: boolean;
  icon: React.ReactNode;
  label: string;
}

const MenuItem = ({ href, active, icon, label }: MenuItemProps) => (
  <Link
    href={{ pathname: "/mypage", query: { category: href } }}
    scroll={false}
  >
    <Stack className={`menu-item ${active ? "active" : ""}`}>
      <span className="item-icon">{icon}</span>
      <Typography className="item-label">{label}</Typography>
      {active && <span className="active-dot" />}
    </Stack>
  </Link>
);

export default MyMenu;
