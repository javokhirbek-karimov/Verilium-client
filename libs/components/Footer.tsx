import FacebookOutlinedIcon from "@mui/icons-material/FacebookOutlined";
import InstagramIcon from "@mui/icons-material/Instagram";
import TelegramIcon from "@mui/icons-material/Telegram";
import TwitterIcon from "@mui/icons-material/Twitter";
import useDeviceDetect from "../hooks/useDeviceDetect";
import { Stack, Box } from "@mui/material";
import moment from "moment";
import { useTranslation } from "next-i18next";

const Footer = () => {
  const device = useDeviceDetect();
  const { t } = useTranslation("common");

  if (device == "mobile") {
    return (
      <Stack className={"footer-container"}>
        <Stack className={"main"}>
          <Stack className={"left"}>
            <Box component={"div"} className={"footer-box"}>
              <img
                src="/img/logo/logoWhite.svg"
                alt="Verilium"
                className={"logo"}
              />
              <p className={"brand-tagline"}>{t("The Art of Scent")}</p>
            </Box>

            <Box component={"div"} className={"footer-box"}>
              <span>{t("Customer Care")}</span>
              <p>+82 10 7494 7510</p>
            </Box>

            <Box component={"div"} className={"footer-box"}>
              <span>{t("Live Support")}</span>
              <p>+998 93 707 7510</p>
              <span className={"support-note"}>{t("Available 24/7")}</span>
            </Box>

            <Box component={"div"} className={"footer-box"}>
              <p>{t("Follow us")}</p>
              <div className={"media-box"}>
                <a
                  href="https://www.facebook.com"
                  target="_blank"
                  rel="noreferrer"
                  className={"media-icon"}
                >
                  <FacebookOutlinedIcon />
                </a>
                <a
                  href="https://t.me/javoxir_karimov"
                  target="_blank"
                  rel="noreferrer"
                  className={"media-icon"}
                >
                  <TelegramIcon />
                </a>
                <a
                  href="https://www.instagram.com/javoxir__karimov"
                  target="_blank"
                  rel="noreferrer"
                  className={"media-icon"}
                >
                  <InstagramIcon />
                </a>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noreferrer"
                  className={"media-icon"}
                >
                  <TwitterIcon />
                </a>
              </div>
            </Box>
          </Stack>

          <Stack className={"right"}>
            <Box component={"div"} className={"bottom"}>
              <div>
                <strong>{t("Collections")}</strong>
                <span>{t("Eau de Parfum")}</span>
                <span>{t("Eau de Toilette")}</span>
                <span>{t("Limited Edition")}</span>
              </div>
              <div>
                <strong>{t("Quick Links")}</strong>
                <span>{t("Terms of Use")}</span>
                <span>{t("Privacy Policy")}</span>
                <span>{t("Pricing Plans")}</span>
                <span>{t("Our Services")}</span>
                <span>{t("Contact Support")}</span>
                <span>{t("FAQs")}</span>
              </div>
              <div>
                <strong>{t("Scents")}</strong>
                <span>{t("Floral")}</span>
                <span>{t("Woody")}</span>
                <span>{t("Oriental")}</span>
                <span>{t("Fresh")}</span>
              </div>
            </Box>
          </Stack>
        </Stack>

        <Stack className={"second"}>
          <span>
            © Verilium Perfume — All rights reserved {moment().year()}
          </span>
        </Stack>
      </Stack>
    );
  } else {
    return (
      <Stack className={"footer-container"}>
        <Stack className={"main"}>
          <Stack className={"left"}>
            <Box component={"div"} className={"footer-box"}>
              <img
                src="/img/logo/logoWhite-2.png"
                alt="Verilium"
                className={"logo"}
              />
              <p className={"brand-tagline"}>{t("The Art of Scent")}</p>
            </Box>

            <Box component={"div"} className={"footer-box"}>
              <span>{t("Customer Care")}</span>
              <p>+82 10 7494 7510</p>
            </Box>

            <Box component={"div"} className={"footer-box"}>
              <span>{t("Live Support")}</span>
              <p>+998 93 707 7510</p>
              <span className={"support-note"}>{t("Available 24/7")}</span>
            </Box>

            <Box component={"div"} className={"footer-box"}>
              <p>{t("Follow us")}</p>
              <div className={"media-box"}>
                <a
                  href="https://www.facebook.com"
                  target="_blank"
                  rel="noreferrer"
                  className={"media-icon"}
                >
                  <FacebookOutlinedIcon />
                </a>
                <a
                  href="https://t.me/javoxir_karimov"
                  target="_blank"
                  rel="noreferrer"
                  className={"media-icon"}
                >
                  <TelegramIcon />
                </a>
                <a
                  href="https://www.instagram.com/javoxir__karimov"
                  target="_blank"
                  rel="noreferrer"
                  className={"media-icon"}
                >
                  <InstagramIcon />
                </a>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noreferrer"
                  className={"media-icon"}
                >
                  <TwitterIcon />
                </a>
              </div>
            </Box>
          </Stack>

          <Stack className={"right"}>
            <Box component={"div"} className={"top"}>
              <strong>{t("Stay in the loop")}</strong>
              <p>{t("Get exclusive drops, new arrivals & offers")}</p>
              <div className={"subscribe-box"}>
                <input type="email" placeholder={t("Your Email Address")} />
                <button>{t("Subscribe")}</button>
              </div>
            </Box>

            <Box component={"div"} className={"bottom"}>
              <div>
                <strong>{t("Collections")}</strong>
                <span>{t("Eau de Parfum")}</span>
                <span>{t("Eau de Toilette")}</span>
                <span>{t("Limited Edition")}</span>
              </div>
              <div>
                <strong>{t("Quick Links")}</strong>
                <span>{t("Terms of Use")}</span>
                <span>{t("Privacy Policy")}</span>
                <span>{t("Pricing Plans")}</span>
                <span>{t("Our Services")}</span>
                <span>{t("Contact Support")}</span>
                <span>{t("FAQs")}</span>
              </div>
              <div>
                <strong>{t("Scents")}</strong>
                <span>{t("Floral")}</span>
                <span>{t("Woody")}</span>
                <span>{t("Oriental")}</span>
                <span>{t("Fresh")}</span>
              </div>
            </Box>
          </Stack>
        </Stack>

        <Stack className={"second"}>
          <span>
            © Verilium Perfume — All rights reserved {moment().year()}
          </span>
          <span>{t("Privacy · Terms · Sitemap")}</span>
        </Stack>
      </Stack>
    );
  }
};

export default Footer;
