import React, { useEffect, useState } from "react";
import type { NextPage } from "next";
import withAdminLayout from "../../../libs/components/layout/LayoutAdmin";
import { Box, Stack, InputAdornment } from "@mui/material";
import { List, ListItem } from "@mui/material";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import { TabContext } from "@mui/lab";
import OutlinedInput from "@mui/material/OutlinedInput";
import TablePagination from "@mui/material/TablePagination";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import { NoticePanelList } from "../../../libs/components/admin/cs/NoticeList";
import NoticeForm from "../../../libs/components/admin/cs/NoticeForm";
import { useQuery } from "@apollo/client";
import { GET_ALL_NOTIFICATIONS_BY_ADMIN } from "../../../apollo/user/query";
import { Notification } from "../../../libs/types/cs/notification";
import { NotificationStatus } from "../../../libs/enums/notification.enum";
import { T } from "../../../libs/types/common";

const AdminNotice: NextPage = ({ initialInquiry }: any) => {
  const [noticeInquiry, setNoticeInquiry] = useState(initialInquiry);
  const [notices, setNotices] = useState<Notification[]>([]);
  const [noticeTotal, setNoticeTotal] = useState<number>(0);
  const [value, setValue] = useState("ALL");
  const [searchInput, setSearchInput] = useState("");

  const { refetch } = useQuery(GET_ALL_NOTIFICATIONS_BY_ADMIN, {
    fetchPolicy: "network-only",
    variables: { input: noticeInquiry },
    notifyOnNetworkStatusChange: true,
    onCompleted: (data: T) => {
      setNotices(data?.getAllNotificationsByAdmin?.list ?? []);
      setNoticeTotal(data?.getAllNotificationsByAdmin?.metaCounter?.[0]?.total ?? 0);
    },
  });

  useEffect(() => {
    refetch({ input: noticeInquiry }).then();
  }, [noticeInquiry]);

  const tabChangeHandler = (_: any, newValue: string) => {
    setValue(newValue);
    if (newValue === "ALL") {
      const { notificationStatus, ...rest } = noticeInquiry.search ?? {};
      setNoticeInquiry({ ...noticeInquiry, page: 1, search: rest });
    } else {
      setNoticeInquiry({
        ...noticeInquiry,
        page: 1,
        search: { ...noticeInquiry.search, notificationStatus: newValue as NotificationStatus },
      });
    }
  };

  const changePageHandler = async (_: unknown, newPage: number) => {
    noticeInquiry.page = newPage + 1;
    await refetch({ input: noticeInquiry });
    setNoticeInquiry({ ...noticeInquiry });
  };

  const changeRowsPerPageHandler = async (e: React.ChangeEvent<HTMLInputElement>) => {
    noticeInquiry.limit = parseInt(e.target.value, 10);
    noticeInquiry.page = 1;
    await refetch({ input: noticeInquiry });
    setNoticeInquiry({ ...noticeInquiry });
  };

  return (
    <Box component={"div"} className={"content"}>
      <Typography variant={"h2"} className={"tit"} sx={{ mb: "24px" }}>
        Notice Management
      </Typography>

      <NoticeForm onCreated={() => refetch({ input: noticeInquiry })} />

      <Box component={"div"} className={"table-wrap"}>
        <Box component={"div"} sx={{ width: "100%", typography: "body1" }}>
          <TabContext value={value}>
            <Box component={"div"}>
              <List className={"tab-menu"}>
                <ListItem onClick={(e: any) => tabChangeHandler(e, "ALL")} value="ALL" className={value === "ALL" ? "li on" : "li"}>All</ListItem>
                <ListItem onClick={(e: any) => tabChangeHandler(e, NotificationStatus.READ)} value={NotificationStatus.READ} className={value === NotificationStatus.READ ? "li on" : "li"}>Read</ListItem>
                <ListItem onClick={(e: any) => tabChangeHandler(e, NotificationStatus.WAIT)} value={NotificationStatus.WAIT} className={value === NotificationStatus.WAIT ? "li on" : "li"}>Waiting</ListItem>
              </List>
              <Divider />
              <Stack className={"search-area"} sx={{ m: "24px" }}>
                <OutlinedInput
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  sx={{ width: "100%" }}
                  placeholder="Search notice title..."
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      setNoticeInquiry({ ...noticeInquiry, page: 1, search: { ...noticeInquiry.search, text: searchInput } });
                    }
                  }}
                  endAdornment={
                    <>
                      {searchInput && (
                        <CancelRoundedIcon sx={{ cursor: "pointer" }} onClick={() => {
                          setSearchInput("");
                          const { text, ...rest } = noticeInquiry.search ?? {};
                          setNoticeInquiry({ ...noticeInquiry, page: 1, search: rest });
                        }} />
                      )}
                      <InputAdornment position="end">
                        <img src="/img/icons/search_icon.png" alt={"searchIcon"} />
                      </InputAdornment>
                    </>
                  }
                />
              </Stack>
              <Divider />
            </Box>

            <NoticePanelList notices={notices} />

            <TablePagination
              rowsPerPageOptions={[20, 40, 60]}
              component="div"
              count={noticeTotal}
              rowsPerPage={noticeInquiry.limit}
              page={noticeInquiry.page - 1}
              onPageChange={changePageHandler}
              onRowsPerPageChange={changeRowsPerPageHandler}
            />
          </TabContext>
        </Box>
      </Box>
    </Box>
  );
};

AdminNotice.defaultProps = {
  initialInquiry: { page: 1, limit: 20, search: {} },
};

export default withAdminLayout(AdminNotice);
