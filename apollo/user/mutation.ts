import { gql } from "@apollo/client";

export const SIGN_UP = gql`
  mutation Signup($input: MemberInput!) {
    signup(input: $input) {
      _id
      memberType
      memberStatus
      memberAuthType
      memberPhone
      memberNick
      memberFullName
      memberImage
      memberAddress
      memberDesc
      memberWarnings
      memberBlocks
      memberPrerfumes
      memberRank
      memberArticles
      memberPoints
      memberLikes
      memberViews
      deletedAt
      createdAt
      updatedAt
      accessToken
    }
  }
`;

export const LOGIN = gql`
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      _id
      memberType
      memberStatus
      memberNick
      memberFullName
      memberImage
      memberFollowers
      memberFollowings
      memberPoints
      memberLikes
      memberViews
      memberPerfumes
      memberArticles
      memberRank
      accessToken
    }
  }
`;

export const TELEGRAM_LOGIN = gql`
  mutation TelegramLogin($input: TelegramLoginInput!) {
    telegramLogin(input: $input) {
      _id
      memberNick
      memberImage
      accessToken
    }
  }
`;

export const CREATE_COMMENT = gql`
  mutation CreateComment($input: CommentInput!) {
    createComment(input: $input) {
      _id
      commentGroup
      commentContent
      commentRefId
      memberId
      createdAt
    }
  }
`;

export const LIKE_TARGET_PERFUME = gql`
  mutation LikeTargetMember($input: String!) {
    likeTargetMember(memberId: $input) {
      _id
      memberType
      memberStatus
      memberAuthType
      memberPhone
      memberNick
      memberFullName
      memberImage
      memberAddress
      memberDesc
      memberWarnings
      memberBlocks
      memberProperties
      memberRank
      memberPoints
      memberLikes
      memberViews
      deletedAt
      createdAt
      updatedAt
      accessToken
    }
  }
`;
