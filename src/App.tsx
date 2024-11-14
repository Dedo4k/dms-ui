import React from 'react';
import './styles/App.css';
import {Route, Routes} from "react-router-dom";
import {Workspace} from "./pages/Workspace";
import {Datasets} from "./layouts/Datasets";

function App() {

  return (
    <div className={"App"}>
      <Routes>
        <Route path={"/"} element={<div>Main</div>}/>
        <Route path={"/workspace"} element={<Workspace/>}>
          <Route path={"/workspace/datasets"} element={<Datasets/>}/>
          <Route path={"/workspace/moderators"} element={<div>Moderators</div>}/>
        </Route>
        <Route path={"/editor"} element={<div>Editor</div>}/>
      </Routes>
    </div>
  );
}

export default App;
