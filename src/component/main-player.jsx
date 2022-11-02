import { useSelector } from "react-redux";

function MainPlayer({ onCardPlayedHandler, onPressUno }) {

  const gameStat = useSelector((state) => state.game);
  const { deckOfPlayers } = gameStat;
  const { user } = useSelector(state => state.user);
  console.log('Card of current use', gameStat[deckOfPlayers[user.id]]);

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
