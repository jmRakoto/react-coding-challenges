import React, { useContext, useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import useSound from "use-sound";
import config from "../../../config";
import LatestMessagesContext from "../../../contexts/LatestMessages/LatestMessages";
import TypingMessage from "./TypingMessage";
import Header from "./Header";
import Footer from "./Footer";
import Message from "./Message";
import "../styles/_messages.scss";

const socket = io.connect(config.BOT_SERVER_ENDPOINT, {
  transports: ["websocket", "polling", "flashsocket"],
});

function Messages() {
  const [playSend] = useSound(config.SEND_AUDIO_URL);
  const [playReceive] = useSound(config.RECEIVE_AUDIO_URL);
  const { setLatestMessage, messages } = useContext(LatestMessagesContext);
  const [message, setMessage] = useState("");
  const [typingMessage, setTypingMessage] = useState(false);
  const [listMessage, setListMessage] = useState([]);
  const ref = useRef();

  useEffect(() => {
    if (listMessage.length === 0) {
      setListMessage([
        ...listMessage,
        {
          id: listMessage.length,
          user: "bot",
          message: messages.bot,
        },
      ]);
    }
  }, []);

  useEffect(() => {
    if (ref.current) {
      ref.current.scrollTop = ref.current.scrollHeight;
    }
  }, [listMessage, typingMessage]);

  useEffect(() => {
    socket.on("bot-message", (message) => {
      setListMessage((prev) => [
        ...prev,
        {
          id: listMessage.length,
          user: "bot",
          message,
        },
      ]);
      setLatestMessage("bot", message);
      playReceive();
      setTypingMessage(false);
    });

    socket.on("bot-typing", () => {
      setTypingMessage(true);
    });
  }, []);

  const onChangeMessage = (e) => {
    const { name, value } = e.target;
    setMessage(value);
  };

  const sendMessage = () => {
    socket.emit("user-message", message);
    setListMessage([
      ...listMessage,
      {
        id: listMessage.length,
        user: "me",
        message,
      },
    ]);
    setLatestMessage("bot", message);
    setMessage("");
    playSend();
  };

  return (
    <div className="messages">
      <Header />
      <div className="messages__list" id="message-list" ref={ref}>
        {listMessage.map((data) => {
          return (
            <Message
              nextMessage={data}
              message={data}
              botTyping={typingMessage}
            />
          );
        })}
      </div>
      {typingMessage && <TypingMessage />}
      <Footer
        message={message}
        sendMessage={sendMessage}
        onChangeMessage={onChangeMessage}
      />
    </div>
  );
}

export default Messages;
