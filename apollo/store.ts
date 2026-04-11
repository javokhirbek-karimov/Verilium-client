import { makeVar } from "@apollo/client";

import { CustomJwtPayload } from "../libs/types/customJWTPayload";
import { Notification } from "../libs/types/cs/notification";
import { Notice } from "../libs/types/cs/notice";
import { Member } from "../libs/types/member/member";

export const themeVar = makeVar({});
export const notificationsVar = makeVar<Notification[]>([]);
export const noticesVar = makeVar<Notice[]>([]);

export const userVar = makeVar<CustomJwtPayload>({
  _id: "",
  memberType: "",
  memberStatus: "",
  memberAuthType: "",
  memberPhone: "",
  memberNick: "",
  memberFullName: "",
  memberImage: "",
  memberAddress: "",
  memberDesc: "",
  memberPerfumes: 0,
  memberRank: 0,
  memberArticles: 0,
  memberPoints: 0,
  memberLikes: 0,
  memberViews: 0,
  memberWarnings: 0,
  memberBlocks: 0,
});

// @ts-ignore
export const socketVar = makeVar<WebSocket>();

export interface MemberMessage {
  event: string;
  text: string;
  memberData: Member;
}

export interface AiMessage {
  id: string;
  type: "ai" | "user";
  text: string;
  timestamp: string;
}

export const memberMessagesVar = makeVar<MemberMessage[]>([]);
export const aiMessagesVar = makeVar<AiMessage[]>([
  {
    id: "ai-welcome",
    type: "ai",
    text: "Hello! I'm your AI assistant. Ask me anything about our perfumes",
    timestamp: new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    }),
  },
]);
export const onlineUsersVar = makeVar<number>(0);
