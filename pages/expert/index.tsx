import React, { ChangeEvent, MouseEvent, useEffect, useState } from "react";
import { NextPage } from "next";
import useDeviceDetect from "../../libs/hooks/useDeviceDetect";
import withLayoutBasic from "../../libs/components/layout/layoutBasic";
import { Stack, Box, Button, Pagination, Typography } from "@mui/material";
import { Menu, MenuItem } from "@mui/material";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";
import ExpertCard from "../../libs/components/expert/ExpertCard";
import { useRouter } from "next/router";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { Member } from "../../libs/types/member/member";
import { LIKE_TARGET_MEMBER } from "../../apollo/user/mutation";
import { useMutation, useQuery } from "@apollo/client";
import { GET_EXPERTS } from "../../apollo/user/query";
import { T } from "../../libs/types/common";
import { Messages } from "../../libs/config";
import {
  sweetMixinErrorAlert,
  sweetTopSmallSuccessAlert,
} from "../../libs/sonner";

export const getStaticProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ["common"])),
  },
});

const ExpertList: NextPage = ({ initialInput, ...props }: any) => {
  const device = useDeviceDetect();
  const router = useRouter();
  const [anchorEl2, setAnchorEl2] = useState<null | HTMLElement>(null);
  const [filterSortName, setFilterSortName] = useState("Recent");
  const [sortingOpen, setSortingOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [searchFilter, setSearchFilter] = useState<any>(
    router?.query?.input
      ? JSON.parse(router?.query?.input as string)
      : initialInput,
  );
  const [experts, setExperts] = useState<Member[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchText, setSearchText] = useState<string>("");

  /** APOLLO REQUESTS **/
  const [likeTargetMember] = useMutation(LIKE_TARGET_MEMBER);

  const {
    loading: getExpertsLoading,
    data: getExpertsData,
    error: getExpertsError,
    refetch: getExpertsRefetch,
  } = useQuery(GET_EXPERTS, {
    fetchPolicy: "network-only",
    variables: { input: searchFilter },
    notifyOnNetworkStatusChange: true,
  });

  useEffect(() => {
    if (getExpertsData?.getExperts?.list) {
      setExperts(getExpertsData.getExperts.list);
      setTotal(getExpertsData.getExperts.metaCounter?.[0]?.total ?? 0);
    }
  }, [getExpertsData]);

  /** LIFECYCLES **/
  useEffect(() => {
    if (router.query.input) {
      const input_obj = JSON.parse(router?.query?.input as string);
      setSearchFilter(input_obj);
    } else
      router.replace(
        `/expert?input=${JSON.stringify(searchFilter)}`,
        `/expert?input=${JSON.stringify(searchFilter)}`,
      );

    setCurrentPage(searchFilter.page === undefined ? 1 : searchFilter.page);
  }, [router]);

  /** HANDLERS **/
  const sortingClickHandler = (e: MouseEvent<HTMLElement>) => {
    setAnchorEl(e.currentTarget);
    setSortingOpen(true);
  };

  const sortingCloseHandler = () => {
    setSortingOpen(false);
    setAnchorEl(null);
  };

  const sortingHandler = (e: React.MouseEvent<HTMLLIElement>) => {
    switch (e.currentTarget.id) {
      case "recent":
        setSearchFilter({
          ...searchFilter,
          sort: "createdAt",
          direction: "DESC",
        });
        setFilterSortName("Recent");
        break;
      case "old":
        setSearchFilter({
          ...searchFilter,
          sort: "createdAt",
          direction: "ASC",
        });
        setFilterSortName("Oldest order");
        break;
      case "likes":
        setSearchFilter({
          ...searchFilter,
          sort: "memberLikes",
          direction: "DESC",
        });
        setFilterSortName("Likes");
        break;
      case "views":
        setSearchFilter({
          ...searchFilter,
          sort: "memberViews",
          direction: "DESC",
        });
        setFilterSortName("Views");
        break;
    }
    setSortingOpen(false);
    setAnchorEl2(null);
  };

  const paginationChangeHandler = async (
    event: ChangeEvent<unknown>,
    value: number,
  ) => {
    searchFilter.page = value;
    await router.push(
      `/expert?input=${JSON.stringify(searchFilter)}`,
      `/expert?input=${JSON.stringify(searchFilter)}`,
      {
        scroll: false,
      },
    );
    setCurrentPage(value);
  };

  const likeMemberHandler = async (user: T, id: string) => {
    try {
      if (!id) return;
      if (!user._id) throw new Error(Messages.error2);
      //execute like tartget Property mutation
      await likeTargetMember({
        variables: { input: id },
      });
      await getExpertsRefetch({ input: searchFilter });
      //execute get property refetch
      await sweetTopSmallSuccessAlert("success", 800);
    } catch (err: any) {
      console.log("ERROR likePropertyHandler", err.message);
      sweetMixinErrorAlert(err.message).then();
    }
  };

  if (device === "mobile") {
    return <h1>EXPERTS PAGE MOBILE</h1>;
  } else {
    return (
      <Stack className={"expert-list-page"}>
        {/* ── HERO ── full-width, outside container */}
        <section className="hero-section">
          <div className="hero-content">
            <span className="hero-label">Our Specialists</span>
            <Typography component="h1" className="hero-title">
              Meet the <span>Fragrance</span> Experts
            </Typography>
            <Typography className="hero-sub">
              Discover and connect with passionate perfumers and certified scent
              specialists from around the world.
            </Typography>
          </div>
        </section>

        <Stack className={"container"}>
          <Stack className={"filter"}>
            <Box component={"div"} className={"left"}>
              <input
                type="text"
                placeholder={"Search for an expert"}
                value={searchText}
                onChange={(e: any) => setSearchText(e.target.value)}
                onKeyDown={(event: any) => {
                  if (event.key == "Enter") {
                    setSearchFilter({
                      ...searchFilter,
                      search: { ...searchFilter.search, text: searchText },
                    });
                  }
                }}
              />
            </Box>
            <Box component={"div"} className={"right"}>
              <span>Sort by</span>
              <div>
                <Button
                  onClick={sortingClickHandler}
                  endIcon={<KeyboardArrowDownRoundedIcon />}
                >
                  {filterSortName}
                </Button>
                <Menu
                  anchorEl={anchorEl}
                  open={sortingOpen}
                  onClose={sortingCloseHandler}
                  sx={{ paddingTop: "5px" }}
                >
                  <MenuItem
                    onClick={sortingHandler}
                    id={"recent"}
                    disableRipple
                  >
                    Recent
                  </MenuItem>
                  <MenuItem onClick={sortingHandler} id={"old"} disableRipple>
                    Oldest
                  </MenuItem>
                  <MenuItem onClick={sortingHandler} id={"likes"} disableRipple>
                    Likes
                  </MenuItem>
                  <MenuItem onClick={sortingHandler} id={"views"} disableRipple>
                    Views
                  </MenuItem>
                </Menu>
              </div>
            </Box>
          </Stack>
          <Stack className={"card-wrap"}>
            {experts?.length === 0 ? (
              <div className={"no-data"}>
                <img src="/img/icons/icoAlert.svg" alt="" />
                <p>No Experts found!</p>
              </div>
            ) : (
              experts.map((expert: Member) => {
                return (
                  <ExpertCard
                    expert={expert}
                    likeMemberHandler={likeMemberHandler}
                    key={expert._id}
                  />
                );
              })
            )}
          </Stack>
          <Stack className={"pagination"}>
            <Stack className="pagination-box">
              {experts.length !== 0 &&
                Math.ceil(total / searchFilter.limit) > 1 && (
                  <Stack className="pagination-box">
                    <Pagination
                      page={currentPage}
                      count={Math.ceil(total / searchFilter.limit)}
                      onChange={paginationChangeHandler}
                      shape="circular"
                      color="primary"
                    />
                  </Stack>
                )}
            </Stack>

            {experts.length !== 0 && (
              <span>
                Total {total} expert{total > 1 ? "s" : ""} available
              </span>
            )}
          </Stack>
        </Stack>
      </Stack>
    );
  }
};

ExpertList.defaultProps = {
  initialInput: {
    page: 1,
    limit: 10,
    sort: "createdAt",
    direction: "DESC",
    search: {},
  },
};

export default withLayoutBasic(ExpertList);
