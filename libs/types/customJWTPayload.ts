import { JwtPayload } from "jwt-decode";

export interface CustomJwtPayload extends JwtPayload {
  _id: string;
  memberType: string;
  memberStatus: string;
  memberAuthType: string;
  memberPhone: string;
  memberNick: string;
  memberFullName?: string;
  memberImage?: string;
  memberAddress?: string;
  memberDesc?: string;
  memberPerfumes: number;
  memberRank: number;
  memberArticles: number;
  memberPoints: number;
  memberLikes: number;
  memberViews: number;
  memberWarnings: number;
  memberBlocks: number;
}

export type telegramData = {
  id: number;        // Telegram sends as number; converted to string before sending to backend
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  auth_date: number; // Unix timestamp — converted to string before sending to backend
  hash: string;
};
