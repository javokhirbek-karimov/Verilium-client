import React from "react";
import { useTranslation } from "next-i18next";
import { NextPage } from "next";
import { Stack, Typography, Button } from "@mui/material";
import { useRouter } from "next/router";
import useDeviceDetect from "../../libs/hooks/useDeviceDetect";
import withLayoutBasic from "../../libs/components/layout/layoutBasic";
import Faq from "../../libs/components/cs/Faq";
import Notices from "../../libs/components/cs/Notices";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

export const getStaticProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ["common"])),
  },
});

const CS: NextPage = () => {
  const { t } = useTranslation("common");
  const device = useDeviceDetect();
  const router = useRouter();
  const tab = (router.query?.tab as string) ?? "faq";

  const setTab = (value: string) => {
    router.push({ pathname: "/cs", query: { tab: value } }, undefined, { shallow: true });
  };

  if (device === "mobile") {
    return (
      <div id="cs-page-mobile">
        {/* Hero */}
        <div className="mob-cs-hero">
          <div className="mob-cs-hero-overlay" />
          <div className="mob-cs-hero-content">
            <span className="mob-cs-hero-label">{t("Support")}</span>
            <h1 className="mob-cs-hero-title">
              {t("Customer")} <span>{t("Center")}</span>
            </h1>
          </div>
        </div>

        {/* Tab switcher */}
        <div className="mob-cs-tabs">
          <button
            className={`mob-cs-tab${tab === "faq" ? " active" : ""}`}
            onClick={() => setTab("faq")}
          >
            {t("FAQ")}
          </button>
          <button
            className={`mob-cs-tab${tab === "notices" ? " active" : ""}`}
            onClick={() => setTab("notices")}
          >
            {t("Notices")}
          </button>
        </div>

        {/* Content */}
        <div className="mob-cs-content">
          {tab === "faq" && <Faq />}
          {tab === "notices" && <Notices />}
        </div>
      </div>
    );
  }

  return (
    <Stack id="cs-page">
      {/* ── Hero ─────────────────────────────────────────────── */}
      <Stack className="hero-section">
        <Stack className="hero-content">
          <Typography className="hero-label">{t("Support")}</Typography>
          <Typography className="hero-title">
            {t("Customer")} <span>{t("Center")}</span>
          </Typography>
          <Typography className="hero-sub">
            {t("Find answers to your questions about fragrances, orders, and more")}
          </Typography>
        </Stack>
      </Stack>

      {/* ── Tabs ─────────────────────────────────────────────── */}
      <Stack className="cs-content">
        <Stack direction={"row"} className={"cs-tabs"} gap={1} mb={3}>
          <Button
            className={`cs-tab-btn${tab === "faq" ? " active" : ""}`}
            onClick={() => setTab("faq")}
            disableRipple
          >
            {t("FAQ")}
          </Button>
          <Button
            className={`cs-tab-btn${tab === "notices" ? " active" : ""}`}
            onClick={() => setTab("notices")}
            disableRipple
          >
            {t("Notices")}
          </Button>
        </Stack>

        {tab === "faq" && <Faq />}
        {tab === "notices" && <Notices />}
      </Stack>
    </Stack>
  );
};

export default withLayoutBasic(CS);
