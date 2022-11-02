import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { leaveRoom } from "../features/room/roomSlice";
import { useSelector, useDispatch } from "react-redux";
import { updateUsers } from "../features/room/roomSlice";
import { toast } from "react-toastify";
import Tooltip from "@mui/material/Tooltip";
import Winner from "./winner";

import { initializeGame, updateGame } from "../features/game/gameSlice";

// import PACK_OF_CARDS from "../utils/packOfCards";
import shuffleArray from "../utils/shuffleArray";
import io from "socket.io-client";

import { useState } from "react";
import Board from "./board";
import ChatBox from "./chat-box";

const ENDPOINT = "http://localhost:5000";
let socket;

const Game = () => {
  const { roomCode } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Slice: roomSlice {roomCode, users, currentUser}
  const { user } = useSelector((state) => state.user);
  // const {roomCode} = useSelector((state) => state.room);
  const { users } = useSelector((state) => state.room);
  const { gameOver, winner } = useSelector((state) => state.game);

  const [text, setText] = useState(roomCode);

  const copy = async () => {
    toast.success("Đã copy");
    await navigator.clipboard.writeText(text);
  };

  useEffect(() => {
    const connectionOptions = {
      forceNew: true,
      reconnectionAttempts: "Infinity",
      timeout: 10000,
    };
    socket = io.connect(ENDPOINT, connectionOptions);

    socket.emit("join", roomCode);
    return () => {
      // const newUsers = users.filter(({ _id }) => user.id !== _id);
      // console.log("New users:", newUsers);
      // socket.emit("leaving", newUsers);
      socket.disconnect();
      socket.off();
    };
  }, []);

  // Listeners of socket instance
  useEffect(() => {
    socket.on("initGameState", (gameState) => {
      console.log("Start the Game", gameState);
      dispatch(initializeGame(gameState));
    });

    socket.on("updateGame", (gameState) => {
      dispatch(updateGame(gameState));
    });
    socket.on("roomData", (payload) => {
      console.log("Got room data", payload);
      dispatch(updateUsers(payload));
    });
  }, []);

  const handleLeave = () => {
    dispatch(leaveRoom());
    const newUsers = users.filter(({ _id }) => user.id !== _id);
    console.log("New users:", newUsers);
    socket.emit("leaving", newUsers);
    navigate("/");
  };

  // Initialize the game
  const handleStart = () => {
    if (users.length < 2) {
      toast.warning("Please find more players!");
    } else {
      //shuffle PACK_OF_CARDS array
      const shuffledCards = shuffleArray();
      const player1Deck = shuffledCards.splice(0, 7);
      const player2Deck = shuffledCards.splice(0, 7);
      let startingCardIndex;
      while (true) {
        startingCardIndex = Math.floor(Math.random() * 94);
        if (
          shuffledCards[startingCardIndex] === "skipR" ||
          shuffledCards[startingCardIndex] === "_R" ||
          shuffledCards[startingCardIndex] === "D2R" ||
          shuffledCards[startingCardIndex] === "skipG" ||
          shuffledCards[startingCardIndex] === "_G" ||
          shuffledCards[startingCardIndex] === "D2G" ||
          shuffledCards[startingCardIndex] === "skipB" ||
          shuffledCards[startingCardIndex] === "_B" ||
          shuffledCards[startingCardIndex] === "D2B" ||
          shuffledCards[startingCardIndex] === "skipY" ||
          shuffledCards[startingCardIndex] === "_Y" ||
          shuffledCards[startingCardIndex] === "D2Y" ||
          shuffledCards[startingCardIndex] === "W" ||
          shuffledCards[startingCardIndex] === "D4W"
        ) {
          continue;
        } else break;
      }
      const playedCardsPile = shuffledCards.splice(startingCardIndex, 1);
      const drawCardPile = shuffledCards;
      let deckOfPlayers = {};
      users.forEach(
        (user, index) => (deckOfPlayers[user._id] = `player${index + 1}Deck`)
      );

      //send initial state to server
      socket.emit("initGameState", {
        gameOver: false,
        turn: users[0]._id,
        deckOfPlayers: deckOfPlayers,
        player1Deck: [...player1Deck],
        player2Deck: [...player2Deck],
        currentColor: playedCardsPile[0].charAt(1),
        currentNumber: playedCardsPile[0].charAt(0),
        playedCardsPile: [...playedCardsPile],
        drawCardPile: [...drawCardPile],
        messages: [],
      });
    }
  };
  // const sendMessage = (mess) => {
  //   if (mess) {
  //     socket.emit("message", { message: mess, userName: user.userName });
  //   }
  // };
  return (
    <>
      {users.find((user) => user._id === winner) && (
        <Winner onRestart={handleStart} handleLeave={handleLeave} />
      )}
      {gameOver || users.length === 1 ? (
        <div className="bg-wait-room">
          <div className="header-wait">
            <div className="back-to-create">
              <h3 onClick={handleLeave}>TRỞ LẠI</h3>
            </div>
            <Tooltip title="Bấm để chép mã phòng" placement="bottom">
              <div className="roomId" onClick={copy}>
                <h3>Mã phòng: {roomCode}</h3>
              </div>
            </Tooltip>
            <div style={{width: "90px"}}></div>
          </div>
          <div className="wait-member-aria">
            {users.map((user) => (
              <div className="member" key={user._id}>
                <div className="member-avatar">
                  <img src={require("../ass/avatar.png")} />
                </div>
                <div className="member-name">
                  <div>
                    <h2>{user.userName}</h2>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="bottom-wait">
            <div className="ready-btn" onClick={handleStart}>
              <h2>ZÔ</h2>
            </div>
          </div>
        </div>
      ) : (
        <Board socket={socket} handleStart={handleStart} />
      )}
      {/* <ChatBox onSendMessage={sendMessage} /> */}
    </>
  );
};

export default Game;
