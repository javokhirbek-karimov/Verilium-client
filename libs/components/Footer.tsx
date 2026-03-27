import FacebookOutlinedIcon from "@mui/icons-material/FacebookOutlined";
import InstagramIcon from "@mui/icons-material/Instagram";
import TelegramIcon from "@mui/icons-material/Telegram";
import TwitterIcon from "@mui/icons-material/Twitter";
import useDeviceDetect from "../hooks/useDeviceDetect";
import { Stack, Box } from "@mui/material";
import moment from "moment";

const Footer = () => {
  const device = useDeviceDetect();

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
              <p className={"brand-tagline"}>The Art of Scent</p>
            </Box>

            <Box component={"div"} className={"footer-box"}>
              <span>Customer Care</span>
              <p>+82 10 7494 7510</p>
            </Box>

            <Box component={"div"} className={"footer-box"}>
              <span>Live Support</span>
              <p>+998 93 707 7510</p>
              <span className={"support-note"}>Available 24/7</span>
            </Box>

            <Box component={"div"} className={"footer-box"}>
              <p>Follow us</p>
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
                <strong>Collections</strong>
                <span>Eau de Parfum</span>
                <span>Eau de Toilette</span>
                <span>Limited Edition</span>
              </div>
              <div>
                <strong>Quick Links</strong>
                <span>Terms of Use</span>
                <span>Privacy Policy</span>
                <span>Pricing Plans</span>
                <span>Our Services</span>
                <span>Contact Support</span>
                <span>FAQs</span>
              </div>
              <div>
                <strong>Scents</strong>
                <span>Floral</span>
                <span>Woody</span>
                <span>Oriental</span>
                <span>Fresh</span>
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
              <p className={"brand-tagline"}>The Art of Scent</p>
            </Box>

            <Box component={"div"} className={"footer-box"}>
              <span>Customer Care</span>
              <p>+82 10 7494 7510</p>
            </Box>

            <Box component={"div"} className={"footer-box"}>
              <span>Live Support</span>
              <p>+998 93 707 7510</p>
              <span className={"support-note"}>Available 24/7</span>
            </Box>

            <Box component={"div"} className={"footer-box"}>
              <p>Follow us</p>
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
              <strong>Stay in the loop</strong>
              <p>Get exclusive drops, new arrivals & offers</p>
              <div className={"subscribe-box"}>
                <input type="email" placeholder={"Your Email Address"} />
                <button>Subscribe</button>
              </div>
            </Box>

            <Box component={"div"} className={"bottom"}>
              <div>
                <strong>Collections</strong>
                <span>Eau de Parfum</span>
                <span>Eau de Toilette</span>
                <span>Limited Edition</span>
              </div>
              <div>
                <strong>Quick Links</strong>
                <span>Terms of Use</span>
                <span>Privacy Policy</span>
                <span>Pricing Plans</span>
                <span>Our Services</span>
                <span>Contact Support</span>
                <span>FAQs</span>
              </div>
              <div>
                <strong>Scents</strong>
                <span>Floral</span>
                <span>Woody</span>
                <span>Oriental</span>
                <span>Fresh</span>
              </div>
            </Box>
          </Stack>
        </Stack>

        <Stack className={"second"}>
          <span>
            © Verilium Perfume — All rights reserved {moment().year()}
          </span>
          <span>Privacy · Terms · Sitemap</span>
        </Stack>
      </Stack>
    );
  }
};

export default Footer;
