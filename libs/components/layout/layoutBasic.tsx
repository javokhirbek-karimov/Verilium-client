import React, { useEffect } from "react";
import useDeviceDetect from "../../hooks/useDeviceDetect";
import Head from "next/head";
import TopBasic from "../TopBasic";
import Footer from "../Footer";
import { Stack } from "@mui/material";
import { userVar } from "../../../apollo/store";
import { useReactiveVar } from "@apollo/client";
import { getJwtToken, updateUserInfo } from "../../auth/index";
import Chat from "../Chat";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import Cursor from "../Cursor";
import { useNotificationSubscription } from "../../hooks/useNotificationSubscription";

const withLayoutBasic = (Component: any) => {
  return (props: any) => {
    const device = useDeviceDetect();
    const user = useReactiveVar(userVar);

    useNotificationSubscription();

    useEffect(() => {
      const jwt = getJwtToken();
      if (jwt) updateUserInfo(jwt);
    }, []);

    if (device === "mobile") {
      return (
        <>
          <Head>
            <title>Verilium</title>
            <meta name={"title"} content={"Verilium"} />
          </Head>
          <Stack id="mobile-wrap">
            <Stack id={"top"}>
              <TopBasic />
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
            <TopBasic />
          </Stack>
          <Stack id={"main"}>
            <Component {...props} />
          </Stack>
          {user?._id && <Chat />}
          <Stack id={"footer"}>
            <Footer />
          </Stack>
        </Stack>
      </>
    );
  };
};

export default withLayoutBasic;
