import { gql } from "@apollo/client";

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
