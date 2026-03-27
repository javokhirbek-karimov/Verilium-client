import { NextPage } from "next";
import useDeviceDetect from "../libs/hooks/useDeviceDetect";
import withLayoutMain from "../libs/components/layout/layoutHome";
import { Stack } from "@mui/material";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import TrendPerfumes from "../libs/components/homepage/TrendPerfumes";

export const getStaticProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ["common"])),
  },
});

const Home: NextPage = () => {
  const device = useDeviceDetect();

  if (device === "mobile") {
    return (
      <Stack className={"home-page"}>
        <TrendPerfumes />
      </Stack>
    );
  } else {
    return (
      <Stack className={"home-page"}>
        <TrendPerfumes />
      </Stack>
    );
  }
};

export default withLayoutMain(Home);
