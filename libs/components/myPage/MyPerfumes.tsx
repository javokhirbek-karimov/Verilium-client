import React, { useState } from "react";
import { NextPage } from "next";
import { Pagination, Stack, Typography } from "@mui/material";
import useDeviceDetect from "../../hooks/useDeviceDetect";
import { PerfumeCard } from "./PerfumeCard";
import { useMutation, useQuery, useReactiveVar } from "@apollo/client";
import { Perfume } from "../../types/perfume/perfume";
import { ExpertPerfumesInquiry } from "../../types/perfume/perfume.input";
import { T } from "../../types/common";
import { PerfumeStatus } from "../../enums/perfume.enum";
import { userVar } from "../../../apollo/store";
import { useRouter } from "next/router";
import { UPDATE_PERFUME } from "../../../apollo/user/mutation";
import { GET_EXPERT_PERFUMES } from "../../../apollo/user/query";
import { sweetConfirmAlert, sweetErrorHandling } from "../../sonner";

const MyPerfumes: NextPage = ({ initialInput }: any) => {
  const device = useDeviceDetect();
  const router = useRouter();
  const user = useReactiveVar(userVar);
  const [searchFilter, setSearchFilter] =
    useState<ExpertPerfumesInquiry>(initialInput);
  const [perfumes, setPerfumes] = useState<Perfume[]>([]);
  const [total, setTotal] = useState<number>(0);

  /** APOLLO REQUESTS **/
  const [updatePerfume] = useMutation(UPDATE_PERFUME);

  const { refetch: refetchPerfumes } = useQuery(GET_EXPERT_PERFUMES, {
    fetchPolicy: "network-only",
    variables: { input: searchFilter },
    notifyOnNetworkStatusChange: true,
    onCompleted: (data: T) => {
      setPerfumes(data?.getExpertPerfumes?.list);
      setTotal(data?.getExpertPerfumes?.metaCounter[0]?.total ?? 0);
    },
  });

  /** HANDLERS **/
  const paginationHandler = (_: T, value: number) => {
    setSearchFilter({ ...searchFilter, page: value });
  };

  const changeStatusHandler = (status: PerfumeStatus) => {
    setSearchFilter({
      ...searchFilter,
      search: { perfumeStatus: status },
    });
  };

  const deletePerfumeHandler = async (id: string) => {
    try {
      if (await sweetConfirmAlert("Are you sure you want to delete this perfume?")) {
        await updatePerfume({
          variables: { input: { _id: id, perfumeStatus: PerfumeStatus.DELETED } },
        });
        await refetchPerfumes({ input: searchFilter });
      }
    } catch (err: any) {
      await sweetErrorHandling(err);
    }
  };

  const updatePerfumeHandler = async (status: string, id: string) => {
    try {
      if (await sweetConfirmAlert(`Change status to ${status}?`)) {
        await updatePerfume({
          variables: { input: { _id: id, perfumeStatus: status } },
        });
        await refetchPerfumes({ input: searchFilter });
      }
    } catch (err: any) {
      await sweetErrorHandling(err);
    }
  };

  if (
    user?.memberType !== "EXPERT" &&
    user?.memberType !== "AGENT" &&
    user?.memberType !== "ADMIN"
  ) {
    router.back();
  }

  if (device === "mobile") return <div>MY PERFUMES MOBILE</div>;

  const activeStatus = searchFilter.search.perfumeStatus;

  return (
    <div id="my-perfumes-page">
      {/* ── Header ──────────────────────────────────────────────────── */}
      <Stack className="main-title-box">
        <Typography className="main-title">My Perfumes</Typography>
        <Typography className="sub-title">
          Manage your listed fragrances
        </Typography>
      </Stack>

      {/* ── Table ───────────────────────────────────────────────────── */}
      <Stack className="perfumes-list-box">
        {/* Status tabs */}
        <Stack className="tab-bar">
          {[
            { label: "Active", value: PerfumeStatus.ACTIVE },
            { label: "Sold Out", value: PerfumeStatus.SOLDOUT },
          ].map(({ label, value }) => (
            <Typography
              key={value}
              className={activeStatus === value ? "tab active" : "tab"}
              onClick={() => changeStatusHandler(value)}
            >
              {label}
            </Typography>
          ))}
        </Stack>

        {/* Table header */}
        <Stack className="table-head">
          <Typography className="col-title wide">Perfume</Typography>
          <Typography className="col-title">Published</Typography>
          <Typography className="col-title">Status</Typography>
          <Typography className="col-title">Views</Typography>
          {activeStatus === PerfumeStatus.ACTIVE && (
            <Typography className="col-title">Actions</Typography>
          )}
        </Stack>

        {/* Rows */}
        <Stack className="table-body">
          {perfumes?.length === 0 ? (
            <Stack className="no-data">
              <img src="/img/icons/icoAlert.svg" alt="" />
              <Typography>No perfumes found</Typography>
            </Stack>
          ) : (
            perfumes.map((perfume: Perfume) => (
              <PerfumeCard
                key={perfume._id}
                perfume={perfume}
                deletePerfumeHandler={deletePerfumeHandler}
                updatePerfumeHandler={updatePerfumeHandler}
              />
            ))
          )}
        </Stack>

        {/* Pagination */}
        {perfumes.length > 0 && (
          <Stack className="pagination-config">
            <Pagination
              count={Math.ceil(total / searchFilter.limit)}
              page={searchFilter.page}
              shape="circular"
              color="primary"
              onChange={paginationHandler}
            />
            <Typography className="total-label">
              {total} perfume{total !== 1 ? "s" : ""} total
            </Typography>
          </Stack>
        )}
      </Stack>
    </div>
  );
};

MyPerfumes.defaultProps = {
  initialInput: {
    page: 1,
    limit: 5,
    sort: "createdAt",
    search: { perfumeStatus: PerfumeStatus.ACTIVE },
  },
};

export default MyPerfumes;
