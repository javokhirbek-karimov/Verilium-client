import React, { useEffect } from "react";
import Head from "next/head";
import { Stack, Box, Typography, Avatar } from "@mui/material";
import { useRouter } from "next/router";
import { useReactiveVar } from "@apollo/client";
import { userVar } from "../../../apollo/store";
import { getJwtToken, updateUserInfo } from "../../auth/index";
import AdminMenuList from "../admin/AdminMenuList";
import { MemberType } from "../../enums/member.enum";
import { REACT_APP_API_URL } from "../../config";
import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";

const withLayoutAdmin = (Component: any) => {
  return (props: any) => {
    const user = useReactiveVar(userVar);
    const router = useRouter();

    useEffect(() => {
      const jwt = getJwtToken();
      if (jwt) updateUserInfo(jwt);
    }, []);

    useEffect(() => {
      if (user._id && user.memberType !== MemberType.ADMIN) {
        router.push("/").then();
      }
    }, [user]);

    const avatarSrc = user?.memberImage
      ? `${REACT_APP_API_URL}/${user.memberImage}`
      : "/img/profile/defaultUser.svg";

    return (
      <>
        <Head>
          <title>Verilium Admin</title>
        </Head>

        <Box className={"admin-wrap"}>
          {/* ── Sidebar ─────────────────────────────────────── */}
          <Box component={"aside"} className={"admin-sidebar"}>
            {/* Logo */}
            <Box className={"admin-sidebar__logo"} onClick={() => router.push("/_admin/users")} sx={{ cursor: "pointer" }}>
              <DashboardRoundedIcon className={"admin-sidebar__logo-icon"} />
              <span className={"admin-sidebar__logo-text"}>Verilium</span>
              <span className={"admin-sidebar__logo-badge"}>Admin</span>
            </Box>

            {/* Navigation */}
            <Box className={"admin-sidebar__nav"}>
              <AdminMenuList />
            </Box>

            {/* Admin profile */}
            <Box className={"admin-sidebar__profile"}>
              <Avatar src={avatarSrc} sx={{ width: 36, height: 36 }} />
              <Stack>
                <Typography className={"admin-sidebar__profile-name"}>
                  {user?.memberNick || "Admin"}
                </Typography>
                <Typography className={"admin-sidebar__profile-role"}>
                  Administrator
                </Typography>
              </Stack>
            </Box>
          </Box>

          {/* ── Main area ───────────────────────────────────── */}
          <Box className={"admin-main"}>
            {/* Topbar */}
            <Box className={"admin-topbar"}>
              <Typography className={"admin-topbar__page"}>
                {router.pathname.split("/").filter(Boolean).slice(1).join(" / ") || "Dashboard"}
              </Typography>
              <Stack direction={"row"} alignItems={"center"} gap={1.5}>
                <Box
                  className={"admin-topbar__back"}
                  onClick={() => router.push("/")}
                >
                  ← Back to site
                </Box>
                <Avatar src={avatarSrc} sx={{ width: 32, height: 32 }} />
              </Stack>
            </Box>

            {/* Page content */}
            <Box className={"admin-content"}>
              <Component {...props} />
            </Box>
          </Box>
        </Box>
      </>
    );
  };
};

export default withLayoutAdmin;
