import React, { useState } from "react";
import {
  Box,
  Button,
  Stack,
  TextField,
  Typography,
  ToggleButton,
  ToggleButtonGroup,
  Autocomplete,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { useMutation, useLazyQuery } from "@apollo/client";
import { SEND_NOTICE_TO_ALL_BY_ADMIN, SEND_NOTIFICATION_BY_ADMIN } from "../../../../apollo/user/mutation";
import { GET_ALL_MEMBERS_BY_ADMIN } from "../../../../apollo/user/query";
import { sweetErrorHandling, sweetTopSmallSuccessAlert } from "../../../sonner";
import { Member } from "../../../types/member/member";

interface NoticeFormProps {
  onCreated?: () => void;
}

const NoticeForm = ({ onCreated }: NoticeFormProps) => {
  const [mode, setMode] = useState<"all" | "single">("all");
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [selectedUser, setSelectedUser] = useState<Member | null>(null);
  const [searchText, setSearchText] = useState("");

  const [sendToAll, { loading: loadingAll }] = useMutation(SEND_NOTICE_TO_ALL_BY_ADMIN);
  const [sendToUser, { loading: loadingSingle }] = useMutation(SEND_NOTIFICATION_BY_ADMIN);

  const [fetchMembers, { data: membersData, loading: loadingMembers }] = useLazyQuery(
    GET_ALL_MEMBERS_BY_ADMIN,
    { fetchPolicy: "network-only" },
  );

  const members: Member[] = membersData?.getAllMembersByAdmin?.list ?? [];
  const loading = loadingAll || loadingSingle;

  const handleSearch = (text: string) => {
    setSearchText(text);
    if (text.trim().length >= 1) {
      fetchMembers({
        variables: {
          input: { page: 1, limit: 10, sort: "createdAt", direction: "DESC", search: { text } },
        },
      });
    }
  };

  const submitHandler = async () => {
    if (!title.trim()) return;
    if (mode === "single" && !selectedUser) return;
    try {
      if (mode === "all") {
        await sendToAll({
          variables: {
            input: {
              notificationTitle: title.trim(),
              notificationDesc: desc.trim() || undefined,
            },
          },
        });
        await sweetTopSmallSuccessAlert("Notice sent to all users!", 1500);
      } else {
        await sendToUser({
          variables: {
            input: {
              receiverId: selectedUser!._id,
              notificationTitle: title.trim(),
              notificationDesc: desc.trim() || undefined,
            },
          },
        });
        await sweetTopSmallSuccessAlert(`Notice sent to ${selectedUser!.memberNick}!`, 1500);
      }
      setTitle("");
      setDesc("");
      setSelectedUser(null);
      setSearchText("");
      onCreated?.();
    } catch (err: any) {
      sweetErrorHandling(err).then();
    }
  };

  return (
    <Box
      component={"div"}
      sx={{
        background: "#fff",
        borderRadius: 2,
        p: 3,
        mb: 3,
        boxShadow:
          "rgb(145 158 171 / 20%) 0px 0px 2px 0px, rgb(145 158 171 / 12%) 0px 12px 24px -4px",
      }}
    >
      <Stack direction={"row"} alignItems={"center"} justifyContent={"space-between"} sx={{ mb: 2 }}>
        <Typography sx={{ fontWeight: 600, fontSize: 15, color: "#374151" }}>
          Send Notice
        </Typography>
        <ToggleButtonGroup
          value={mode}
          exclusive
          size={"small"}
          onChange={(_, val) => { if (val) { setMode(val); setSelectedUser(null); setSearchText(""); } }}
        >
          <ToggleButton value={"all"} sx={{ fontSize: 12, px: 2, textTransform: "none" }}>
            All Users
          </ToggleButton>
          <ToggleButton value={"single"} sx={{ fontSize: 12, px: 2, textTransform: "none" }}>
            Specific User
          </ToggleButton>
        </ToggleButtonGroup>
      </Stack>

      <Stack gap={2}>
        {mode === "single" && (
          <Autocomplete
            options={members}
            loading={loadingMembers}
            value={selectedUser}
            onChange={(_, val) => setSelectedUser(val)}
            inputValue={searchText}
            onInputChange={(_, val) => handleSearch(val)}
            getOptionLabel={(option) => `${option.memberNick} (${option.memberPhone ?? ""})`}
            isOptionEqualToValue={(opt, val) => opt._id === val._id}
            noOptionsText={"No users found"}
            renderInput={(params) => (
              <TextField
                {...params}
                size={"small"}
                placeholder={"Search user by nick..."}
                InputLabelProps={{ shrink: true }}
              />
            )}
          />
        )}

        <TextField
          size={"small"}
          fullWidth
          placeholder={"Notice title..."}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <Stack direction={"row"} gap={2} alignItems={"flex-end"}>
          <TextField
            size={"small"}
            fullWidth
            multiline
            rows={2}
            placeholder={"Notice description (optional)..."}
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
          />
          <Button
            variant={"contained"}
            disabled={loading || !title.trim() || (mode === "single" && !selectedUser)}
            onClick={submitHandler}
            sx={{
              height: 56,
              minWidth: 100,
              background: "#e92c28",
              "&:hover": { background: "#c9201d" },
              textTransform: "none",
            }}
            endIcon={<SendIcon />}
          >
            Send
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
};

export default NoticeForm;
