import { gql } from "@apollo/client";

export const CREATE_FAQ = gql`
  mutation CreateFaq($input: FaqInput!) {
    createFaq(input: $input) {
      id
      faqCategory
      faqQuestion
      faqAnswer
    }
  }
`;

export const GET_FAQS = gql`
  query GetFaqs($input: FaqInquiry!) {
    getFaqs(input: $input) {
      list {
        id
        faqCategory
        faqQuestion
        faqAnswer
        faqStatus
      }
      meta {
        total
        page
        limit
      }
    }
  }
`;
