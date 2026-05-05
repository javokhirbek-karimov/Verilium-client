import { gql } from "@apollo/client";

/**************************
 *         MEMBER         *
 *************************/

export const GET_MEMBER = gql`
  query GetMember($input: String!) {
    getMember(memberId: $input) {
      _id
      memberType
      memberStatus
      memberNick
      memberFullName
      memberImage
      memberPhone
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
      createdAt
      updatedAt
      meLiked {
        memberId
        likeRefId
        myFavorite
      }
      meFollowed {
        followingId
        followerId
        myFollowing
      }
    }
  }
`;

export const GET_EXPERTS = gql`
  query GetExperts($input: ExpertsInquiry!) {
    getExperts(input: $input) {
      list {
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
        memberExpertRequest
        firstLoginAt
        lastLoginAt
        loginCount
        meLiked {
          memberId
          likeRefId
          myFavorite
        }
        meFollowed {
          followingId
          followerId
          myFollowing
        }
      }
      metaCounter {
        total
      }
    }
  }
`;

export const GET_ALL_MEMBERS_BY_ADMIN = gql`
  query GetAllMembersByAdmin($input: MembersInquiry!) {
    getAllMembersByAdmin(input: $input) {
      list {
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
        memberExpertRequest
        deletedAt
        createdAt
        updatedAt
        accessToken
      }
      metaCounter {
        total
      }
    }
  }
`;

export const GET_RETENTION_STATS = gql`
  query GetRetentionStats {
    getRetentionStats {
      totalMembers
      returnedMembers
      retentionRate
    }
  }
`;

/**************************
 *        PERFUMES        *
 *************************/

export const GET_PERFUMES = gql`
  query GetPerfumes($input: PerfumesInquiry!) {
    getPerfumes(input: $input) {
      list {
        _id
        perfumeType
        perfumeStatus
        perfumeScent
        perfumeLongevity
        perfumeSize
        perfumeBrand
        perfumeSeason
        perfumeDiscount
        perfumeTitle
        perfumePrice
        perfumeViews
        perfumeLikes
        perfumeComments
        perfumeRank
        perfumeImages
        perfumeDesc
        deletedAt
        releasedAt
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
        }
        memberId
        meLiked {
          memberId
          likeRefId
          myFavorite
        }
      }
      metaCounter {
        total
      }
    }
  }
`;

export const GET_PERFUME = gql`
  query GetPerfume($input: String!) {
    getPerfume(perfumeId: $input) {
      _id
      perfumeType
      perfumeStatus
      perfumeScent
      perfumeLongevity
      perfumeSize
      perfumeBrand
      perfumeSeason
      perfumeDiscount
      perfumeTitle
      perfumePrice
      perfumeViews
      perfumeLikes
      perfumeComments
      perfumeRank
      perfumeImages
      perfumeDesc
      memberId
      deletedAt
      releasedAt
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
        memberExpertRequest
      }
      meLiked {
        memberId
        likeRefId
        myFavorite
      }
    }
  }
`;

export const GET_EXPERT_PERFUMES = gql`
  query GetExpertPerfumes($input: ExpertPerfumesInquiry!) {
    getExpertPerfumes(input: $input) {
      list {
        _id
        perfumeType
        perfumeStatus
        perfumeScent
        perfumeLongevity
        perfumeSize
        perfumeBrand
        perfumeSeason
        perfumeDiscount
        perfumeTitle
        perfumePrice
        perfumeViews
        perfumeLikes
        perfumeComments
        perfumeRank
        perfumeImages
        perfumeDesc
        memberId
        deletedAt
        releasedAt
      }
      metaCounter {
        total
      }
    }
  }
`;

export const GET_FAVORITES = gql`
  query GetFavourites($input: OrdinaryInquiry!) {
    getFavourites(input: $input) {
      list {
        _id
        perfumeType
        perfumeStatus
        perfumeScent
        perfumeLongevity
        perfumeSize
        perfumeBrand
        perfumeSeason
        perfumeDiscount
        perfumeTitle
        perfumePrice
        perfumeViews
        perfumeLikes
        perfumeComments
        perfumeRank
        perfumeImages
        perfumeDesc
        memberId
        deletedAt
        releasedAt
      }
      metaCounter {
        total
      }
    }
  }
`;

export const GET_VISITED = gql`
  query GetVisited($input: OrdinaryInquiry!) {
    getVisited(input: $input) {
      list {
        _id
        perfumeType
        perfumeStatus
        perfumeScent
        perfumeLongevity
        perfumeSize
        perfumeBrand
        perfumeSeason
        perfumeDiscount
        perfumeTitle
        perfumePrice
        perfumeViews
        perfumeLikes
        perfumeComments
        perfumeRank
        perfumeImages
        perfumeDesc
        memberId
        deletedAt
        releasedAt
      }
      metaCounter {
        total
      }
    }
  }
`;

export const GET_ALL_PERFUMES_BY_ADMIN = gql`
  query GetAllPerfumesByAdmin($input: AllPerfumesInquiry!) {
    getAllPerfumesByAdmin(input: $input) {
      list {
        _id
        perfumeType
        perfumeStatus
        perfumeScent
        perfumeLongevity
        perfumeSize
        perfumeBrand
        perfumeSeason
        perfumeDiscount
        perfumeTitle
        perfumePrice
        perfumeViews
        perfumeLikes
        perfumeComments
        perfumeRank
        perfumeImages
        perfumeDesc
        memberId
        deletedAt
        releasedAt
      }
      metaCounter {
        total
      }
    }
  }
`;

/**************************
 *      BOARD-ARTICLE     *
 *************************/

export const GET_BOARD_ARTICLES = gql`
  query GetBoardArticles($input: BoardArticlesInquiry!) {
    getBoardArticles(input: $input) {
      list {
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
        meLiked {
          memberId
          likeRefId
          myFavorite
        }
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
        }
      }
      metaCounter {
        total
      }
    }
  }
`;

export const GET_BOARD_ARTICLE = gql`
  query GetBoardArticle($input: String!) {
    getBoardArticle(articleId: $input) {
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
        memberWarnings
        memberBlocks
        memberPerfumes
        memberRank
        memberPoints
        memberLikes
        memberViews
        deletedAt
        createdAt
        updatedAt
      }
      meLiked {
        memberId
        likeRefId
        myFavorite
      }
    }
  }
`;

export const GET_ALL_BOARD_ARTICLES_BY_ADMIN = gql`
  query GetAllBoardArticlesByAdmin($input: AllBoardArticlesInquiry!) {
    getAllBoardArticlesByAdmin(input: $input) {
      list {
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
        meLiked {
          memberId
          likeRefId
          myFavorite
        }
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
          memberExpertRequest
          firstLoginAt
          lastLoginAt
          loginCount
        }
      }
      metaCounter {
        total
      }
    }
  }
`;

/**************************
 *         COMMENT        *
 *************************/

export const GET_COMMENTS = gql`
  query GetComments($input: CommentsInquiry!) {
    getComments(input: $input) {
      list {
        _id
        commentStatus
        commentGroup
        commentContent
        commentRefId
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
          memberWarnings
          memberBlocks
          memberPerfumes
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
      metaCounter {
        total
      }
    }
  }
`;

/**************************
 *            CS          *
 *************************/

export const GET_FAQS = gql`
  query GetFaqs($input: FaqInquiry!) {
    getFaqs(input: $input) {
      list {
        _id
        faqCategory
        faqStatus
        faqQuestion
        faqAnswer
        createdAt
        updatedAt
      }
      metaCounter {
        total
      }
    }
  }
`;

export const GET_ALL_FAQS_BY_ADMIN = gql`
  query GetAllFaqsByAdmin($input: FaqInquiry!) {
    getAllFaqsByAdmin(input: $input) {
      list {
        _id
        faqCategory
        faqStatus
        faqQuestion
        faqAnswer
        createdAt
        updatedAt
      }
      metaCounter {
        total
      }
    }
  }
`;

export const GET_NOTIFICATIONS = gql`
  query GetNotifications($input: NotificationInquiry!) {
    getNotifications(input: $input) {
      list {
        _id
        notificationType
        notificationStatus
        notificationGroup
        notificationTitle
        notificationDesc
        authorId
        receiverId
        createdAt
        updatedAt
      }
      metaCounter {
        total
      }
    }
  }
`;

export const NOTIFICATION_CREATED = gql`
  subscription NotificationCreated($receiverId: String!) {
    notificationCreated(receiverId: $receiverId) {
      _id
      notificationType
      notificationStatus
      notificationGroup
      notificationTitle
      notificationDesc
      authorId
      receiverId
      createdAt
    }
  }
`;

export const NOTICE_RECEIVED = gql`
  subscription NoticeReceived {
    noticeReceived {
      _id
      noticeCategory
      noticeStatus
      noticeTitle
      noticeContent
      memberId
      createdAt
    }
  }
`;

/**************************
 *         FOLLOW         *
 *************************/

export const GET_MEMBER_FOLLOWERS = gql`
  query GetMemberFollowers($input: FollowInquiry!) {
    getMemberFollowers(input: $input) {
      list {
        _id
        followingId
        followerId
        createdAt
        followerData {
          _id
          memberNick
          memberFullName
          memberImage
          memberType
          memberFollowers
          memberFollowings
        }
        meFollowed {
          followingId
          followerId
          myFollowing
        }
      }
      metaCounter {
        total
      }
    }
  }
`;

export const GET_MEMBER_FOLLOWINGS = gql`
  query GetMemberFollowings($input: FollowInquiry!) {
    getMemberFollowings(input: $input) {
      list {
        _id
        followingId
        followerId
        createdAt
        followingData {
          _id
          memberNick
          memberFullName
          memberImage
          memberType
          memberFollowers
          memberFollowings
        }
        meFollowed {
          followingId
          followerId
          myFollowing
        }
      }
      metaCounter {
        total
      }
    }
  }
`;

export const GET_ALL_NOTIFICATIONS_BY_ADMIN = gql`
  query GetAllNotificationsByAdmin($input: AdminNotificationsInquiry!) {
    getAllNotificationsByAdmin(input: $input) {
      list {
        _id
        notificationType
        notificationStatus
        notificationGroup
        notificationTitle
        notificationDesc
        authorId
        receiverId
        createdAt
        updatedAt
      }
      metaCounter {
        total
      }
    }
  }
`;
