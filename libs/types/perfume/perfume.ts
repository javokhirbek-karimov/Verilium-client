import {
  PerfumeType,
  PerfumeStatus,
  PerfumeScent,
  PerfumeLongevity,
  PerfumeSeason,
} from "../../enums/perfume.enum";
import { Member } from "../member/member";

export interface MeLiked {
  memberId: string;
  likeRefId: string;
  myFavorite: boolean;
}

export interface TotalCounter {
  total: number;
}

export interface Perfume {
  _id: string;
  perfumeType: PerfumeType;
  perfumeStatus: PerfumeStatus;
  perfumeScent: PerfumeScent;
  perfumeLongevity?: PerfumeLongevity;
  perfumeSize: number;
  perfumeBrand: string;
  perfumeSeason?: PerfumeSeason[];
  perfumeDiscount?: number;
  perfumeTitle: string;
  perfumePrice: number;
  perfumeViews: number;
  perfumeLikes: number;
  perfumeComments: number;
  perfumeRank: number;
  perfumeImages: string[];
  perfumeDesc?: string;
  memberId: string;
  createdAt?: Date;
  deletedAt?: Date;
  releasedAt?: Date;
  /** aggregation fields */
  meLiked?: MeLiked[];
  memberData?: Member;
}

export interface Perfumes {
  list: Perfume[];
  metaCounter?: TotalCounter[];
}
