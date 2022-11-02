import React from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { logined } from "../features/status/StatusSlice";

import { useState, useEffect } from "react";
import { login } from "../features/user/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useNavigate, Link } from "react-router-dom";
import { reset } from "../features/user/userSlice";
import { createGuest } from "../features/user/userSlice";

import { ThemeProvider, createTheme } from '@mui/material/styles'
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

function Guest() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isLoading, isSuccess, isError, message } = useSelector(
    (store) => store.user
  );

  const [userName, setUserName] = useState('');
  const handleGuest = () => {
    dispatch(createGuest({ userName }))
  }

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }

    if (isSuccess || user) {
      dispatch(logined());
    }

    dispatch(reset());
  }, [isLoading, isError, isSuccess, message, navigate, dispatch]);

  return (
    <>
      <div className="with-50 center ">
        <div>
          <h1 className="title">Nhập Tên </h1>
        </div>
        <div className="flex-col mb20 gap20px">
          <ThemeProvider theme={darkTheme}>
            <TextField
              className="z-Index20"
              id="standard-basic"
              label="Tên Hiển Thị"
              variant="standard"
              type="text"
              name='userName'
              value={userName}
              // placeholder='Ten Dang Nhap'
              onChange={(e) => setUserName(e.target.value)}
            />
          </ThemeProvider>
          <Button
            className="z-Index20"
            variant="contained"
            onClick={handleGuest}
          >
            Khách
          </Button>
        </div>
      </div>
    </>
  );
}
export default Guest;
