import {
  PerfumeLongevity,
  PerfumeScent,
  PerfumeSeason,
  PerfumeStatus,
  PerfumeType,
} from "../../enums/perfume.enum";
import { Direction } from "../../enums/common.enum";

export interface PerfumeInput {
  perfumeType: PerfumeType;
  perfumeScent: PerfumeScent;
  perfumeSize: number;
  perfumeBrand: string;
  perfumeLongevity?: PerfumeLongevity;
  perfumeSeason?: PerfumeSeason[];
  perfumeDiscount?: number;
  perfumeTitle: string;
  perfumePrice: number;
  perfumeImages: string[];
  perfumeDesc?: string;
  memberId?: string;
  releasedAt?: Date;
}

interface PISearch {
  memberId?: string;
  scentList?: PerfumeScent[];
  typeList?: PerfumeType[];
  pricesRange?: PricesRange;
  longevityList?: PerfumeLongevity[];
  seasonList?: PerfumeSeason[];
  brandList?: string[];
  periodsRange?: PeriodsRange;
  text?: string;
}

export interface PerfumesInquiry {
  page: number;
  limit: number;
  sort?: string;
  direction?: Direction;
  search: PISearch;
}

interface APISearch {
  perfumeStatus?: PerfumeStatus;
}

export interface ExpertPerfumesInquiry {
  page: number;
  limit: number;
  sort?: string;
  direction?: Direction;
  search: APISearch;
}

interface ALPISearch {
  perfumeStatus?: PerfumeStatus;
  scentList?: PerfumeScent[];
}

export interface AllPerfumesInquiry {
  page: number;
  limit: number;
  sort?: string;
  direction?: Direction;
  search: ALPISearch;
}

export interface OrdinaryInquiry {
  page: number;
  limit: number;
}

interface PricesRange {
  start: number;
  end: number;
}

interface PeriodsRange {
  start: Date;
  end: Date;
}
