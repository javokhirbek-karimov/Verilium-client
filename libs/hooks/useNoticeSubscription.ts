import { useSubscription } from "@apollo/client";
import { toast } from "sonner";
import { NOTICE_RECEIVED } from "../../apollo/user/query";
import { noticesVar } from "../../apollo/store";
import { Notice } from "../types/cs/notice";

export const useNoticeSubscription = () => {
  useSubscription<{ noticeReceived: Notice }>(NOTICE_RECEIVED, {
    onData: ({ data }) => {
      const notice = data?.data?.noticeReceived;
      if (!notice) return;

      noticesVar([notice, ...noticesVar()]);

      toast(notice.noticeTitle, {
        description: notice.noticeContent,
        duration: 6000,
        position: "top-right",
      });
    },
  });
};
