import React from "react";
import { NextPage } from "next";
import useDeviceDetect from "../../hooks/useDeviceDetect";
import dynamic from "next/dynamic";
import EditNoteIcon from "@mui/icons-material/EditNote";

const TuiEditor = dynamic(() => import("../community/Teditor"), { ssr: false });

const WriteArticle: NextPage = () => {
  const device = useDeviceDetect();

  if (device === "mobile") return <>WRITE ARTICLE MOBILE</>;

  return (
    <div id="write-article-page">
      {/* ── Page header ─────────────────────────────────── */}
      <div className="wa-header">
        <div className="wa-header-left">
          <div className="wa-badge">
            <EditNoteIcon sx={{ fontSize: 18 }} />
            <span>Write</span>
          </div>
          <h1 className="wa-title">Create Article</h1>
          <p className="wa-desc">
            Share your knowledge, reviews, and stories with the Verilium
            community
          </p>
        </div>
        <div className="wa-header-right">
          <div className="wa-stat">
            <span className="wa-stat-val">4</span>
            <span className="wa-stat-lbl">Categories</span>
          </div>
        </div>
      </div>

      {/* ── Editor card ─────────────────────────────────── */}
      <div className="wa-card">
        <TuiEditor />
      </div>
    </div>
  );
};

export default WriteArticle;
