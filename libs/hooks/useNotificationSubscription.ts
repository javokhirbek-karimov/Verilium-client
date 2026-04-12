import { useSubscription, useReactiveVar } from "@apollo/client";
import { toast } from "sonner";
import { NOTIFICATION_CREATED } from "../../apollo/user/query";
import { notificationsVar } from "../../apollo/store";
import { Notification } from "../types/cs/notification";
import { userVar } from "../../apollo/store";

export const useNotificationSubscription = () => {
  const user = useReactiveVar(userVar);
  const receiverId = user?._id ?? "guest";

  useSubscription<{ notificationCreated: Notification }>(NOTIFICATION_CREATED, {
    variables: { receiverId },
    skip: !user?._id,
    onData: ({ data }) => {
      const notification = data?.data?.notificationCreated;
      if (!notification) return;

      notificationsVar([notification, ...notificationsVar()]);

      toast(notification.notificationTitle, {
        description: notification.notificationDesc,
        duration: 6000,
        position: "top-right",
      });
    },
  });
};
