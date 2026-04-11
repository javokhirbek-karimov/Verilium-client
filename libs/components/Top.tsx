import React, { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useRouter, withRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { getJwtToken, logOut, updateUserInfo } from "../auth";
import { Stack, Box } from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import { alpha, styled } from "@mui/material/styles";
import Menu, { MenuProps } from "@mui/material/Menu";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import { CaretDown } from "phosphor-react";
import { Logout } from "@mui/icons-material";
import useDeviceDetect from "../hooks/useDeviceDetect";
import Link from "next/link";
import { useReactiveVar } from "@apollo/client/react";
import { userVar } from "../../apollo/store";
import { REACT_APP_API_URL } from "../config";

const INTRO_DURATION = 2500;

const Top = () => {
  const device = useDeviceDetect();
  const user = useReactiveVar(userVar);
  const { t } = useTranslation("common");
  const router = useRouter();
  const isHome = router.pathname === "/";

  const slideDown = {
    hidden: { opacity: 0, y: -24 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.55,
        ease: [0.22, 1, 0.36, 1],
        delay: isHome ? INTRO_DURATION / 1000 + i * 0.08 : i * 0.06,
      },
    }),
  };

  const [anchorEl2, setAnchorEl2] = useState<null | HTMLElement>(null);
  const [lang, setLang] = useState<string | null>("en");
  const drop = Boolean(anchorEl2);
  const [scrolled, setScrolled] = useState(false);
  const [bgColor, setBgColor] = useState<boolean>(false);
  const [logoutAnchor, setLogoutAnchor] = useState<null | HTMLElement>(null);
  const logoutOpen = Boolean(logoutAnchor);

  useEffect(() => {
    if (localStorage.getItem("locale") === null) {
      localStorage.setItem("locale", "en");
      setLang("en");
    } else {
      setLang(localStorage.getItem("locale"));
    }
  }, [router]);

  useEffect(() => {
    setBgColor(router.pathname !== "/");
  }, [router]);

  useEffect(() => {
    const jwt = getJwtToken();
    if (jwt) updateUserInfo(jwt);
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY >= 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
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
    { href: "/community?articleCategory=FREE", label: t("Community") },
    ...(user?._id ? [{ href: "/mypage", label: t("My Page") }] : []),
    { href: "/cs", label: t("CS") },
  ];

  const avatarSrc =
    user?.memberImage && user.memberImage.trim() !== ""
      ? user.memberImage.startsWith("http")
        ? user.memberImage
        : `${REACT_APP_API_URL}/${user.memberImage}`
      : "/img/profile/defaultUser.svg";

  console.log(user?.memberImage);

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
      <Stack className={`navbar-main ${scrolled || bgColor ? "scrolled" : ""}`}>
        <Stack className={"container"}>
          <Box component={"div"} className={"logo-box"}>
            <Link href={"/"}>
              <motion.img
                src="/img/logo/logoWhite-2.png"
                alt="Verilium"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{
                  duration: 0.01,
                  delay: INTRO_DURATION / 1000 + 0.05,
                }}
              />
            </Link>
          </Box>

          <Box component={"div"} className={"router-box"}>
            {navLinks.map((link, i) => (
              <motion.div
                key={link.href}
                custom={i}
                variants={slideDown}
                initial="hidden"
                animate="visible"
              >
                <Link href={link.href}>
                  <div
                    className={
                      router.pathname === link.href ||
                      (router.pathname.startsWith(link.href) &&
                        link.href !== "/")
                        ? "active"
                        : ""
                    }
                  >
                    {link.label}
                  </div>
                </Link>
              </motion.div>
            ))}
          </Box>

          <Box component={"div"} className={"user-box"}>
            {user?._id && (
              <motion.div
                custom={navLinks.length}
                variants={slideDown}
                initial="hidden"
                animate="visible"
              >
                <button className={"icon-btn"} aria-label="Notifications">
                  <NotificationsOutlinedIcon />
                  <span className={"notif-dot"} />
                </button>
              </motion.div>
            )}

            <motion.div
              custom={navLinks.length + 1}
              variants={slideDown}
              initial="hidden"
              animate="visible"
              className={"lan-box"}
            >
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
                  <img
                    className="img-flag"
                    src={"/img/flag/langen.png"}
                    alt="EN"
                  />
                  {t("English")}
                </MenuItem>
                <MenuItem disableRipple onClick={() => langChoice("kr")}>
                  <img
                    className="img-flag"
                    src={"/img/flag/langkr.png"}
                    alt="KR"
                  />
                  {t("Korean")}
                </MenuItem>
                <MenuItem disableRipple onClick={() => langChoice("ru")}>
                  <img
                    className="img-flag"
                    src={"/img/flag/langru.png"}
                    alt="RU"
                  />
                  {t("Russian")}
                </MenuItem>
              </StyledMenu>
            </motion.div>

            {/* Login / Avatar */}
            <motion.div
              custom={navLinks.length + 2}
              variants={slideDown}
              initial="hidden"
              animate="visible"
            >
              {user?._id ? (
                <>
                  <div
                    className={"login-user"}
                    onClick={(e: any) => setLogoutAnchor(e.currentTarget)}
                  >
                    <img src={avatarSrc} alt="avatar" />
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
            </motion.div>
          </Box>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default withRouter(Top);
