import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./routes/login";
import NavBar from "./components/navbar";
import NewNote from "./routes/new";
import ViewNote from "./routes/view";
import Signup from "./routes/signup";
import Logout from "./routes/logout";
import axios from "axios";

axios.defaults.withCredentials = true;

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <NavBar />
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/login" element={<Login />} />
      <Route path="/new" element={<NewNote />} />
      <Route path="/view" element={<ViewNote />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/logout" element={<Logout />} />
    </Routes>
  </BrowserRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
