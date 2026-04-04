import { FaqCategory, FaqStatus } from "../../enums/faq.enum";

export interface TotalCounter {
  total: number;
}

export interface Faq {
  _id: string;
  faqCategory: FaqCategory;
  faqStatus: FaqStatus;
  faqQuestion: string;
  faqAnswer: string;
  createdAt: string;
  updatedAt: string;
}

export interface Faqs {
  list: Faq[];
  metaCounter: TotalCounter[];
}
