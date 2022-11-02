import React from "react";
import Card from "../ass/card-back.png";
import PersonIcon from "@mui/icons-material/Person";
import { useSelector } from "react-redux";

const iconStyle = {
  transform: "scale(2)",
  marginTop: "30px",
  color: "#0971f1",
};

function EnemyCard() {
  const { users, currentUser } = useSelector((state) => state.room);
  const gameState = useSelector((state) => state.game);
  const { deckOfPlayers } = gameState;
  const opponent = users.find((user) => user._id !== currentUser.id);
  const opponentDeck = gameState[deckOfPlayers[opponent._id]];
  const gameStat = useSelector((state) => state.game);
  const { turn, currentColor } = gameState;
  const { user } = useSelector((state) => state.user);
  // console.log(opponentDeck)

  return (
    <>
      <div>
        <div className="enemy-info ">
          <PersonIcon style={iconStyle} />
          <h3>{opponent.userName}</h3>
        </div>
        <div className={turn !== user.id && `player-in-turn ${currentColor}`}>
          <div className="main-player-card-item">
            {Array(opponentDeck.length)
              .fill("card")
              .map((_) => (
                <img className="enemy-card-img" src={Card} />
              ))}
          </div>
        </div>
      </div>
    </>
  );
}
export default EnemyCard;
