import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import AuthProvider from "react-auth-kit";
import Root from "./routes/Root.tsx";
import Admin from "./routes/Admin.tsx";
import User from "./routes/User.tsx";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AuthOutlet from "@auth-kit/react-router/AuthOutlet";
import createStore from 'react-auth-kit/createStore'; 


import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

interface IUserData {
  name: string;
  uuid: string;
 };
 
 const store = createStore<IUserData>({
  authName:'_auth',
  authType:'cookie',
  cookieDomain: window.location.hostname,
  cookieSecure: window.location.protocol === 'https:'
 })

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthProvider store={store}>
    <BrowserRouter>
      <Routes>
        <Route path={"/"} element={<Root />} />
        <Route element={<AuthOutlet fallbackPath="/" />}>
          <Route path="/Admin" element={<Admin />} />
          <Route path="/User" element={<User />} />
        </Route>
      </Routes>
    </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>
);
