import { leaveRoom } from "../features/room/roomSlice";
import { updateUsers } from "../features/room/roomSlice";
import {
  resetGame,
  updateGame,
  updateMessage,
  initializeGame,
} from "../features/game/gameSlice";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
// import PopUp from "./PopUp";
import MainPlayer from "./main-player";
import EnemyCard from "./enemy-card";
import DrawCard from "./draw-card";
import ChooseColor from "./choose-color";
import ChatBox from "./chat-box";
import soundThrow from "../ass/sounds/Card-flip-sound-effect.mp3";
import errorSound from "../ass/sounds/Error-sound.mp3";
import uno from "../ass/sounds/uno-sound-1.mp3";
import drawCardFromDesk from "../ass/sounds/shuffling-cards-1.mp3";
import tiktak from "../ass/sounds/tik-tak.mp3";

import Button from "@mui/material/Button";
import LogoutIcon from "@mui/icons-material/Logout";
import Tooltip from "@mui/material/Tooltip";

function Board({ socket }) {
  const { roomCode } = useParams();
  const [text, setText] = useState(roomCode);

  const copy = async () => {
    toast.success("Đã copy");
    await navigator.clipboard.writeText(text);
  };
  const navigate = useNavigate();

  const { users } = useSelector((state) => state.room);
  const gameStat = useSelector((state) => state.game);
  const {
    turn,
    deckOfPlayers,
    currentColor,
    currentNumber,
    playedCardsPile,
    drawCardPile,
  } = gameStat;
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  // Sound Effects:
  useEffect(() => {
    new Audio(soundThrow).play();
  }, playedCardsPile);

  const drawCardDesk = () => {
    new Audio(drawCardFromDesk).play();
  };
  const errSound = () => {
    new Audio(errorSound).play();
  };

  const unoSound = () => {
    new Audio(uno).play();
  };


  const clockSound = () => {
    new Audio(tiktak).play();
  };

  // Listeners of socket instance
  useEffect(() => {
    socket.on("initGameState", (gameState) => {
      dispatch(initializeGame(gameState));
    });

    socket.on("updateGame", (gameState) => {
      dispatch(updateGame(gameState));
    });

    socket.on("message", (message) => {
      dispatch(updateMessage(formatMessage(message)));
    });

    socket.on("roomData", (payload) => {
      dispatch(updateUsers(payload));
    });

    socket.on('playSound', (payload) => {
      console.log(payload);
      playEffect(payload);
    })

    socket.on("leaveUser", () => {
      dispatch(resetGame());
    });
  }, []);

  const playEffect = (sound) => {
    if (sound.name === 'uno') {
      new Audio(uno).play();
    } else if (sound.name === 'draw') {
      new Audio(drawCardFromDesk).play();
    }
  }
  const handleLeave = () => {
    dispatch(leaveRoom());
    const newUsers = users.filter(({ _id }) => user.id !== _id);
    socket.emit("leaving", newUsers);
    navigate("/");
  };

  const formatMessage = ({ message, userName }) => {
    const date = new Date();

    return {
      message,
      userName,
      time: date.getHours() + ":" + date.getMinutes(),
    };
  };
  const sendMessage = (mess) => {
    if (mess) {
      socket.emit("message", { message: mess, userName: user.userName });
    }
  };

  const [isUnoPressed, setUnoPressed] = useState(false);
  const [popUp, setPopUp] = useState(false);
  const [colorChosen, setColorChosen] = useState("");
  const [specialCard, setSpecialCard] = useState("");
  // Utility
  const checkGameOver = (arr) => arr.length === 1;

  const checkWinner = (arr, player) => {
    return arr.length === 1 ? player : "";
  };

  const typeOfCard = (card) => {
    if (card.includes("skip")) {
      return "skip";
    } else if (card.includes("D2")) {
      return "draw2";
    } else if (card === "W") {
      return "wild";
    } else if (card === "D4W") {
      return "draw4wild";
    } else if (card.includes("_")) {
      return "reverse";
    } else {
      return "number";
    }
  };

  const isChangePlayer = (cardType) => {
    const changeTurnCarType = ["number", "wild", "draw4wild"];

    return changeTurnCarType.some((type) => type === cardType);
  };

  const closePopUp = (colorChoose) => {
    setColorChosen(colorChoose);
    setPopUp(false);
    onCardPlayedHandler(specialCard);
  };
  const onCardPlayedHandler = (played_card) => {
    if (turn !== user.id) {
      toast.warning("Not your turn yet");
      errSound();
      return;
    }
    let newObjectToEmit = {};
    const cardFromDeck = deckOfPlayers[turn]; // player1Deck || player2Deck;
    const otherDeck =
      gameStat[cardFromDeck === "player1Deck" ? "player2Deck" : "player1Deck"];
    const currentDeck = gameStat[cardFromDeck];

    const { _id: opponentId } = users.find((user) => user._id !== turn);
    const cardType = typeOfCard(played_card);

    const newPlayedCardPile = [played_card, ...playedCardsPile];
    const copiedDrawCardPile = [...drawCardPile];

    let colorOfPlayedCard;
    let numberOfPlayedCard;

    // If Wild ask for Color first else extract color from played_card
    if (cardType === "wild" || cardType === "draw4wild") {
      if (!colorChosen) {
        setPopUp(true);
        setSpecialCard(played_card);
        return;
      } else {
        colorOfPlayedCard = colorChosen;
        setColorChosen("");
        setSpecialCard("");
      }
    } else {
      colorOfPlayedCard = played_card[played_card.length - 1];
    }
    // GetNumber
    const getNumber = (cardStr) => {
      switch (cardType) {
        case "number":
          return cardStr[0];
        case "skip":
          return 404;
        case "reverse":
          return 301;
        case "draw2":
          return 252;
        case "wild":
          return 300;
        case "draw4wild":
          return 600;
        default:
          return "Uncaught cardType";
      }
    };
    numberOfPlayedCard = getNumber(played_card);
    // If match color or number
    if (
      colorOfPlayedCard === currentColor ||
      numberOfPlayedCard === currentNumber ||
      numberOfPlayedCard === 300 ||
      numberOfPlayedCard === 600
    ) {
      // Update turn
      const nextPlayer = isChangePlayer(cardType) ? opponentId : turn;

      // New Current Player Deck
      const newPlayerDeck = (() => {
        let isTakeOutCard = false;
        let newDeck = currentDeck.filter((card) => {
          // Discard from deck if
          // card is the played card
          // and havent take out card yet
          // in case of same card in Deck
          if (card == played_card && isTakeOutCard === false) {
            isTakeOutCard = true;
            return false;
          }
          return true;
        });
        // isForgetToUNO
        if (newDeck.length === 1 && !isUnoPressed) {
          toast.info("Forget to UNO. Draw 2 cards as penalty");
          newDeck.push(...copiedDrawCardPile.splice(-2));
        }
        return newDeck;
      })();
      // skip : No turn, new CurrentNumber,
      // Which player Deck to update
      newObjectToEmit = {
        ...newObjectToEmit,
        gameOver: checkGameOver(currentDeck),
        winner: checkWinner(currentDeck, turn),
        turn: nextPlayer,
        playedCardsPile: newPlayedCardPile,
        [cardFromDeck]: [...newPlayerDeck],
        currentColor: colorOfPlayedCard,
        currentNumber: numberOfPlayedCard,
        drawCardPile: [...copiedDrawCardPile],
      };

      // Update Other player if neccessary
      const updateOpponent = () => {
        let newDeck = [...otherDeck];

        if (cardType === "draw2") {
          newDeck.push(...copiedDrawCardPile.splice(-2));
        }
        if (cardType === "draw4wild") {
          newDeck.push(...copiedDrawCardPile.splice(-4));
        }
        return newDeck;
      };

      if (cardType === "draw2" || cardType === "draw4wild") {
        const otherDeckName =
          cardFromDeck === "player1Deck" ? "player2Deck" : "player1Deck";
        newObjectToEmit[otherDeckName] = updateOpponent();
        newObjectToEmit.drawCardPile = [...copiedDrawCardPile];
      }
      setUnoPressed(false);
      socket.emit("updateGameState", newObjectToEmit);
    } else {
      // if not match color || number
      toast.error("Invalid move");
      errSound();
      return;
    }
  };

  // Handle Drawcard
  const onCardDrawnHandler = (drawn_card) => {
    if (turn !== user.id) {
      toast.warning("Not your turn yet");
      errSound();
      return;
    }
    // if match then play ouright

    // player who draw card
    let newObjectToEmit = {};
    const cardDrawnBy = deckOfPlayers[turn]; // playerDeck1 ||| playerDeck2
    const otherDeck =
      gameStat[cardDrawnBy === "player1Deck" ? "player2Deck" : "player1Deck"];
    const currentDeck = gameStat[cardDrawnBy];
    const { _id: opponentId } = users.find((user) => user._id !== turn);

    // Card
    const cardType = typeOfCard(drawn_card);
    const copiedPlayedCardPile = [...playedCardsPile];
    const copiedDrawCardPile = [...drawCardPile];
    copiedDrawCardPile.shift();
    let colorOfDrawnCard;
    let numberOfDrawnCard;

    // If Wild ask for Color first else extract color from played_card
    if (cardType === "wild" || cardType === "draw4wild") {
      if (!colorChosen) {
        setPopUp(true);
        setSpecialCard(drawn_card);
        socket.emit("updateGameState", {
          drawCardPile: copiedDrawCardPile,
        });
        return;
      } else {
        colorOfDrawnCard = colorChosen;
        setColorChosen("");
        setSpecialCard("");
      }
    } else {
      colorOfDrawnCard = drawn_card[drawn_card.length - 1];
    }
    // GetNumber
    const getNumber = (cardStr) => {
      switch (cardType) {
        case "number":
          return cardStr[0];
        case "skip":
          return 404;
        case "reverse":
          return 301;
        case "draw2":
          return 252;
        case "wild":
          return 300;
        case "draw4wild":
          return 600;
        default:
          return "Uncaught cardType";
      }
    };
    numberOfDrawnCard = getNumber(drawn_card);
    // Check to drawn card
    if (
      colorOfDrawnCard === currentColor ||
      numberOfDrawnCard === currentNumber ||
      numberOfDrawnCard === 300 ||
      numberOfDrawnCard === 600
    ) {
      // Update turn
      const nextPlayer = isChangePlayer(cardType) ? opponentId : turn;
      // skip : No turn, new CurrentNumber,
      // Which player Deck to update
      newObjectToEmit = {
        ...newObjectToEmit,
        turn: nextPlayer,
        playedCardsPile: [drawn_card, ...copiedPlayedCardPile],
        currentColor: colorOfDrawnCard,
        currentNumber: numberOfDrawnCard,
        drawCardPile: [...copiedDrawCardPile],
      };
      // Update Other player if neccessary
      const updateOpponent = () => {
        let newDeck = [...otherDeck];
        if (cardType === "draw2") {
          newDeck.push(...copiedDrawCardPile.splice(-2));
        }
        if (cardType === "draw4wild") {
          newDeck.push(...copiedDrawCardPile.splice(-4));
        }
        return newDeck;
      };

      if (cardType === "draw2" || cardType === "draw4wild") {
        const otherDeckName =
          cardDrawnBy === "player1Deck" ? "player2Deck" : "player1Deck";
        newObjectToEmit[otherDeckName] = updateOpponent();
      }
      playSound('draw');
      socket.emit("updateGameState", newObjectToEmit);
    } else {
      // If not match any add to current player deck, remove from drawpile and change turn
      playSound('draw');
      socket.emit("updateGameState", {
        turn: opponentId,
        drawCardPile: copiedDrawCardPile,
        [cardDrawnBy]: [...currentDeck, drawn_card],
      });
    }
  };

  const [sec, setSec] = useState(20);

  const isChooseColor = (cardType) => {
    const chooseColorType = ["wild", "draw4wild"];
    return chooseColorType.some((type) => type === cardType);
  };

  // Draw 1 card and put it to current player only
  const draw1Card = () => {
    const cardDrawnBy = deckOfPlayers[turn]; // player1Deck || player2Deck
    const copyCurrentDeck = [...gameStat[cardDrawnBy]]; // array of card of cur player
    const copyDrawCardPile = [...drawCardPile];
    const { _id: nextTurn } = users.find((user) => user._id !== turn);
    copyCurrentDeck.push(copyDrawCardPile.shift());

    let newObjectToEmit = {
      turn: nextTurn,
      [cardDrawnBy]: copyCurrentDeck,
      drawCardPile: copyDrawCardPile,
    };
    socket.emit("updateGameState", newObjectToEmit);
  };

  const autoHandler = () => {
    // Check the first drawnCard
    const firstDrawnCard = drawCardPile[0];
    const cardType = typeOfCard(firstDrawnCard);

    // If not require current player's action
    if (isChangePlayer(cardType) && !isChooseColor(cardType)) {
      // Draw 1 card and play if possible
      onCardDrawnHandler(firstDrawnCard);
      socket.emit("message", {
        message: `Player ${user.userName} has autoplayed`,
        userName: 'Admin'
      });
    } // If require
    else {
      // Add 1 card to cur player and change turn
      draw1Card();
    }
  };
  useEffect(() => {
    // If countdown reaches 0 and current player didnot play anything
    // then auto play
    if (sec === 0 && turn === user.id) {
      // Some logic
      autoHandler();
    }
  }, [sec]);

  // Handle count down
  useEffect(() => {
    const time = setInterval(() => {
      setSec((pre) => pre - 1);
    }, 1000);
    if (sec === 0) {
      setSec(20);
    }
    return () => {
      clearInterval(time);
    };
  });

  // Recount when turn changes
  useEffect(() => {
    setSec(20);
  }, [turn]);

  const playSound = (soundName) => {
    socket.emit('playSound', { name: soundName });
  }

  return (
    <>
      <div className="bg-play" />
      <div className="header-play">
        {/* RoomCode */}
        <div>
          <Tooltip title="Bấm để chép mã phòng" placement="bottom">
            <div className="roomId  top-left" onClick={copy}>
              <h3>Mã phòng: {roomCode}</h3>
            </div>
          </Tooltip>
        </div>

        {/* Leave Room */}
        <div className="controller top-right">
          <div className="back-to-create">
            <h2>Xin chào {user.userName}</h2>
          </div>
          <Button
            variant="outlined"
            color="error"
            size="small"
            endIcon={<LogoutIcon />}
            onClick={handleLeave}
          >
            Thoát
          </Button>
        </div>
      </div>
      <div className="play-ground">
        {/* Show  Planyed Cards */}
        <div className={`card-throwed ${currentColor}`}>
          <img
            className="img-card-throwed"
            src={require(`../ass/cards-front/${playedCardsPile[0]}.png`)}
            alt=""
          />
        </div>

        {/* Show My Cards */}
        <div className="main-player-card">
          <div
            className={turn === user.id && `player-in-turn ${currentColor} `}
          >
            <MainPlayer
              socket={socket}
              onCardPlayedHandler={onCardPlayedHandler}
              onPressUno={() => {
                setUnoPressed(true);
              }}
            />
          </div>
        </div>

        {/* Show Enemy Card */}
        <div className="enemy-card">
          <EnemyCard />
        </div>

        {/* Clock if not used just toss it away*/}
        <div className="clock ">
          <div className={`clock-item ${currentColor}`}>
            <h3>{sec}</h3>
          </div>
        </div>

        <div className="draw-card-aria">
          <div
            onClick={() => {
              onCardDrawnHandler(drawCardPile[0]);
            }}
          >
            <DrawCard />
          </div>
          <div
            className="learn-more"
            onClick={() => {
              setUnoPressed(true);
              playSound('uno')
            }}
          >
            uno
          </div>
        </div>

        <div>
          <ChooseColor
            popUp={popUp}
            onClosePopUp={closePopUp}
            card={specialCard}
          />
        </div>

        <ChatBox onSendMessage={sendMessage} />
      </div>
    </>
  );
}
export default Board;
