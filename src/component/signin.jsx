import React from "react";

import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { ThemeProvider, createTheme } from '@mui/material/styles'

import { useState, useEffect } from "react";
import { register } from "../features/user/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { reset } from "../features/user/userSlice";

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

function SignIn({setStatusIndex}) {

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isLoading, isSuccess, isError, message } = useSelector(
    (store) => store.user
  );

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    userName: "",
  });

  const { email, password, userName } = formData;

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };
  console.log(formData);

  const handleRegister = () => {
    console.log(formData);
    dispatch(register(formData));
  };

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }

    if (isSuccess || user) {
      setStatusIndex("login")
      navigate('/');
    }

    dispatch(reset());
  }, [isLoading, isError, isSuccess, message, navigate, dispatch]);

  return (
    <>
      <div className="with-50 center ">
        <div>
          <h1 className="title">ĐĂNG KÍ</h1>
        </div>
        <div className="flex-col mb20 gap20px">
          <ThemeProvider theme={darkTheme}>
            <TextField
              className="z-Index20"
              label="Tên Hiển Thị"
              variant="standard"
              type="text"
              name='userName'
              value={userName}
              onChange={handleChange}

            />
            <TextField
              className="z-Index20 mb20"
              label="Tên Đăng Nhập"
              variant="standard"
              name="email"
              type='text'
              value={email}
              onChange={handleChange}
            />
            <TextField
              className="z-Index20 mb20"
              label="Mật Khẩu"
              variant="standard"
              type="password"
              name="password"
              value={password}
              onChange={handleChange}
            />
          </ThemeProvider>
        </div>
        <Button
          onClick={handleRegister}
          className="z-Index20"
          variant="contained"
        >
          Đăng kí
        </Button>
      </div>
    </>
  );
}

export default SignIn;
