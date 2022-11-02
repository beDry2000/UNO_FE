import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import "./App.css";
import Index from "./component";
import Board from "./component/board";
import Game from "./component/wait-room";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <>
      <Router>
        {/* <Header /> */}
        <div>
          <Routes>
            <Route path="/" element={<Index />} />
            {/* <Route path="/game/:roomCode" element={<Board />} /> */}
            {/* <Route path="/room" element={<Second />} /> */}
            <Route path="/game/:roomCode" element={<Game />} />
            <Route path="*" element={<h1>URL not existed</h1>} />
          </Routes>
        </div>
      </Router>
      <ToastContainer/>
    </>
  );
}

export default App;
