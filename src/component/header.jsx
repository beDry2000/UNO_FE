import React from "react";
import Button from "@mui/material/Button";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { logout, deleteUser } from "../features/user/userSlice";
import { resetGame } from "../features/game/gameSlice";
function Header() {
  const navigate = useNavigate();
  const { user } = useSelector((store) => store.user);
  const dispatch = useDispatch();

  const handleLogout = () => {
    if (user.isGuest) {
      dispatch(deleteUser());
    }
    localStorage.removeItem('user')
    dispatch(resetGame());
    dispatch(logout());
    navigate("/");
  };

  return (
    <>
      <div className="header-play">
        <div></div>

        <div></div>
        <div className="controller top-right ">
          <div className="name-header">
            <h2>Xin chào {user.userName}</h2>
          </div>
          <Button
            variant="contained"
            color="error"
            size="small"
            onClick={handleLogout}
          // className="member-name"
          >
            đăng xuất
          </Button>
        </div>
      </div>
    </>
  );
}
export default Header;
