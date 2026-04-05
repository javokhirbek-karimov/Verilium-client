import { makeVar } from "@apollo/client";

import { CustomJwtPayload } from "../libs/types/customJWTPayload";
import { Notification } from "../libs/types/cs/notification";
import { Notice } from "../libs/types/cs/notice";

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
export const socketVar = makeVar<WebSoket>();
