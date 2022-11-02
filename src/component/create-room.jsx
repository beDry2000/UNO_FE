import React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { useNavigate } from "react-router-dom";

import { useState } from "react";

import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { joinRoom, setCurrentUser } from "../features/room/roomSlice";
import { useEffect } from "react";
import { logout, deleteUser } from "../features/user/userSlice";
import { reset, createRoom } from "../features/room/roomSlice";
import { resetGame } from "../features/game/gameSlice";

import { ThemeProvider, createTheme } from '@mui/material/styles'
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

function CreateRoom() {
  const [roomId, setRoomId] = useState();

 
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.user);
  const { roomCode, alert, isLoading, isError, isSuccess } = useSelector(
    (state) => state.room
  );
  useEffect(() => {
    if (isError) {
      toast.error(alert);
    }

    if (isSuccess) {
      navigate("/game/" + roomCode);
    }
    dispatch(reset());
  }, [alert, isError, isSuccess]);

  const handleJoin = () => {
    dispatch(joinRoom({ roomCode: roomId }));
    dispatch(setCurrentUser(user));
    dispatch(resetGame());
  };

  const handleCreateRoom = () => {
    dispatch(createRoom());
    dispatch(setCurrentUser(user));
    dispatch(resetGame());
  };

  const handleLogout = () => {
    if (user.isGuest) {
      dispatch(deleteUser());
    }
    dispatch(resetGame());
    dispatch(logout());
    navigate("/");
  };


  return (
    <>
      <div className="with-50 center ">
        <div>
          <h1 className="title">CHỌN PHÒNG</h1>
        </div>
        <div className="flex-col mb20 gap20px">
          <ThemeProvider theme={darkTheme}>
          <TextField
            className="z-Index20"
            id="standard-basic"
            label="Nhập mã phòng"
            variant="standard"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
          />
          </ThemeProvider>
          <Button
            variant="contained"
            color="success"
            style={{ borderRadius: "20px" }}
            className="z-Index20"
            onClick={handleJoin}
          >
            Vào phòng
          </Button>
        </div>
        <div className="flex-col mb20">
          <Button
            variant="contained"
            color="success"
            style={{ borderRadius: "20px" }}
            className="z-Index20"
            onClick={handleCreateRoom}
          >
            Tạo phòng
          </Button>
        </div>
      </div>
    </>
  );
}

export default CreateRoom;
