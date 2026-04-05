import React, { useState } from "react";
import { NextPage } from "next";
import {
  Stack,
  Typography,
  TablePagination,
  TextField,
  InputAdornment,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useMutation, useQuery } from "@apollo/client";
import { PerfumePanelList } from "../../../libs/components/admin/perfumes/PerfumeList";
import withLayoutAdmin from "../../../libs/components/layout/LayoutAdmin";
import {
  sweetErrorHandling,
  sweetTopSmallSuccessAlert,
} from "../../../libs/sonner";
import { GET_ALL_PERFUMES_BY_ADMIN } from "../../../apollo/user/query";
import {
  UPDATE_PERFUME_BY_ADMIN,
  REMOVE_PERFUME_BY_ADMIN,
} from "../../../apollo/user/mutation";

const AdminPerfumes: NextPage = () => {
  const [anchorEl, setAnchorEl] = useState<any>([]);
  const [perfumesInquiry, setPerfumesInquiry] = useState({
    page: 1,
    limit: 10,
    search: {},
  });

  /** APOLLO **/
  const { data, refetch } = useQuery(GET_ALL_PERFUMES_BY_ADMIN, {
    fetchPolicy: "network-only",
    variables: { input: perfumesInquiry },
    notifyOnNetworkStatusChange: true,
  });

  const [updatePerfumeByAdmin] = useMutation(UPDATE_PERFUME_BY_ADMIN);
  const [removePerfumeByAdmin] = useMutation(REMOVE_PERFUME_BY_ADMIN);

  const perfumes = data?.getAllPerfumesByAdmin?.list ?? [];
  const total = data?.getAllPerfumesByAdmin?.metaCounter?.[0]?.total ?? 0;

  /** HANDLERS **/
  const menuIconClickHandler = (e: any, id: any) => {
    const temp: any = { ...anchorEl };
    temp[id] = e.currentTarget;
    setAnchorEl(temp);
  };

  const menuIconCloseHandler = () => {
    setAnchorEl([]);
  };

  const updatePerfumeHandler = async (updateData: any) => {
    try {
      await updatePerfumeByAdmin({ variables: { input: updateData } });
      menuIconCloseHandler();
      await sweetTopSmallSuccessAlert("Updated!", 700);
      await refetch({ input: perfumesInquiry });
    } catch (err: any) {
      menuIconCloseHandler();
      sweetErrorHandling(err).then();
    }
  };

  const removePerfumeHandler = async (perfumeId: string) => {
    try {
      await removePerfumeByAdmin({ variables: { perfumeId } });
      menuIconCloseHandler();
      await sweetTopSmallSuccessAlert("Deleted!", 700);
      await refetch({ input: perfumesInquiry });
    } catch (err: any) {
      menuIconCloseHandler();
      sweetErrorHandling(err).then();
    }
  };

  const handlePageChange = (_: any, newPage: number) => {
    setPerfumesInquiry({ ...perfumesInquiry, page: newPage + 1 });
  };

  const handleRowsPerPageChange = (e: any) => {
    setPerfumesInquiry({ ...perfumesInquiry, limit: parseInt(e.target.value), page: 1 });
  };

  return (
    <Stack className={"content"}>
      <Stack className={"flex-space"}>
        <Typography className={"tit"}>Perfumes</Typography>

        <Stack direction={"row"} gap={1} className={"search-area"}>
          <TextField
            size={"small"}
            placeholder={"Search by title..."}
            InputProps={{
              startAdornment: (
                <InputAdornment position={"start"}>
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            onChange={(e) =>
              setPerfumesInquiry({
                ...perfumesInquiry,
                page: 1,
                search: e.target.value
                  ? { perfumeTitle: e.target.value }
                  : {},
              })
            }
          />
        </Stack>
      </Stack>

      <Stack className={"table-wrap"}>
        <PerfumePanelList
          perfumes={perfumes}
          anchorEl={anchorEl}
          menuIconClickHandler={menuIconClickHandler}
          menuIconCloseHandler={menuIconCloseHandler}
          updatePerfumeHandler={updatePerfumeHandler}
          removePerfumeHandler={removePerfumeHandler}
        />
        <TablePagination
          rowsPerPageOptions={[10, 20, 50]}
          component={"div"}
          count={total}
          rowsPerPage={perfumesInquiry.limit}
          page={perfumesInquiry.page - 1}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleRowsPerPageChange}
        />
      </Stack>
    </Stack>
  );
};

export default withLayoutAdmin(AdminPerfumes);
