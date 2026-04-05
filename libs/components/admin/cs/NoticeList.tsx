import React from "react";
import {
  TableCell,
  TableHead,
  TableBody,
  TableRow,
  Table,
  TableContainer,
} from "@mui/material";
import Typography from "@mui/material/Typography";
import { Stack } from "@mui/material";
import { Notification } from "../../../types/cs/notification";
import { NotificationStatus, NotificationType } from "../../../enums/notification.enum";

const headCells = [
  { id: "id",      label: "ID",          numeric: true  },
  { id: "type",    label: "TYPE",        numeric: true  },
  { id: "title",   label: "TITLE",       numeric: true  },
  { id: "desc",    label: "DESCRIPTION", numeric: false },
  { id: "status",  label: "STATUS",      numeric: false },
  { id: "date",    label: "DATE",        numeric: false },
];

function NoticeTableHead() {
  return (
    <TableHead>
      <TableRow>
        {headCells.map((cell) => (
          <TableCell key={cell.id} align={cell.numeric ? "left" : "center"}>
            {cell.label}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

interface NoticePanelListType {
  notices: Notification[];
}

export const NoticePanelList = ({ notices }: NoticePanelListType) => {
  return (
    <Stack>
      <TableContainer>
        <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle" size={"medium"}>
          <NoticeTableHead />
          <TableBody>
            {(!notices || notices.length === 0) && (
              <TableRow>
                <TableCell align="center" colSpan={6}>
                  <span className={"no-data"}>No notices found</span>
                </TableCell>
              </TableRow>
            )}

            {notices?.map((n: Notification) => (
              <TableRow hover key={n._id} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                <TableCell align="left" sx={{ maxWidth: 160 }}>
                  <Typography noWrap sx={{ fontSize: 12, color: "#94a3b8", maxWidth: 140 }} title={n._id}>
                    {n._id}
                  </Typography>
                </TableCell>

                <TableCell align="left">
                  <span className={`badge ${n.notificationType === NotificationType.NOTICE ? "success" : "warning"}`}>
                    {n.notificationType}
                  </span>
                </TableCell>

                <TableCell align="left" sx={{ maxWidth: 220 }}>
                  <Typography noWrap sx={{ fontSize: 14, maxWidth: 200 }} title={n.notificationTitle}>
                    {n.notificationTitle}
                  </Typography>
                </TableCell>

                <TableCell align="center" sx={{ maxWidth: 280 }}>
                  <Typography noWrap sx={{ fontSize: 13, maxWidth: 260, color: "#64748b" }} title={n.notificationDesc}>
                    {n.notificationDesc ?? "-"}
                  </Typography>
                </TableCell>

                <TableCell align="center">
                  <span className={`badge ${n.notificationStatus === NotificationStatus.READ ? "success" : "warning"}`}>
                    {n.notificationStatus}
                  </span>
                </TableCell>

                <TableCell align="center">
                  <Typography sx={{ fontSize: 13, color: "#64748b" }}>
                    {new Date(n.createdAt).toLocaleDateString()}
                  </Typography>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Stack>
  );
};
