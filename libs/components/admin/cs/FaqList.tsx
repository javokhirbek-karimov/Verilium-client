import React from "react";
import {
  TableCell,
  TableHead,
  TableBody,
  TableRow,
  Table,
  TableContainer,
  Button,
  Menu,
  Fade,
  MenuItem,
} from "@mui/material";
import Typography from "@mui/material/Typography";
import { Stack } from "@mui/material";
import { Faq } from "../../../types/cs/faq";
import { FaqStatus } from "../../../enums/faq.enum";

interface HeadCell {
  id: string;
  label: string;
  numeric: boolean;
}

const headCells: readonly HeadCell[] = [
  { id: "id", numeric: true, label: "FAQ ID" },
  { id: "category", numeric: true, label: "CATEGORY" },
  { id: "question", numeric: true, label: "QUESTION" },
  { id: "answer", numeric: false, label: "ANSWER" },
  { id: "status", numeric: false, label: "STATUS" },
];

function FaqTableHead() {
  return (
    <TableHead>
      <TableRow>
        {headCells.map((cell) => (
          <TableCell
            key={cell.id}
            align={cell.numeric ? "left" : "center"}
          >
            {cell.label}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

interface FaqPanelListType {
  faqs: Faq[];
  anchorEl: any;
  menuIconClickHandler: any;
  menuIconCloseHandler: any;
  updateFaqHandler: any;
  removeFaqHandler: any;
}

export const FaqPanelList = (props: FaqPanelListType) => {
  const {
    faqs,
    anchorEl,
    menuIconClickHandler,
    menuIconCloseHandler,
    updateFaqHandler,
    removeFaqHandler,
  } = props;

  return (
    <Stack>
      <TableContainer>
        <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle" size={"medium"}>
          <FaqTableHead />
          <TableBody>
            {faqs?.length === 0 && (
              <TableRow>
                <TableCell align="center" colSpan={5}>
                  <span className={"no-data"}>data not found!</span>
                </TableCell>
              </TableRow>
            )}

            {faqs?.map((faq: Faq) => (
              <TableRow
                hover
                key={faq._id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell align="left">{faq._id}</TableCell>

                <TableCell align="left">
                  <span className={"badge success"} style={{ padding: "3px 10px", fontSize: 11, borderRadius: 20, fontWeight: 600 }}>
                    {faq.faqCategory}
                  </span>
                </TableCell>

                <TableCell align="left" sx={{ maxWidth: 220 }}>
                  <Typography
                    noWrap
                    sx={{ fontSize: 14, maxWidth: 200 }}
                    title={faq.faqQuestion}
                  >
                    {faq.faqQuestion}
                  </Typography>
                </TableCell>

                <TableCell align="center" sx={{ maxWidth: 280 }}>
                  <Typography
                    noWrap
                    sx={{ fontSize: 14, maxWidth: 260 }}
                    title={faq.faqAnswer}
                  >
                    {faq.faqAnswer}
                  </Typography>
                </TableCell>

                <TableCell align="center">
                  <Button
                    onClick={(e: any) => menuIconClickHandler(e, faq._id)}
                    className={
                      faq.faqStatus === FaqStatus.ACTIVE
                        ? "badge success"
                        : "badge error"
                    }
                  >
                    {faq.faqStatus}
                  </Button>
                  <Menu
                    className={"menu-modal"}
                    MenuListProps={{ "aria-labelledby": "fade-button" }}
                    anchorEl={anchorEl[faq._id]}
                    open={Boolean(anchorEl[faq._id])}
                    onClose={menuIconCloseHandler}
                    TransitionComponent={Fade}
                    sx={{ p: 1 }}
                  >
                    {Object.values(FaqStatus)
                      .filter((s) => s !== faq.faqStatus)
                      .map((status) => (
                        <MenuItem
                          key={status}
                          onClick={() =>
                            updateFaqHandler({ _id: faq._id, faqStatus: status })
                          }
                        >
                          <Typography variant={"subtitle1"} component={"span"}>
                            {status}
                          </Typography>
                        </MenuItem>
                      ))}
                    <MenuItem onClick={() => removeFaqHandler(faq._id)}>
                      <Typography
                        variant={"subtitle1"}
                        component={"span"}
                        color={"error"}
                      >
                        DELETE
                      </Typography>
                    </MenuItem>
                  </Menu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Stack>
  );
};
