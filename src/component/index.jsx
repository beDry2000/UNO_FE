import React, { useState } from "react";
import Login from "./login";
import SignIn from "./signin";
import Guest from "./guest";
import { useDispatch, useSelector } from "react-redux";
import CreateRoom from "./create-room";
import Button from "@mui/material/Button";
import Header from "./header";
function Index() {
  const { user } = useSelector((state) => state.user);
  const [statusIndex, setStatusIndex] = useState("login");
  // logi
  // register
  // guest

  console.log(statusIndex);
  return (
    <>
      <div className="bg">
        {user && <Header />}
        <div className="login-box ">
          {/* If dont have user  three button for login, register or guest*/}
          {!user && (
            <div className="nav-bar ">
              <Button
                onClick={() => setStatusIndex("login")}
                variant={statusIndex === "login" ? "contained" : "outlined"}
                className="z-Index20 with-33"
              >
                đăng nhập
              </Button>
              <Button
                onClick={() => setStatusIndex("signin")}
                variant={statusIndex === "signin" ? "contained" : "outlined"}
                className="z-Index20 with-33"
              >
                đăng kí
              </Button>
              <Button
                onClick={() => setStatusIndex("guest")}
                variant={statusIndex === "guest" ? "contained" : "outlined"}
                className="z-Index20 with-33"
              >
                khách
              </Button>
            </div>
          )}

          {/* If dont have user show input for login, register, guest
            Else show room function
          */}
          {user ? (
            <CreateRoom />
          ) : (
            <>
              {statusIndex === "login" && <Login />}
              {statusIndex === "signin" && <SignIn setStatusIndex={setStatusIndex}/>}
              {statusIndex === "guest" && <Guest />}
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default Index;
