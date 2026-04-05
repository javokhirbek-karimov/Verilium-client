import { NoticeCategory, NoticeStatus } from "../../enums/notice.enum";
import { TotalCounter } from "./faq";

export interface Notice {
  _id: string;
  noticeCategory: NoticeCategory;
  noticeStatus: NoticeStatus;
  noticeTitle: string;
  noticeContent: string;
  memberId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Notices {
  list: Notice[];
  metaCounter: TotalCounter[];
}
