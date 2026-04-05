import React from "react";
import Link from "next/link";
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
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import { Stack } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { Perfume } from "../../../types/perfume/perfume";
import { REACT_APP_API_URL } from "../../../config";
import { PerfumeStatus } from "../../../enums/perfume.enum";

const headCells = [
  { id: "id", label: "PERFUME ID", numeric: true },
  { id: "title", label: "TITLE", numeric: true },
  { id: "price", label: "PRICE", numeric: true },
  { id: "brand", label: "BRAND", numeric: true },
  { id: "type", label: "TYPE", numeric: true },
  { id: "agent", label: "AGENT", numeric: true },
  { id: "status", label: "STATUS", numeric: false },
];

function PerfumeTableHead() {
  return (
    <TableHead>
      <TableRow>
        {headCells.map((cell) => (
          <TableCell key={cell.id} align={cell.numeric ? "left" : "center"}>
            {cell.label}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

interface PerfumePanelListType {
  perfumes: Perfume[];
  anchorEl: any;
  menuIconClickHandler: any;
  menuIconCloseHandler: any;
  updatePerfumeHandler: any;
  removePerfumeHandler: any;
}

export const PerfumePanelList = (props: PerfumePanelListType) => {
  const {
    perfumes,
    anchorEl,
    menuIconClickHandler,
    menuIconCloseHandler,
    updatePerfumeHandler,
    removePerfumeHandler,
  } = props;

  return (
    <Stack>
      <TableContainer>
        <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle" size={"medium"}>
          <PerfumeTableHead />
          <TableBody>
            {perfumes?.length === 0 && (
              <TableRow>
                <TableCell align="center" colSpan={7}>
                  <span className={"no-data"}>data not found!</span>
                </TableCell>
              </TableRow>
            )}

            {perfumes?.map((perfume: Perfume) => {
              const perfumeImage = perfume.perfumeImages?.[0]
                ? `${REACT_APP_API_URL}/${perfume.perfumeImages[0]}`
                : "/img/banner/smoke.webp";

              return (
                <TableRow
                  hover
                  key={perfume._id}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell align="left">{perfume._id}</TableCell>

                  <TableCell align="left" className={"name"}>
                    {perfume.perfumeStatus === PerfumeStatus.ACTIVE ? (
                      <Stack direction={"row"} alignItems={"center"}>
                        <Link href={`/perfume/detail?id=${perfume._id}`}>
                          <Avatar
                            alt={perfume.perfumeTitle}
                            src={perfumeImage}
                            sx={{ ml: "2px", mr: "10px" }}
                          />
                        </Link>
                        <Link href={`/perfume/detail?id=${perfume._id}`}>
                          <span>{perfume.perfumeTitle}</span>
                        </Link>
                      </Stack>
                    ) : (
                      <Stack direction={"row"} alignItems={"center"}>
                        <Avatar
                          alt={perfume.perfumeTitle}
                          src={perfumeImage}
                          sx={{ ml: "2px", mr: "10px" }}
                        />
                        <span>{perfume.perfumeTitle}</span>
                      </Stack>
                    )}
                  </TableCell>

                  <TableCell align="left">${perfume.perfumePrice}</TableCell>
                  <TableCell align="left">{perfume.perfumeBrand}</TableCell>
                  <TableCell align="left">{perfume.perfumeType}</TableCell>

                  <TableCell align="left" className={"name"}>
                    <Link href={`/member?memberId=${perfume.memberData?._id}`}>
                      <Stack direction={"row"} alignItems={"center"}>
                        <Avatar
                          alt={perfume.memberData?.memberNick}
                          src={
                            perfume.memberData?.memberImage
                              ? `${REACT_APP_API_URL}/${perfume.memberData.memberImage}`
                              : "/img/profile/defaultUser.svg"
                          }
                          sx={{ ml: "2px", mr: "10px", width: 28, height: 28 }}
                        />
                        <span>{perfume.memberData?.memberNick}</span>
                      </Stack>
                    </Link>
                  </TableCell>

                  <TableCell align="center">
                    {perfume.perfumeStatus === PerfumeStatus.DELETED ? (
                      <Button
                        variant="outlined"
                        sx={{ p: "3px", border: "none", ":hover": { border: "1px solid #000" } }}
                        onClick={() => removePerfumeHandler(perfume._id)}
                      >
                        <DeleteIcon fontSize="small" />
                      </Button>
                    ) : (
                      <>
                        <Button
                          onClick={(e: any) => menuIconClickHandler(e, perfume._id)}
                          className={
                            perfume.perfumeStatus === PerfumeStatus.ACTIVE
                              ? "badge success"
                              : "badge warning"
                          }
                        >
                          {perfume.perfumeStatus}
                        </Button>
                        <Menu
                          className={"menu-modal"}
                          MenuListProps={{ "aria-labelledby": "fade-button" }}
                          anchorEl={anchorEl[perfume._id]}
                          open={Boolean(anchorEl[perfume._id])}
                          onClose={menuIconCloseHandler}
                          TransitionComponent={Fade}
                          sx={{ p: 1 }}
                        >
                          {Object.values(PerfumeStatus)
                            .filter((s) => s !== perfume.perfumeStatus)
                            .map((status) => (
                              <MenuItem
                                key={status}
                                onClick={() =>
                                  updatePerfumeHandler({ _id: perfume._id, perfumeStatus: status })
                                }
                              >
                                <Typography variant={"subtitle1"} component={"span"}>
                                  {status}
                                </Typography>
                              </MenuItem>
                            ))}
                        </Menu>
                      </>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Stack>
  );
};
