/*
 * Copyright (c) 2024 Uladzislau Lailo.
 *
 * All rights reserved.
 *
 * This source code, and any associated documentation, is the intellectual property of Uladzislau Lailo.
 * Unauthorized copying, modification, distribution, or any form of reuse of this code, in whole or in part,
 * without explicit permission from the copyright holder is strictly prohibited, except where explicitly permitted
 * under applicable open-source licenses (if any).
 *
 * Licensed use:
 * If the code is provided under an open-source license, you must follow the terms of that license, which can be found in the LICENSE file.
 * For any permissions not covered by the license or any inquiries about usage, please contact: [lailo.vlad@gmail.com]
 */

import React from "react"
import "./styles/App.css"
import { Route, Routes } from "react-router-dom"
import { Datasets } from "./layouts/datasets/Datasets"
import { DatasetEditor } from "./pages/DatasetEditor"
import { Workspace } from "./pages/Workspace"

function App() {

  return (
    <div className={"App"}>
      <Routes>
        <Route path={"/"} element={<div>Main</div>}/>
        <Route path={"/workspace"} element={<Workspace/>}>
          <Route path={"/workspace/datasets"} element={<Datasets/>}/>
          <Route path={"/workspace/datasets/:id"} element={<div>Dataset details</div>}/>

          <Route path={"/workspace/moderators"} element={<div>Moderators</div>}/>
        </Route>
        <Route path={"/editor/:id"} element={<DatasetEditor/>}/>
      </Routes>
    </div>
  )
}

export default App
