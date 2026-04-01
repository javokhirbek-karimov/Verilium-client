import { NextPage } from "next";
import useDeviceDetect from "../libs/hooks/useDeviceDetect";
import withLayoutMain from "../libs/components/layout/layoutHome";
import { Stack } from "@mui/material";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import TrendPerfumes from "../libs/components/homepage/TrendPerfumes";
import TopPerfumes from "../libs/components/homepage/TopPerfumes";
import TopExperts from "../libs/components/homepage/TopExperts";
import TopArticles from "../libs/components/homepage/TopArticles";

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
        <TopPerfumes />
        <TopExperts />
        <TopArticles />
      </Stack>
    );
  } else {
    return (
      <Stack className={"home-page"}>
        <TrendPerfumes />
        <TopPerfumes />
        <TopExperts />
        <TopArticles />
      </Stack>
    );
  }
};

export default withLayoutMain(Home);
