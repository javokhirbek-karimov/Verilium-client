import React from "react";
import { Stack, Typography } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import ModeIcon from "@mui/icons-material/Mode";
import DeleteIcon from "@mui/icons-material/Delete";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import { Perfume } from "../../types/perfume/perfume";
import { REACT_APP_API_URL } from "../../config";
import { formatterStr } from "../../utils";
import Moment from "react-moment";
import { useRouter } from "next/router";
import { PerfumeStatus } from "../../enums/perfume.enum";
import useDeviceDetect from "../../hooks/useDeviceDetect";

interface PerfumeCardProps {
  perfume: Perfume;
  deletePerfumeHandler?: (id: string) => void;
  updatePerfumeHandler?: (status: string, id: string) => void;
  memberPage?: boolean;
}

export const PerfumeCard = ({
  perfume,
  deletePerfumeHandler,
  memberPage,
}: PerfumeCardProps) => {
  const device = useDeviceDetect();
  const router = useRouter();

  const imageSrc = perfume?.perfumeImages?.[0]
    ? `${REACT_APP_API_URL}/${perfume.perfumeImages[0]}`
    : "/img/fiber/img1.jpg";

  const pushEditPerfume = () => {
    router.push({
      pathname: "/mypage",
      query: { category: "addPerfume", perfumeId: perfume._id },
    });
  };

  const pushPerfumeDetail = () => {
    if (memberPage)
      router.push({
        pathname: "/perfume/detail",
        query: { perfumeId: perfume._id },
      });
  };

  const statusColor = () => {
    switch (perfume.perfumeStatus) {
      case PerfumeStatus.ACTIVE:
        return { bg: "rgba(212,175,55,0.12)", text: "var(--gold-primary)" };
      case PerfumeStatus.SOLDOUT:
        return { bg: "rgba(255,165,0,0.12)", text: "#ffa500" };
      case PerfumeStatus.DELETED:
        return { bg: "rgba(192,57,43,0.12)", text: "#c0392b" };
      default:
        return { bg: "rgba(255,255,255,0.06)", text: "var(--text-secondary)" };
    }
  };

  if (device === "mobile") return <div>MOBILE PERFUME CARD</div>;

  const { bg, text } = statusColor();

  return (
    <Stack className="perfume-card-row">
      {/* Thumbnail + info */}
      <Stack
        className="info-col"
        onClick={pushPerfumeDetail}
        sx={{ cursor: memberPage ? "pointer" : "default" }}
      >
        <Stack className="thumb">
          <img
            src={imageSrc}
            alt=""
            onError={(e) => {
              e.currentTarget.src = "/img/fiber/img1.jpg";
            }}
          />
        </Stack>
        <Stack className="text-wrap">
          <Typography className="perfume-title">{perfume.perfumeTitle}</Typography>
          <Typography className="perfume-brand">{perfume.perfumeBrand}</Typography>
          <Typography className="perfume-price">
            ${formatterStr(perfume.perfumePrice)}
          </Typography>
        </Stack>
      </Stack>

      {/* Date */}
      <Stack className="date-col">
        <Typography className="date-text">
          <Moment format="DD MMM, YYYY">{perfume.createdAt}</Moment>
        </Typography>
      </Stack>

      {/* Status */}
      <Stack className="status-col">
        <Stack
          className="status-badge"
          sx={{ background: bg }}
        >
          <Typography sx={{ color: text }}>{perfume.perfumeStatus}</Typography>
        </Stack>
      </Stack>

      {/* Views */}
      <Stack className="views-col">
        <RemoveRedEyeIcon className="eye-icon" />
        <Typography className="views-text">
          {perfume.perfumeViews?.toLocaleString() ?? 0}
        </Typography>
      </Stack>

      {/* Actions */}
      {!memberPage && perfume.perfumeStatus === PerfumeStatus.ACTIVE && (
        <Stack className="action-col">
          <IconButton className="action-btn edit" onClick={pushEditPerfume}>
            <ModeIcon fontSize="small" />
          </IconButton>
          <IconButton
            className="action-btn delete"
            onClick={() => deletePerfumeHandler?.(perfume._id)}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Stack>
      )}
    </Stack>
  );
};
