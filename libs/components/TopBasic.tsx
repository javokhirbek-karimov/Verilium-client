import React, { useCallback, useEffect, useState } from "react";
import { useRouter, withRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { getJwtToken, logOut, updateUserInfo } from "../auth";
import { Stack, Box, Popover, Typography, Badge } from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import { alpha, styled } from "@mui/material/styles";
import Menu, { MenuProps } from "@mui/material/Menu";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import { CaretDown } from "phosphor-react";
import { Logout } from "@mui/icons-material";
import useDeviceDetect from "../hooks/useDeviceDetect";
import Link from "next/link";
import { useReactiveVar } from "@apollo/client";
import { userVar, notificationsVar } from "../../apollo/store";

const TopBasic = () => {
  const device = useDeviceDetect();
  const user = useReactiveVar(userVar);
  const { t } = useTranslation("common");
  const router = useRouter();

  const notices = useReactiveVar(notificationsVar);
  const [unreadCount, setUnreadCount] = useState(0);

  const [anchorEl2, setAnchorEl2] = useState<null | HTMLElement>(null);
  const [lang, setLang] = useState<string | null>("en");
  const drop = Boolean(anchorEl2);
  const [logoutAnchor, setLogoutAnchor] = useState<null | HTMLElement>(null);
  const logoutOpen = Boolean(logoutAnchor);
  const [notifAnchor, setNotifAnchor] = useState<null | HTMLElement>(null);
  const notifOpen = Boolean(notifAnchor);

  useEffect(() => {
    setUnreadCount((prev) => (notices.length > prev ? notices.length : prev));
  }, [notices]);

  useEffect(() => {
    if (localStorage.getItem("locale") === null) {
      localStorage.setItem("locale", "en");
      setLang("en");
    } else {
      setLang(localStorage.getItem("locale"));
    }
  }, [router]);

  useEffect(() => {
    const jwt = getJwtToken();
    if (jwt) updateUserInfo(jwt);
  }, []);

  const langClick = (e: any) => setAnchorEl2(e.currentTarget);
  const langClose = () => setAnchorEl2(null);

  const langChoice = useCallback(
    (locale: string) => {
      setLang(locale);
      localStorage.setItem("locale", locale);
      setAnchorEl2(null);
      router.push(router.asPath, router.asPath, { locale, scroll: false });
    },
    [router],
  );

  const StyledMenu = styled((props: MenuProps) => (
    <Menu
      elevation={0}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      {...props}
    />
  ))(({ theme }) => ({
    "& .MuiPaper-root": {
      top: "109px",
      borderRadius: 8,
      marginTop: theme.spacing(1),
      minWidth: 160,
      background: "#121212",
      border: "1px solid rgba(212,175,55,0.2)",
      color: "#EAEAEA",
      boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
      "& .MuiMenu-list": { padding: "4px 0" },
      "& .MuiMenuItem-root": {
        gap: "10px",
        fontSize: "14px",
        fontFamily: "Nunito, sans-serif",
        color: "#A0A0A0",
        transition: "color 0.2s ease, background 0.2s ease",
        "&:hover": { background: "rgba(212,175,55,0.08)", color: "#D4AF37" },
        "& .MuiSvgIcon-root": { fontSize: 18, marginRight: theme.spacing(1.5) },
        "&:active": {
          backgroundColor: alpha(
            theme.palette.primary.main,
            theme.palette.action.selectedOpacity,
          ),
        },
      },
    },
  }));

  const navLinks = [
    { href: "/", label: t("Home") },
    { href: "/perfume", label: t("Perfumes") },
    { href: "/expert", label: t("Experts") },
    { href: "/community", label: t("Community") },
    ...(user?._id ? [{ href: "/mypage", label: t("My Page") }] : []),
    { href: "/cs", label: t("CS") },
  ];

  if (device === "mobile") {
    return (
      <Stack className={"top"}>
        {navLinks.map((link) => (
          <Link href={link.href} key={link.href}>
            <div>{link.label}</div>
          </Link>
        ))}
      </Stack>
    );
  }

  return (
    <Stack className={"navbar"}>
      <Stack className={"navbar-main scrolled"}>
        <Stack className={"container"}>
          <Box component={"div"} className={"logo-box"}>
            <Link href={"/"}>
              <img src="/img/logo/logoWhite-2.png" alt="Verilium" />
            </Link>
          </Box>

          <Box component={"div"} className={"router-box"}>
            {navLinks.map((link) => (
              <Link href={link.href} key={link.href}>
                <div
                  className={
                    router.pathname === link.href ||
                    (router.pathname.startsWith(link.href) && link.href !== "/")
                      ? "active"
                      : ""
                  }
                >
                  {link.label}
                </div>
              </Link>
            ))}
          </Box>

          <Box component={"div"} className={"user-box"}>
            {user?._id && (
              <>
                <button
                  className={"icon-btn"}
                  aria-label="Notifications"
                  onClick={(e) => {
                    setNotifAnchor(e.currentTarget);
                    setUnreadCount(0);
                  }}
                >
                  <Badge badgeContent={unreadCount || null} color="error" overlap="circular">
                    <NotificationsOutlinedIcon />
                  </Badge>
                </button>

                <Popover
                  open={notifOpen}
                  anchorEl={notifAnchor}
                  onClose={() => setNotifAnchor(null)}
                  anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                  transformOrigin={{ vertical: "top", horizontal: "right" }}
                  PaperProps={{
                    sx: {
                      mt: "10px",
                      width: 340,
                      background: "#121212",
                      border: "1px solid rgba(212,175,55,0.2)",
                      borderRadius: "14px",
                      boxShadow: "0 12px 40px rgba(0,0,0,0.6)",
                      overflow: "hidden",
                    },
                  }}
                >
                  {/* Header */}
                  <Box sx={{ px: 2.5, py: 1.5, borderBottom: "1px solid rgba(212,175,55,0.1)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Typography sx={{ fontFamily: "Nunito, sans-serif", fontSize: 14, fontWeight: 800, color: "#fff" }}>
                      Notices
                    </Typography>
                    <Link href={"/cs?tab=notices"} onClick={() => setNotifAnchor(null)}>
                      <Typography sx={{ fontSize: 12, color: "#D4AF37", cursor: "pointer", "&:hover": { textDecoration: "underline" } }}>
                        View all
                      </Typography>
                    </Link>
                  </Box>

                  {notices.length === 0 ? (
                    <Box sx={{ py: 5, display: "flex", flexDirection: "column", alignItems: "center", gap: 1 }}>
                      <NotificationsOutlinedIcon sx={{ fontSize: 32, color: "rgba(212,175,55,0.3)" }} />
                      <Typography sx={{ fontFamily: "Nunito, sans-serif", fontSize: 13, color: "rgba(255,255,255,0.3)" }}>
                        No notices yet
                      </Typography>
                    </Box>
                  ) : (
                    <Box sx={{ maxHeight: 340, overflowY: "auto" }}>
                      {notices.slice(0, 5).map((notice) => (
                        <Link key={notice._id} href={"/cs?tab=notices"} onClick={() => setNotifAnchor(null)}>
                          <Box sx={{ px: 2.5, py: 1.5, borderBottom: "1px solid rgba(255,255,255,0.05)", cursor: "pointer", "&:hover": { background: "rgba(212,175,55,0.05)" } }}>
                            <Typography sx={{ fontSize: 13, fontWeight: 700, color: "#eaeaea", mb: 0.3 }}>
                              {notice.notificationTitle}
                            </Typography>
                            <Typography sx={{ fontSize: 12, color: "rgba(255,255,255,0.45)", overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>
                              {notice.notificationDesc}
                            </Typography>
                            <Typography sx={{ fontSize: 11, color: "rgba(212,175,55,0.5)", mt: 0.5 }}>
                              {new Date(notice.createdAt).toLocaleDateString()}
                            </Typography>
                          </Box>
                        </Link>
                      ))}
                      <Box sx={{ px: 2.5, py: 1.5, textAlign: "center" }}>
                        <Link href={"/cs?tab=notices"} onClick={() => setNotifAnchor(null)}>
                          <Typography sx={{ fontSize: 12, color: "#D4AF37", cursor: "pointer", "&:hover": { textDecoration: "underline" } }}>
                            See all notices →
                          </Typography>
                        </Link>
                      </Box>
                    </Box>
                  )}
                </Popover>
              </>
            )}

            <div className={"lan-box"}>
              <Button
                disableRipple
                className="btn-lang"
                onClick={langClick}
                endIcon={<CaretDown size={13} color="#A0A0A0" weight="fill" />}
              >
                <Box component={"div"} className={"flag"}>
                  <img src={`/img/flag/lang${lang ?? "en"}.png`} alt={"flag"} />
                </Box>
              </Button>

              <StyledMenu
                anchorEl={anchorEl2}
                open={drop}
                onClose={langClose}
                sx={{ position: "absolute" }}
              >
                <MenuItem disableRipple onClick={() => langChoice("en")}>
                  <img className="img-flag" src={"/img/flag/langen.png"} alt="EN" />
                  {t("English")}
                </MenuItem>
                <MenuItem disableRipple onClick={() => langChoice("kr")}>
                  <img className="img-flag" src={"/img/flag/langkr.png"} alt="KR" />
                  {t("Korean")}
                </MenuItem>
                <MenuItem disableRipple onClick={() => langChoice("ru")}>
                  <img className="img-flag" src={"/img/flag/langru.png"} alt="RU" />
                  {t("Russian")}
                </MenuItem>
              </StyledMenu>
            </div>

            {user?._id ? (
              <>
                <div
                  className={"login-user"}
                  onClick={(e: any) => setLogoutAnchor(e.currentTarget)}
                >
                  <img src={"/img/profile/defaultUser.svg"} alt="avatar" />
                </div>
                <Menu
                  id="logout-menu"
                  anchorEl={logoutAnchor}
                  open={logoutOpen}
                  onClose={() => setLogoutAnchor(null)}
                  sx={{ mt: "5px" }}
                  PaperProps={{
                    sx: {
                      background: "#121212",
                      border: "1px solid rgba(212,175,55,0.2)",
                      borderRadius: "8px",
                      color: "#EAEAEA",
                      minWidth: 140,
                      boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
                    },
                  }}
                >
                  <MenuItem
                    onClick={() => logOut()}
                    sx={{
                      fontFamily: "Nunito, sans-serif",
                      fontSize: "14px",
                      color: "#A0A0A0",
                      gap: "10px",
                      "&:hover": {
                        color: "#D4AF37",
                        background: "rgba(212,175,55,0.08)",
                      },
                    }}
                  >
                    <Logout fontSize="small" />
                    Logout
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <Link href={"/account/join"}>
                <div className={"join-box"}>
                  <AccountCircleOutlinedIcon />
                  <span>
                    {t("Login")} / {t("Register")}
                  </span>
                </div>
              </Link>
            )}
          </Box>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default withRouter(TopBasic);
