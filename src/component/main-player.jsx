import { useSelector } from "react-redux";

function MainPlayer({ onCardPlayedHandler }) {

  const gameStat = useSelector((state) => state.game);
  const { deckOfPlayers } = gameStat;
  const { user } = useSelector(state => state.user);

  return (
    <>
      <div className="main-player-card-item z-Index20">
        {
          gameStat[deckOfPlayers[user.id]].map((card, index) => (
            <img
              key={index}
              onClick={() => { onCardPlayedHandler(card); }}
              className="img-card-throwed-main"
              src={require(`../ass/cards-front/${card}.png`)}
            />
          ))
        }
      </div>
    
    </>
  );
}
export default MainPlayer;
