import React, { useEffect, useState } from "react";

import TextField from "@mui/material/TextField";
import { ThemeProvider, createTheme } from '@mui/material/styles'
import Button from "@mui/material/Button";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import { logined } from "../features/status/StatusSlice";
import { useDispatch, useSelector } from "react-redux";
import { login } from '../features/user/userSlice';
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import { reset } from "../features/user/userSlice";

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const { isLoading, isError, message } = useSelector(
    (store) => store.user
  );

  const { email, password } = formData;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogIn = () => {
    dispatch(login(formData));
  };
  const handleInput = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }

    dispatch(reset());
  }, [isLoading, isError, message, navigate, dispatch]);

  return (
    <>
      <div className="with-50 center ">
        <div>
          <h1 className="title">ĐĂNG NHẬP</h1>
        </div>
        <div className="flex-col mb20 gap20px">
          <ThemeProvider theme={darkTheme}>
          <TextField
            className="z-Index20"
            label="Tên Đăng Nhập"
            variant="standard"
            name="email"
            type='email'
            value={email}
          
            onChange={handleInput}
          />
          <TextField
            className="z-Index20 mb20"
            label="Mật Khẩu"
            variant="standard"
            type="password"
            name="password"
            value={password}
            onChange={handleInput}
          />
          </ThemeProvider>
        </div>
        <div>
         {/* <ThemeProvider theme={darkTheme}>
         <FormControlLabel
            className="z-Index20 mb20"
            control={<Checkbox className="z-Index20" />}
            label="Lưu tài khoản"
          />
         </ThemeProvider> */}
        </div>
        <Button
          onClick={handleLogIn}
          className="z-Index20"
          variant="contained"
        >
          Đăng nhập
        </Button>
      </div>
    </>
  );
}

export default Login;
