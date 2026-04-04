import React from "react";
import { Stack, Typography } from "@mui/material";
import useDeviceDetect from "../../hooks/useDeviceDetect";

const notices = [
  {
    no: 1,
    event: true,
    title: "Register to use and get exclusive discounts on premium fragrances",
    date: "01.03.2024",
  },
  {
    no: 2,
    event: false,
    title: "It's absolutely free to list and trade perfumes on Verilium",
    date: "31.03.2024",
  },
  {
    no: 3,
    event: false,
    title: "New collection arrivals: Spring/Summer 2024 fragrance lineup",
    date: "15.04.2024",
  },
  {
    no: 4,
    event: false,
    title: "Updated shipping policy: free delivery on orders over $80",
    date: "20.04.2024",
  },
];

const Notice = () => {
  const device = useDeviceDetect();

  if (device === "mobile") return <div>NOTICE MOBILE</div>;

  return (
    <Stack className="notice-content">
      {/* Header row */}
      <Stack direction="row" className="notice-header">
        <Typography className="col-no">No.</Typography>
        <Typography className="col-title">Title</Typography>
        <Typography className="col-date">Date</Typography>
      </Stack>

      {/* Rows */}
      <Stack className="notice-list">
        {notices.map((item) => (
          <Stack direction="row" key={item.no} className={`notice-row ${item.event ? "event" : ""}`}>
            <span className="col-no">
              {item.event ? <span className="event-badge">Event</span> : item.no}
            </span>
            <Typography className="col-title">{item.title}</Typography>
            <Typography className="col-date">{item.date}</Typography>
          </Stack>
        ))}
      </Stack>
    </Stack>
  );
};

export default Notice;
