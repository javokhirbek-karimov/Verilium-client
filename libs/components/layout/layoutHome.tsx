import React, { useEffect, useState } from "react";
import useDeviceDetect from "../../hooks/useDeviceDetect";
import Head from "next/head";
import Top from "../Top";
import Footer from "../Footer";
import { Stack } from "@mui/material";
import { userVar } from "../../../apollo/store";
import { useReactiveVar } from "@apollo/client";
import { getJwtToken, updateUserInfo } from "../../auth";
import Chat from "../Chat";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { AnimatePresence, motion } from "framer-motion";
import Intro from "../Intro";
import Link from "next/link";
import Cursor from "../Cursor";

const INTRO_DURATION = 3000;

const withLayoutMain = (Component: any) => {
  return (props: any) => {
    const device = useDeviceDetect();
    const user = useReactiveVar(userVar);
    const [showIntro, setShowIntro] = useState(true);

    useEffect(() => {
      const jwt = getJwtToken();
      if (jwt) updateUserInfo(jwt);
    }, []);

    if (device == "mobile") {
      return (
        <>
          <Head>
            <title>Verilium</title>
            <meta name={"title"} content={"Verilium"} />
          </Head>
          <Stack id="mobile-wrap">
            <Stack id={"top"}>
              <Top />
            </Stack>
            <Stack id={"main"}>
              <Component {...props} />
            </Stack>
            <Stack id={"footer"}>
              <Footer />
            </Stack>
          </Stack>
        </>
      );
    }

    return (
      <>
        <Head>
          <title>Verilium - The Art of Scent</title>
          <meta name={"title"} content={"Verilium"} />
        </Head>
        <Stack id="pc-wrap">
          <Cursor />
          <Stack id={"top"}>
            <Top />
          </Stack>

          <Stack className={"header-main"} >
            {/* Background video */}
            <video
              autoPlay
              muted
              loop
              playsInline
              className="bg-video"
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: "center 20%",
                zIndex: 0,
              }}
            >
              <source src="/img/banner/header1.MOV" type="video/mp4" />
            </video>

            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(to bottom, rgba(11,11,11,0.45) 0%, rgba(11,11,11,0.3) 50%, rgba(11,11,11,0.7) 100%)",
                zIndex: 1,
              }}
            />

            <Stack
              className={"container"}
              style={{
                position: "relative",
                zIndex: 2,
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "flex-start",
                height: "100%",
                paddingTop: "88px",
                gap: "24px",
              }}
            >
              <motion.h1
                initial={{ opacity: 0, x: -80 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  duration: 1.0,
                  ease: [0.22, 1, 0.36, 1],
                  delay: INTRO_DURATION / 1000 + 0.4,
                }}
                style={{
                  fontFamily: '"Nunito", sans-serif',
                  fontSize: "58px",
                  fontWeight: 700,
                  lineHeight: 1.1,
                  letterSpacing: "-0.5px",
                  textTransform: "uppercase",
                  color: "#EAEAEA",
                  maxWidth: "720px",
                  margin: 0,
                }}
              >
                Elevate Your Spirit{" "}
                <span
                  style={{
                    background:
                      "linear-gradient(90deg, #D4AF37, #F5D76E, #D4AF37)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  With Victory
                </span>{" "}
                Scented Fragrances
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, x: -60 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  duration: 1.4,
                  ease: [0.22, 1, 0.36, 1],
                  delay: INTRO_DURATION / 1000 + 0.8,
                }}
                style={{
                  fontFamily: '"Nunito", sans-serif',
                  fontSize: "17px",
                  fontWeight: 400,
                  color: "rgba(234, 234, 234, 0.75)",
                  maxWidth: "520px",
                  lineHeight: 1.65,
                  margin: 0,
                }}
              >
                Shop now and embrace the sweet smell of victory with Verilium
              </motion.p>

              <motion.div
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  duration: 0.9,
                  ease: [0.22, 1, 0.36, 1],
                  delay: INTRO_DURATION / 1000 + 1.0,
                }}
              >
                <Link href="/perfume">
                  <div
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "10px",
                      padding: "14px 36px",
                      borderRadius: "50px",
                      background: "linear-gradient(135deg, #D4AF37, #A67C00)",
                      fontFamily: '"Nunito", sans-serif',
                      fontSize: "15px",
                      fontWeight: 700,
                      color: "#0B0B0B",
                      letterSpacing: "0.5px",
                      cursor: "pointer",
                      boxShadow: "0 8px 28px rgba(212, 175, 55, 0.4)",
                      transition: "transform 0.3s ease, box-shadow 0.3s ease",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.transform =
                        "translateY(-3px)";
                      (e.currentTarget as HTMLElement).style.boxShadow =
                        "0 14px 40px rgba(212, 175, 55, 0.55)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.transform =
                        "translateY(0)";
                      (e.currentTarget as HTMLElement).style.boxShadow =
                        "0 8px 28px rgba(212, 175, 55, 0.4)";
                    }}
                  >
                    Shop Now →
                  </div>
                </Link>
              </motion.div>
            </Stack>
          </Stack>

          <Stack id={"main"}>
            <Component {...props} />
          </Stack>

          {user?._id && <Chat />}

          <Stack id={"footer"}>
            <Footer />
          </Stack>

          <AnimatePresence>
            {showIntro && <Intro onFinish={() => setShowIntro(false)} />}
          </AnimatePresence>
        </Stack>
      </>
    );
  };
};

export default withLayoutMain;
