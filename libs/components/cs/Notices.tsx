import React, { useEffect, useState } from "react";
import { useTranslation } from "next-i18next";
import { Stack, Typography, Box } from "@mui/material";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import { useQuery, useReactiveVar } from "@apollo/client";
import { GET_NOTIFICATIONS } from "../../../apollo/user/query";
import { notificationsVar, userVar } from "../../../apollo/store";
import { Notification } from "../../types/cs/notification";

const Notices = () => {
  const { t } = useTranslation("common");
  const user = useReactiveVar(userVar);
  const liveNotifications = useReactiveVar(notificationsVar);
  const [allNotifications, setAllNotifications] = useState<Notification[]>([]);

  const { data } = useQuery(GET_NOTIFICATIONS, {
    fetchPolicy: "network-only",
    skip: !user?._id,
    variables: { input: { page: 1, limit: 20, search: {} } },
  });

  useEffect(() => {
    const fetched: Notification[] = data?.getNotifications?.list ?? [];
    const ids = new Set(fetched.map((n) => n._id));
    const merged = [
      ...liveNotifications.filter((n) => !ids.has(n._id)),
      ...fetched,
    ];
    setAllNotifications(merged);
  }, [data, liveNotifications]);

  if (allNotifications.length === 0) {
    return (
      <Stack className={"notices-empty"} alignItems={"center"} py={6} gap={1}>
        <NotificationsOutlinedIcon sx={{ fontSize: 40, opacity: 0.3 }} />
        <Typography sx={{ fontSize: 14, opacity: 0.5 }}>{t("No notices yet")}</Typography>
      </Stack>
    );
  }

  return (
    <Stack className={"notices-list"} gap={2}>
      {allNotifications.map((notification) => (
        <Box key={notification._id} className={"notice-card"}>
          <Stack direction={"row"} alignItems={"center"} gap={1} mb={0.5}>
            <span className={`notice-badge notice-badge--${notification.notificationGroup?.toLowerCase()}`}>
              {notification.notificationType}
            </span>
            <Typography className={"notice-date"}>
              {new Date(notification.createdAt).toLocaleDateString()}
            </Typography>
          </Stack>
          <Typography className={"notice-title"}>{notification.notificationTitle}</Typography>
          {notification.notificationDesc && (
            <Typography className={"notice-content"}>{notification.notificationDesc}</Typography>
          )}
        </Box>
      ))}
    </Stack>
  );
};

export default Notices;
