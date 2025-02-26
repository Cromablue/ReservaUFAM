import { use } from "react";
import AddTasks from "./components/AddTasks"
import Tasks from "./components/Tasks"
import { useEffect,useState } from 'react';
import Header from "./components/Header";
import Main from "./components/Main";
import Loader from "./components/Loader";
import Error from "./components/Error";
import Login from "./components/Login";

const App = () => {
  console.log({ Header, Main, Loader, Error });
  return (
    <div className="app">
      <Header/>
      <Main>
        <Login/>
        <Loader/>
        <Error/>
      </Main>
    </div>
  )
}
export default App


