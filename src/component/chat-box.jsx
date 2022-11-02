import React, { useEffect, useRef, useState } from "react";
import SendIcon from "@mui/icons-material/Send";
import CloseIcon from "@mui/icons-material/Close";
import InsertCommentIcon from "@mui/icons-material/InsertComment";
import Fab from "@mui/material/Fab";
import { useSelector } from "react-redux";
import Badge from "@mui/material/Badge";
import Tooltip from "@mui/material/Tooltip";

function ChatBox({ onSendMessage }) {
  const chatBox = useRef();
  const [message, setMessage] = useState("");
  const [showChat, setShowChat] = useState(false);
  const { user } = useSelector((state) => state.user);
  const { messages } = useSelector((state) => state.game);
  const [count, setCount] = useState(0);
  const gameStat = useSelector((state) => state.game);
  const {turn} = gameStat;
  console.log(user);
  console.log(turn);
  useEffect(() => {
    if (messages.length > 0) {
      setCount((prev) => prev + 1);
      console.log(chatBox);
      if (chatBox.current) {
        chatBox.current.scrollTop = chatBox.current.scrollHeight;
      }
    }
  }, [messages]);

  const handleSend = (mess) => {
    setMessage("");
    onSendMessage(mess);
  };
  return (
    <>
      {showChat ? (
        <div className="chat-box-container">
          <div className="chat-box-top">
            <CloseIcon
              onClick={() => {
                setShowChat((pre) => !pre);
                setCount(0);
              }}
              style={{ marginRight: "10px" }}
              className="hover-icon"
              color="primary"
            />
          </div>

          <div className="chat-box-main" ref={chatBox}>
            {messages.map((messageItem, index) => (
              <>
                <Tooltip title={messageItem.time} placement="bottom">
                  <div
                    className={
                      user.userName !== messageItem.userName
                        ? "left-chat"
                        : "right-chat"
                    }
                  >
                    <div
                      className={
                        user.userName !== messageItem.userName
                          ? "chat-item"
                          : "main-player-chat"
                      }
                      key={index}
                    >
                      {user.userName !== messageItem.userName ? (
                        <>
                          {" "}
                          {messageItem.userName}: {messageItem.message}
                        </>
                      ) : (
                        <>{messageItem.message}</>
                      )}
                    </div>
                  </div>
                </Tooltip>
              </>
            ))}
          </div>

          <div className="chat-box-bot">
            <input
              className="input-chat"
              placeholder="Nhắn tin ở đây..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  handleSend(e.target.value);
                }
                // if (e.key === 'Esc') {
                //   setShowChat(false)
                // }
                setCount(0);
              }}
            />
            <SendIcon
              className="hover-icon"
              color="primary"
              onClick={() => handleSend(message)}
            />
          </div>
        </div>
      ) : (
        <div className="bot-left">
          <Badge color="secondary" badgeContent={count}>
            <Fab
              onClick={() => {
                setShowChat((pre) => !pre);
                setCount(0);
              }}
              color="primary"
              aria-label="add"
            >
              <InsertCommentIcon />
            </Fab>
          </Badge>
        </div>
      )}
    </>
  );
}
export default ChatBox;
