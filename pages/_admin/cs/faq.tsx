import React, { useEffect, useState } from "react";
import type { NextPage } from "next";
import withAdminLayout from "../../../libs/components/layout/LayoutAdmin";
import { Box, Stack, Button, InputAdornment, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from "@mui/material";
import { List, ListItem } from "@mui/material";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { TabContext } from "@mui/lab";
import OutlinedInput from "@mui/material/OutlinedInput";
import TablePagination from "@mui/material/TablePagination";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import { FaqPanelList } from "../../../libs/components/admin/cs/FaqList";
import { useMutation, useQuery } from "@apollo/client";
import { GET_ALL_FAQS_BY_ADMIN } from "../../../apollo/user/query";
import { CREATE_FAQ, UPDATE_FAQ, REMOVE_FAQ_FROM_DB } from "../../../apollo/user/mutation";
import { sweetErrorHandling, sweetTopSmallSuccessAlert } from "../../../libs/sonner";
import { Faq } from "../../../libs/types/cs/faq";
import { FaqCategory, FaqStatus } from "../../../libs/enums/faq.enum";
import { T } from "../../../libs/types/common";

const FaqArticles: NextPage = ({ initialInquiry }: any) => {
  const [anchorEl, setAnchorEl] = useState<any>([]);
  const [faqInquiry, setFaqInquiry] = useState(initialInquiry);
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [faqTotal, setFaqTotal] = useState<number>(0);
  const [value, setValue] = useState("ALL");
  const [searchInput, setSearchInput] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [newFaq, setNewFaq] = useState({
    faqCategory: FaqCategory.OTHER,
    faqQuestion: "",
    faqAnswer: "",
  });

  /** APOLLO REQUESTS **/
  const [createFaq] = useMutation(CREATE_FAQ);
  const [updateFaq] = useMutation(UPDATE_FAQ);
  const [removeFaqFromDB] = useMutation(REMOVE_FAQ_FROM_DB);

  const { refetch } = useQuery(GET_ALL_FAQS_BY_ADMIN, {
    fetchPolicy: "network-only",
    variables: { input: faqInquiry },
    notifyOnNetworkStatusChange: true,
    onCompleted: (data: T) => {
      setFaqs(data?.getAllFaqsByAdmin?.list);
      setFaqTotal(data?.getAllFaqsByAdmin?.metaCounter[0]?.total ?? 0);
    },
  });

  /** LIFECYCLES **/
  useEffect(() => {
    refetch({ input: faqInquiry }).then();
  }, [faqInquiry]);

  /** HANDLERS **/
  const createFaqHandler = async () => {
    try {
      if (!newFaq.faqQuestion.trim() || !newFaq.faqAnswer.trim()) {
        await sweetErrorHandling(new Error("Question and Answer are required!"));
        return;
      }
      await createFaq({ variables: { input: newFaq } });
      setOpenDialog(false);
      setNewFaq({ faqCategory: FaqCategory.OTHER, faqQuestion: "", faqAnswer: "" });

      await sweetTopSmallSuccessAlert("FAQ created!", 700);
      await refetch({ input: faqInquiry });
    } catch (err: any) {
      sweetErrorHandling(err).then();
    }
  };

  const menuIconClickHandler = (e: any, id: any) => {
    const temp: any = { ...anchorEl };
    temp[id] = e.currentTarget;
    setAnchorEl(temp);
  };

  const menuIconCloseHandler = () => setAnchorEl([]);

  const tabChangeHandler = (_: any, newValue: string) => {
    setValue(newValue);
    if (newValue === "ALL") {
      const { faqStatus, ...rest } = faqInquiry.search ?? {};
      setFaqInquiry({ ...faqInquiry, page: 1, search: rest });
    } else {
      setFaqInquiry({
        ...faqInquiry,
        page: 1,
        search: { ...faqInquiry.search, faqStatus: newValue as FaqStatus },
      });
    }
  };

  const searchCategoryHandler = (category: string) => {
    if (category === "ALL") {
      const { faqCategory, ...rest } = faqInquiry.search ?? {};
      setFaqInquiry({ ...faqInquiry, page: 1, search: rest });
    } else {
      setFaqInquiry({
        ...faqInquiry,
        page: 1,
        search: { ...faqInquiry.search, faqCategory: category as FaqCategory },
      });
    }
  };

  const updateFaqHandler = async (updateData: any) => {
    try {
      await updateFaq({ variables: { input: updateData } });
      menuIconCloseHandler();
      await sweetTopSmallSuccessAlert("Updated!", 700);
      await refetch({ input: faqInquiry });
    } catch (err: any) {
      menuIconCloseHandler();
      sweetErrorHandling(err).then();
    }
  };

  const removeFaqHandler = async (faqId: string) => {
    try {
      await removeFaqFromDB({ variables: { input: faqId } });
      menuIconCloseHandler();
      await sweetTopSmallSuccessAlert("Deleted!", 700);
      await refetch({ input: faqInquiry });
    } catch (err: any) {
      menuIconCloseHandler();
      sweetErrorHandling(err).then();
    }
  };

  const changePageHandler = async (_: unknown, newPage: number) => {
    faqInquiry.page = newPage + 1;
    await refetch({ input: faqInquiry });
    setFaqInquiry({ ...faqInquiry });
  };

  const changeRowsPerPageHandler = async (e: React.ChangeEvent<HTMLInputElement>) => {
    faqInquiry.limit = parseInt(e.target.value, 10);
    faqInquiry.page = 1;
    await refetch({ input: faqInquiry });
    setFaqInquiry({ ...faqInquiry });
  };

  return (
    <Box component={"div"} className={"content"}>
      <Box component={"div"} className={"flex-space"} sx={{ mb: "24px" }}>
        <Typography variant={"h2"} className={"tit"}>FAQ Management</Typography>
        <Button className="btn_add" variant={"contained"} size={"medium"} onClick={() => setOpenDialog(true)}>
          <AddRoundedIcon sx={{ mr: "8px" }} />
          ADD
        </Button>
      </Box>
      <Box component={"div"} className={"table-wrap"}>
        <Box component={"div"} sx={{ width: "100%", typography: "body1" }}>
          <TabContext value={value}>
            <Box component={"div"}>
              <List className={"tab-menu"}>
                <ListItem
                  onClick={(e: any) => tabChangeHandler(e, "ALL")}
                  value="ALL"
                  className={value === "ALL" ? "li on" : "li"}
                >
                  All
                </ListItem>
                <ListItem
                  onClick={(e: any) => tabChangeHandler(e, FaqStatus.ACTIVE)}
                  value={FaqStatus.ACTIVE}
                  className={value === FaqStatus.ACTIVE ? "li on" : "li"}
                >
                  Active
                </ListItem>
                <ListItem
                  onClick={(e: any) => tabChangeHandler(e, FaqStatus.DELETED)}
                  value={FaqStatus.DELETED}
                  className={value === FaqStatus.DELETED ? "li on" : "li"}
                >
                  Deleted
                </ListItem>
              </List>
              <Divider />
              <Stack className={"search-area"} sx={{ m: "24px" }}>
                <Select sx={{ width: "180px", mr: "20px" }} value={"ALL"}>
                  <MenuItem value={"ALL"} onClick={() => searchCategoryHandler("ALL")}>
                    ALL
                  </MenuItem>
                  {Object.values(FaqCategory).map((cat) => (
                    <MenuItem
                      key={cat}
                      value={cat}
                      onClick={() => searchCategoryHandler(cat)}
                    >
                      {cat}
                    </MenuItem>
                  ))}
                </Select>
                <OutlinedInput
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  sx={{ width: "100%" }}
                  className={"search"}
                  placeholder="Search FAQ..."
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      setFaqInquiry({
                        ...faqInquiry,
                        page: 1,
                        search: { ...faqInquiry.search, text: searchInput },
                      });
                    }
                  }}
                  endAdornment={
                    <>
                      {searchInput && (
                        <CancelRoundedIcon
                          sx={{ cursor: "pointer" }}
                          onClick={() => {
                            setSearchInput("");
                            const { text, ...rest } = faqInquiry.search ?? {};
                            setFaqInquiry({ ...faqInquiry, page: 1, search: rest });
                          }}
                        />
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
            <FaqPanelList
              faqs={faqs}
              anchorEl={anchorEl}
              menuIconClickHandler={menuIconClickHandler}
              menuIconCloseHandler={menuIconCloseHandler}
              updateFaqHandler={updateFaqHandler}
              removeFaqHandler={removeFaqHandler}
            />
            <TablePagination
              rowsPerPageOptions={[20, 40, 60]}
              component="div"
              count={faqTotal}
              rowsPerPage={faqInquiry.limit}
              page={faqInquiry.page - 1}
              onPageChange={changePageHandler}
              onRowsPerPageChange={changeRowsPerPageHandler}
            />
          </TabContext>
        </Box>
      </Box>

      {/* ── Create FAQ Dialog ─────────────────────────── */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth={"sm"} fullWidth>
        <DialogTitle>Add New FAQ</DialogTitle>
        <DialogContent>
          <Stack gap={2} sx={{ mt: 1 }}>
            <Select
              fullWidth
              value={newFaq.faqCategory}
              onChange={(e) => setNewFaq({ ...newFaq, faqCategory: e.target.value as FaqCategory })}
            >
              {Object.values(FaqCategory).map((cat) => (
                <MenuItem key={cat} value={cat}>{cat}</MenuItem>
              ))}
            </Select>
            <TextField
              label="Question"
              fullWidth
              multiline
              rows={2}
              value={newFaq.faqQuestion}
              onChange={(e) => setNewFaq({ ...newFaq, faqQuestion: e.target.value })}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Answer"
              fullWidth
              multiline
              rows={4}
              value={newFaq.faqAnswer}
              onChange={(e) => setNewFaq({ ...newFaq, faqAnswer: e.target.value })}
              InputLabelProps={{ shrink: true }}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button variant={"contained"} onClick={createFaqHandler}>Create</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

FaqArticles.defaultProps = {
  initialInquiry: { page: 1, limit: 20, search: {} },
};

export default withAdminLayout(FaqArticles);
