import {useState} from "react";
import Card from "../ass/card-back.png";
import Tooltip from "@mui/material/Tooltip";
import { useSelector } from "react-redux";
import ChooseColor from "./choose-color";
function DrawCard() {
  // const {drawCardPile} = useSelector(state => state.game);
  // console.log(drawCardPile[0])

  return (
    <>
      <Tooltip title="Bốc bài" placement="bottom-end">
        <div className="draw-box">
          <img className="draw-card" src={Card}/>
          <img className="draw-card  draw-card-2" src={Card} />
          <img className="draw-card  draw-card-3" src={Card} />
          <img className="draw-card  draw-card-4" src={Card} />
          <img className="draw-card  draw-card-5" src={Card} />
          {/* <img className="draw-card  draw-card-6" src={Card}/>
            <img className="draw-card  draw-card-7" src={Card}/> */}
        </div>
      </Tooltip>
    </>
  );
}
export default DrawCard;
