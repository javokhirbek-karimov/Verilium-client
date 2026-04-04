import { gql } from "@apollo/client";

/**************************
 *         MEMBER         *
 *************************/

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

export const LIKE_TARGET_MEMBER = gql`
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

export const UPDATE_MEMBER = gql`
  mutation UpdateMember($input: MemberUpdate!) {
    updateMember(input: $input) {
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
      memberPerfumes
      memberArticles
      memberFollowers
      memberFollowings
      memberPoints
      memberLikes
      memberViews
      memberComments
      memberRank
      memberWarnings
      memberBlocks
      deletedAt
      createdAt
      updatedAt
      accessToken
      expertRequest
      firstLoginAt
      lastLoginAt
      loginCount
      meFollowed {
        followingId
        followerId
        myFollowing
      }
      meLiked {
        memberId
        likeRefId
        myFavorite
      }
    }
  }
`;

/**************************
 *         COMMENT         *
 *************************/

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

export const UPDATE_COMMENT = gql`
  mutation UpdateComment($input: CommentUpdate!) {
    updateComment(input: $input) {
      _id
      commentStatus
      commentGroup
      commentContent
      commentRefId
      memberId
      createdAt
      updatedAt
    }
  }
`;

/**************************
 *         PERFUME         *
 *************************/

export const CREATE_PERFUME = gql`
  mutation CreatePerfume($input: PerfumeInput!) {
    createPerfume(input: $input) {
      _id
      perfumeType
      perfumeStatus
      perfumeScent
      perfumeLongevity
      perfumeSeason
      perfumeSize
      perfumeBrand
      perfumeTitle
      perfumePrice
      perfumeViews
      perfumeLikes
      perfumeImages
      perfumeDesc
      memberId
      createdAt
      updatedAt
    }
  }
`;

export const UPDATE_PERFUME = gql`
  mutation UpdatePerfume($input: PerfumeUpdate!) {
    updatePerfume(input: $input) {
      _id
      perfumeType
      perfumeStatus
      perfumeScent
      perfumeLongevity
      perfumeSeason
      perfumeSize
      perfumeBrand
      perfumeTitle
      perfumePrice
      perfumeViews
      perfumeLikes
      perfumeImages
      perfumeDesc
      memberId
      createdAt
      updatedAt
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

/**************************
 *      BOARD-ARTICLE     *
 *************************/

export const CREATE_BOARD_ARTICLE = gql`
  mutation CreateBoardArticle($input: BoardArticleInput!) {
    createBoardArticle(input: $input) {
      _id
      articleCategory
      articleStatus
      articleTitle
      articleContent
      articleImage
      articleViews
      articleLikes
      articleComments
      memberId
      createdAt
      updatedAt
      memberData {
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
        memberPerfumes
        memberArticles
        memberFollowers
        memberFollowings
        memberPoints
        memberLikes
        memberViews
        memberComments
        memberRank
        memberWarnings
        memberBlocks
        deletedAt
        createdAt
        updatedAt
        accessToken
        expertRequest
      }
    }
  }
`;

/**************************
 *       FOLLOW           *
 *************************/

export const SUBSCRIBE = gql`
  mutation Subscribe($input: String!) {
    subscribe(input: $input) {
      followingId
      followerId
      myFollowing
    }
  }
`;

export const UNSUBSCRIBE = gql`
  mutation Unsubscribe($input: String!) {
    unsubscribe(input: $input) {
      followingId
      followerId
      myFollowing
    }
  }
`;

export const LIKE_TARGET_BOARD_ARTICLE = gql`
  mutation LikeTargetArticle($input: String!) {
    likeTargetArticle(articleId: $input) {
      _id
      articleCategory
      articleStatus
      articleTitle
      articleContent
      articleImage
      articleViews
      articleLikes
      memberId
      createdAt
      updatedAt
    }
  }
`;

/**************************
 *            CS          *
 *************************/

export const CREATE_FAQ = gql`
  mutation CreateFaq($input: FaqInput!) {
    createFaq(input: $input) {
      _id
      faqCategory
      faqStatus
      faqQuestion
      faqAnswer
      createdAt
      updatedAt
    }
  }
`;

export const UPDATE_FAQ = gql`
  mutation UpdateFaq($input: FaqUpdate!) {
    updateFaq(input: $input) {
      _id
      faqCategory
      faqStatus
      faqQuestion
      faqAnswer
      createdAt
      updatedAt
    }
  }
`;

export const REMOVE_FAQ_FROM_DB = gql`
  mutation RemoveFaqFromDB($input: String!) {
    removeFaqFromDB(faqId: $input) {
      _id
      faqCategory
      faqStatus
      faqQuestion
      faqAnswer
      createdAt
      updatedAt
    }
  }
`;
