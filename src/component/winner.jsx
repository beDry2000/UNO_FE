import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Card from "../ass/uno-wp/wp1.png";
import Button from '@mui/material/Button';
import { useSelector } from "react-redux";

import winnerSound from "../ass/sounds/winner.mp3";
import loseSound from "../ass/sounds/game-over-sound.mp3";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "auto",
  bgcolor: "brgb(236, 236, 24)",
  // border: '2px solid #000',
  // boxShadow: 24,
  height: "80vh",
  p: 1,
};
export default function Winner({onRestart, handleLeave}) {
  const [open, setOpen] = useState(true);

  const handleClose = () => {
    setOpen(false)
    // onRestart();
  };
  const { users } = useSelector(state => state.room);
  const { user } = useSelector((state) => state.user);
  const { winner } = useSelector(state => state.game);

  useEffect(() => {
    console.log('dang chay sound')
    if (winner && user._id === winner) {
      new Audio(winnerSound).play();
    } else if (winner && user.id !== winner) {
      new Audio(loseSound).play();
    }
  },[]);

  return (
    <>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div className="winner-div">
            <img className="winner-logo" src={Card} />
            <h1 className="title winner-title">
              {users.find(user => user._id === winner).userName}
            </h1>
          </div>
          <div className="after-win">
            <Button className="width-40" variant="contained" color="success"
            onClick={onRestart}
            >
              CHƠI TIẾP
            </Button>
            <Button className="width-40" variant="contained" color="error"
            onClick={handleLeave}
            >
              THOÁT
            </Button>
          </div>
        </Box>
      </Modal>
    </>
  );
}
