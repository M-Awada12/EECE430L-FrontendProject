import React from "react";
import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./Components/Landing/Landing";
import Exchange from "./Components/Exchange/Exchange";
import Statistics from "./Components/Statistics/Statistics";
import Navbar from "./Components/Navbar/Navbar";

function App() {

  return (
    <BrowserRouter>
      <Navbar/>
      <Routes>
        <Route path="/Exchange" element={<Exchange />} />
        <Route path="/Statistics" element={<Statistics />} />
        <Route path="/" element={<Landing />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

