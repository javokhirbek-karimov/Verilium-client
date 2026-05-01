import React, { useCallback, useEffect, useRef, useState } from "react";
import { Avatar, Box, Stack } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import Badge from "@mui/material/Badge";
import CloseFullscreenIcon from "@mui/icons-material/CloseFullscreen";
import MarkChatUnreadIcon from "@mui/icons-material/MarkChatUnread";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import { useRouter } from "next/router";
import ScrollableFeed from "react-scrollable-feed";
import { useReactiveVar } from "@apollo/client";
import {
  socketVar,
  userVar,
  memberMessagesVar,
  aiMessagesVar,
  onlineUsersVar,
  MemberMessage,
  AiMessage,
} from "../../apollo/store";
import { REACT_APP_API_URL, Messages } from "../config";
import { sweetErrorAlert } from "../sonner";

type ChatMode = "ai" | "members";

function formatTime(date: Date) {
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function uid() {
  return Math.random().toString(36).slice(2, 9);
}

/* ─── Typing dots ─── */
const TypingIndicator = () => (
  <Box
    flexDirection={"row"}
    style={{ display: "flex", alignItems: "center", gap: 8 }}
    sx={{ m: "6px 0px" }}
    component={"div"}
  >
    <Avatar
      alt={"AI"}
      sx={{ width: 28, height: 28, bgcolor: "#33c1c1", flexShrink: 0 }}
    >
      <SmartToyIcon sx={{ fontSize: 16 }} />
    </Avatar>
    <div className={"msg-left ai-typing"}>
      <span />
      <span />
      <span />
    </div>
  </Box>
);

/* ─── AI bubble ─── */
const AiBubble = ({ msg }: { msg: AiMessage }) => {
  if (msg.type === "user") {
    return (
      <Box
        component={"div"}
        flexDirection={"row"}
        style={{ display: "flex" }}
        alignItems={"flex-end"}
        justifyContent={"flex-end"}
        sx={{ m: "6px 0px" }}
      >
        <div className={"msg-meta-right"}>
          <span className={"msg-time"}>{msg.timestamp}</span>
        </div>
        <div className={"msg-right"}>{msg.text}</div>
      </Box>
    );
  }

  return (
    <Box
      flexDirection={"row"}
      style={{ display: "flex", alignItems: "flex-end", gap: 6 }}
      sx={{ m: "6px 0px" }}
      component={"div"}
    >
      <Avatar
        alt={"AI Agent"}
        sx={{ width: 28, height: 28, bgcolor: "#33c1c1", flexShrink: 0 }}
      >
        <SmartToyIcon sx={{ fontSize: 16 }} />
      </Avatar>
      <div className={"msg-bubble-left"}>
        <div className={"msg-left ai-msg"}>{msg.text}</div>
        <span className={"msg-time"}>{msg.timestamp}</span>
      </div>
    </Box>
  );
};

/* ─── Member bubble ─── */
const MemberBubble = ({
  msg,
  isOwn,
}: {
  msg: MemberMessage;
  isOwn: boolean;
}) => {
  const memberImage = msg.memberData?.memberImage
    ? `${REACT_APP_API_URL}/${msg.memberData.memberImage}`
    : "/img/profile/defaultUser.svg";

  if (isOwn) {
    return (
      <Box
        component={"div"}
        flexDirection={"row"}
        style={{ display: "flex" }}
        alignItems={"flex-end"}
        justifyContent={"flex-end"}
        sx={{ m: "6px 0px" }}
      >
        <div className={"msg-right"}>{msg.text}</div>
      </Box>
    );
  }

  return (
    <Box
      flexDirection={"row"}
      style={{ display: "flex", alignItems: "flex-end", gap: 6 }}
      sx={{ m: "6px 0px" }}
      component={"div"}
    >
      <Avatar
        alt={msg.memberData?.memberNick || "User"}
        src={memberImage}
        sx={{ width: 28, height: 28, flexShrink: 0 }}
      />
      <div className={"msg-bubble-left"}>
        <span className={"msg-sender"}>{msg.memberData?.memberNick}</span>
        <div className={"msg-left"}>{msg.text}</div>
      </div>
    </Box>
  );
};

const Chat = () => {
  const router = useRouter();
  const socket = useReactiveVar(socketVar);
  const user = useReactiveVar(userVar);

  const [open, setOpen] = useState(false);
  const [openButton, setOpenButton] = useState(false);
  const [chatMode, setChatMode] = useState<ChatMode>("members");
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [message, setMessage] = useState("");
  const onlineUsers = useReactiveVar(onlineUsersVar);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isAiTyping, setIsAiTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const aiHistoryLoaded = useRef(false);

  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: "instant" });
  };

  const memberMessages = useReactiveVar(memberMessagesVar);
  const aiMessages = useReactiveVar(aiMessagesVar);

  useEffect(() => {
    if (!socket) return;

    socket.onmessage = (msg: MessageEvent) => {
      const data = JSON.parse(msg.data);

      switch (data.event) {
        case "info": {
          onlineUsersVar(data.totalClients);
          break;
        }
        case "getMessages": {
          memberMessagesVar(data.list ?? []);
          break;
        }
        case "message": {
          memberMessagesVar([...memberMessagesVar(), data]);
          if (!open || chatMode !== "members") {
            setUnreadCount((prev) => prev + 1);
          }
          break;
        }
        case "ai-message": {
          setIsAiTyping(false);
          const aiReply: AiMessage = {
            id: uid(),
            type: "ai",
            text: data.text ?? "Sorry, I could not process that.",
            timestamp: formatTime(new Date()),
          };
          aiMessagesVar([...aiMessagesVar(), aiReply]);
          if (!open || chatMode !== "ai") {
            setUnreadCount((prev) => prev + 1);
          }
          break;
        }
        case "ai-history": {
          const welcome = aiMessagesVar()[0];
          const history: AiMessage[] = (data.list ?? []).map((item: any) => ({
            id: uid(),
            type: item.role === "user" ? "user" : "ai",
            text: item.text,
            timestamp: item.createdAt
              ? formatTime(new Date(item.createdAt))
              : "",
          }));
          aiMessagesVar([welcome, ...history]);
          aiHistoryLoaded.current = true;
          break;
        }
        case "ai-error": {
          setIsAiTyping(false);
          sweetErrorAlert(data.message ?? "AI error occurred.");
          break;
        }
      }
    };

    return () => {
      socket.onmessage = null;
    };
  }, [socket, chatMode, open, chatMode]);

  useEffect(() => {
    setOpenButton(false);
    const t = setTimeout(() => setOpenButton(true), 100);
    return () => clearTimeout(t);
  }, [router.pathname]);

  /* ── Scroll to bottom when chat opens (after CSS transition 500ms) ── */
  useEffect(() => {
    if (open) {
      setUnreadCount(0);
      const t = setTimeout(scrollToBottom, 520);
      return () => clearTimeout(t);
    }
  }, [open]);

  /* ── Scroll to bottom on new messages / AI typing ── */
  useEffect(() => {
    if (open && chatMode === "members") scrollToBottom();
  }, [memberMessages]);

  useEffect(() => {
    if (open && chatMode === "ai") scrollToBottom();
  }, [aiMessages, isAiTyping]);

  /* ── Scroll to bottom on mode switch (after transition 250ms) ── */
  useEffect(() => {
    if (open) {
      const t = setTimeout(scrollToBottom, 260);
      return () => clearTimeout(t);
    }
  }, [chatMode]);

  /* ── Handlers ── */
  const handleOpenChat = () => setOpen((prev) => !prev);

  const getInputMessageHandler = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setMessage(e.target.value);
    },
    [],
  );

  const getKeyHandler = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") onClickHandler();
  };

  const sendMemberMessage = () => {
    if (!socket || socket.readyState !== WebSocket.OPEN) {
      sweetErrorAlert("Connection lost. Please refresh the page.");
      return;
    }
    if (!message.trim()) {
      sweetErrorAlert(Messages.error4);
      return;
    }
    socket.send(JSON.stringify({ event: "message", data: message.trim() }));
    setMessage("");
  };

  const sendAiMessage = () => {
    if (!socket || socket.readyState !== WebSocket.OPEN) {
      sweetErrorAlert("Connection lost. Please refresh the page.");
      return;
    }
    if (!message.trim()) {
      sweetErrorAlert(Messages.error4);
      return;
    }
    const userMsg: AiMessage = {
      id: uid(),
      type: "user",
      text: message.trim(),
      timestamp: formatTime(new Date()),
    };
    aiMessagesVar([...aiMessagesVar(), userMsg]);
    setIsAiTyping(true);
    setMessage("");

    socket.send(JSON.stringify({ event: "ai-message", data: message.trim() }));
  };

  const onClickHandler = () => {
    if (chatMode === "ai") sendAiMessage();
    else sendMemberMessage();
  };

  const switchMode = (mode: ChatMode) => {
    if (mode === chatMode) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setChatMode(mode);
      setIsTransitioning(false);
      // Load AI history once when switching to AI tab
      if (mode === "ai" && !aiHistoryLoaded.current && socket?.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify({ event: "ai-history" }));
      }
    }, 250);
  };

  return (
    <Stack className="chatting">
      {openButton && (
        <button className="chat-button" onClick={handleOpenChat}>
          {open ? (
            <CloseFullscreenIcon />
          ) : (
            <Badge
              badgeContent={unreadCount || null}
              color="error"
              overlap="circular"
            >
              <MarkChatUnreadIcon />
            </Badge>
          )}
        </button>
      )}

      <Stack className={`chat-frame ${open ? "open" : ""}`}>
        {/* Header */}
        <Box className={"chat-top"} component={"div"}>
          <div className={"chat-top-title"} style={{ fontFamily: "Nunito" }}>
            {chatMode === "ai" ? "AI Assistant" : "Online Chat"}
          </div>
          {chatMode === "members" && (
            <div className={"online-badge"}>
              <span className={"online-dot"} />
              <span className={"online-count"}>{onlineUsers} online</span>
            </div>
          )}
        </Box>

        {/* Mode Tabs */}
        <Box className={"chat-mode-tabs"} component={"div"}>
          <button
            className={`chat-tab ${chatMode === "members" ? "active" : ""}`}
            onClick={() => switchMode("members")}
          >
            <PeopleAltIcon sx={{ fontSize: 14 }} />
            Members
          </button>
          <button
            className={`chat-tab ${chatMode === "ai" ? "active" : ""}`}
            onClick={() => switchMode("ai")}
          >
            <SmartToyIcon sx={{ fontSize: 14 }} />
            AI Agent
          </button>
        </Box>

        {/* Messages */}
        <Box
          className={`chat-content ${isTransitioning ? "transitioning" : ""}`}
          id="chat-content"
          component={"div"}
        >
          <ScrollableFeed>
            <Stack className={"chat-main"}>
              {chatMode === "members" ? (
                <>
                  <div className={"welcome"}>— Welcome to Live chat! —</div>
                  {memberMessages.map((msg, i) => (
                    <MemberBubble
                      key={`${msg.memberData?._id ?? "x"}-${i}`}
                      msg={msg}
                      isOwn={msg.memberData?._id === user?._id}
                    />
                  ))}
                </>
              ) : (
                <>
                  {aiMessages.map((msg) => (
                    <AiBubble key={msg.id} msg={msg} />
                  ))}
                  {isAiTyping && <TypingIndicator />}
                </>
              )}
              <div ref={bottomRef} />
            </Stack>
          </ScrollableFeed>
        </Box>

        {/* Input */}
        <Box
          className={`chat-bott ${isTransitioning ? "transitioning" : ""}`}
          component={"div"}
        >
          <div className={"chat-input-row"}>
            <input
              type={"text"}
              name={"message"}
              className={"msg-input"}
              placeholder={
                chatMode === "ai"
                  ? "Ask about perfumes..."
                  : "Type a message..."
              }
              value={message}
              onChange={getInputMessageHandler}
              onKeyDown={getKeyHandler}
              disabled={isAiTyping}
            />
            <button
              className={"send-msg-btn"}
              onClick={onClickHandler}
              disabled={isAiTyping || !message.trim()}
            >
              <SendIcon style={{ color: "#fff" }} />
            </button>
          </div>
        </Box>
      </Stack>
    </Stack>
  );
};

export default Chat;
