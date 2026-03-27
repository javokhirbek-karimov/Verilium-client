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

type ChatMode = "ai" | "members";

interface MessageItem {
  id: string;
  type: "left" | "right";
  text: string;
  senderName?: string;
  senderAvatar?: string;
  timestamp?: string;
  isAI?: boolean;
  isTyping?: boolean;
}

const TypingIndicator = () => (
  <Box
    flexDirection={"row"}
    style={{ display: "flex", alignItems: "center", gap: 8 }}
    sx={{ m: "6px 0px" }}
    component={"div"}
  >
    <Avatar
      alt={"AI"}
      src={"/img/profile/ai-agent.svg"}
      sx={{ width: 28, height: 28, bgcolor: "#33c1c1" }}
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

interface MessageBubbleProps {
  msg: MessageItem;
  mode: ChatMode;
}

const MessageBubble = ({ msg, mode }: MessageBubbleProps) => {
  if (msg.isTyping) return <TypingIndicator />;

  if (msg.type === "right") {
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
          {msg.timestamp && <span className={"msg-time"}>{msg.timestamp}</span>}
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
      {mode === "ai" ? (
        <Avatar
          alt={"AI Agent"}
          src={"/img/profile/ai-agent.svg"}
          sx={{ width: 28, height: 28, bgcolor: "#33c1c1", flexShrink: 0 }}
        >
          <SmartToyIcon sx={{ fontSize: 16 }} />
        </Avatar>
      ) : (
        <Avatar
          alt={msg.senderName || "User"}
          src={msg.senderAvatar || "/img/profile/defaultUser.svg"}
          sx={{ width: 28, height: 28, flexShrink: 0 }}
        />
      )}
      <div className={"msg-bubble-left"}>
        {mode === "members" && msg.senderName && (
          <span className={"msg-sender"}>{msg.senderName}</span>
        )}
        <div className={`msg-left ${mode === "ai" ? "ai-msg" : ""}`}>
          {msg.text}
        </div>
        {msg.timestamp && <span className={"msg-time"}>{msg.timestamp}</span>}
      </div>
    </Box>
  );
};

// ─── Main Chat Component ──────────────────────────────────────────────────────

const Chat = () => {
  const chatContentRef = useRef<HTMLDivElement>(null);
  const textInput = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [openButton, setOpenButton] = useState(false);
  const [chatMode, setChatMode] = useState<ChatMode>("members");
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [message, setMessage] = useState<string>("");
  const [onlineUsers, setOnlineUsers] = useState<number>(4);
  const [isAiTyping, setIsAiTyping] = useState(false);
  const [unreadCount, setUnreadCount] = useState<number>(0);

  // Member chat messages (socket-based in real usage)
  const [memberMessages, setMemberMessages] = useState<MessageItem[]>([
    {
      id: "m0",
      type: "left",
      text: "Welcome to Live chat!",
      senderName: "System",
      timestamp: "12:00",
    },
    {
      id: "m1",
      type: "right",
      text: "hi",
      timestamp: "12:01",
    },
    {
      id: "m2",
      type: "left",
      text: "Hi",
      senderName: "jonik",
      senderAvatar: "/img/profile/defaultUser.svg",
      timestamp: "12:01",
    },
  ]);

  const [aiMessages, setAiMessages] = useState<MessageItem[]>([
    {
      id: "ai0",
      type: "left",
      text: "Hello! I'm your AI assistant. Ask me anything about our perfumes",
      isAI: true,
      timestamp: formatTime(new Date()),
    },
  ]);

  useEffect(() => {
    setOpenButton(false);
    const timeoutId = setTimeout(() => setOpenButton(true), 100);
    return () => clearTimeout(timeoutId);
  }, [router.pathname]);

  useEffect(() => {
    if (!open) {
      // In real usage, increment from socket events
    } else {
      setUnreadCount(0);
    }
  }, [open]);

  function formatTime(date: Date) {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }

  function generateId() {
    return Math.random().toString(36).slice(2, 9);
  }

  const handleOpenChat = () => setOpen((prev) => !prev);

  const getInputMessageHandler = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setMessage(e.target.value);
    },
    [],
  );

  const getKeyHandler = (e: React.KeyboardEvent) => {
    try {
      if (e.key === "Enter") onClickHandler();
    } catch (err: any) {
      console.log(err);
    }
  };

  const sendMemberMessage = () => {
    if (!message.trim()) return;

    const newMsg: MessageItem = {
      id: generateId(),
      type: "right",
      text: message.trim(),
      timestamp: formatTime(new Date()),
    };

    setMemberMessages((prev) => [...prev, newMsg]);
    setMessage("");
    if (textInput.current) textInput.current.value = "";
  };

  const sendAiMessage = async () => {
    if (!message.trim()) return;

    const userMsg: MessageItem = {
      id: generateId(),
      type: "right",
      text: message.trim(),
      timestamp: formatTime(new Date()),
    };

    setAiMessages((prev) => [...prev, userMsg]);
    setMessage("");
    if (textInput.current) textInput.current.value = "";

    // Show typing indicator
    setIsAiTyping(true);

    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system:
            "You are a helpful perfume store assistant. Answer questions about perfumes, scents, recommendations, and purchases concisely and warmly.",
          messages: [
            ...[...aiMessages, userMsg]
              .filter((m) => !m.isTyping)
              .map((m) => ({
                role: m.type === "right" ? "user" : "assistant",
                content: m.text,
              })),
          ],
        }),
      });

      const data = await response.json();
      const replyText =
        data?.content?.[0]?.text ?? "Sorry, I couldn't process that.";

      const aiReply: MessageItem = {
        id: generateId(),
        type: "left",
        text: replyText,
        isAI: true,
        timestamp: formatTime(new Date()),
      };

      setAiMessages((prev) => [...prev, aiReply]);
    } catch (err) {
      console.error("AI chat error:", err);
      setAiMessages((prev) => [
        ...prev,
        {
          id: generateId(),
          type: "left",
          text: "Sorry, something went wrong. Please try again.",
          isAI: true,
          timestamp: formatTime(new Date()),
        },
      ]);
    } finally {
      setIsAiTyping(false);
    }
  };

  const switchMode = (mode: ChatMode) => {
    if (mode === chatMode) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setChatMode(mode);
      setIsTransitioning(false);
    }, 300);
  };

  const onClickHandler = () => {
    if (chatMode === "ai") {
      sendAiMessage();
    } else {
      sendMemberMessage();
    }
  };

  const currentMessages = chatMode === "ai" ? aiMessages : memberMessages;

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
        {/* ── Header ── */}
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

        {/* ── Mode Tabs ── */}
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

        {/* ── Messages ── */}
        <Box
          className={`chat-content ${isTransitioning ? "transitioning" : ""}`}
          id="chat-content"
          ref={chatContentRef}
          component={"div"}
        >
          <ScrollableFeed>
            <Stack className={"chat-main"}>
              {currentMessages.map((msg) => (
                <MessageBubble key={msg.id} msg={msg} mode={chatMode} />
              ))}

              {/* AI typing indicator */}
              {chatMode === "ai" && isAiTyping && <TypingIndicator />}
            </Stack>
          </ScrollableFeed>
        </Box>

        {/* ── Input ── */}
        <Box
          className={`chat-bott ${isTransitioning ? "transitioning" : ""}`}
          component={"div"}
        >
          {chatMode === "ai" && (
            <div className={"ai-hint"}>
              <SmartToyIcon sx={{ fontSize: 12 }} /> Powered by Claude AI
            </div>
          )}
          <div className={"chat-input-row"}>
            <input
              ref={textInput}
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
