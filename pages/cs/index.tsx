import React from "react";
import { NextPage } from "next";
import { Stack, Typography } from "@mui/material";
import useDeviceDetect from "../../libs/hooks/useDeviceDetect";
import withLayoutBasic from "../../libs/components/layout/layoutBasic";
import Faq from "../../libs/components/cs/Faq";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

export const getStaticProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ["common"])),
  },
});

const CS: NextPage = () => {
  const device = useDeviceDetect();

  if (device === "mobile") return <h1>CS PAGE MOBILE</h1>;

  return (
    <Stack id="cs-page">
      {/* ── Hero ─────────────────────────────────────────────── */}
      <Stack className="hero-section">
        <Stack className="hero-content">
          <Typography className="hero-label">Support</Typography>
          <Typography className="hero-title">
            Customer <span>Center</span>
          </Typography>
          <Typography className="hero-sub">
            Find answers to your questions about fragrances, orders, and more
          </Typography>
        </Stack>
      </Stack>

      {/* ── FAQ Content ──────────────────────────────────────── */}
      <Stack className="cs-content">
        <Faq />
      </Stack>
    </Stack>
  );
};

export default withLayoutBasic(CS);
