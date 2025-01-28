/*
 * Copyright (c) 2024-2025 Uladzislau Lailo.
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

import { AccountCircle, Dataset, DesktopWindows, MoreVert, People } from "@mui/icons-material"
import { FC } from "react"
import "../styles/Workspace.css"
import { useSelector } from "react-redux"
import { NavLink, Outlet } from "react-router-dom"
import { RootState } from "../store/Store"

export const Workspace: FC = () => {
  const user = useSelector((state: RootState) => state.authState.user)

  return <>
    <div className={"workspace"}>
      <div className={"sidebar"}>
        <div className={"sidebar-nav-link"}>
          <NavLink to={"datasets"} title={"Datasets"}>
            <Dataset/>
            <span>Datasets</span>
          </NavLink>
        </div>
        <div className={"sidebar-nav-link"}>
          <NavLink to={"moderators"} title={"Moderators"}>
            <People/>
            <span>Moderators</span>
          </NavLink>
        </div>
        <div className={"sidebar-nav-link"}>
          <NavLink to={"/window"} title={"Moderators"}>
            <DesktopWindows/>
            <span>Window page</span>
          </NavLink>
        </div>
        <div className="bottom-section">
          <div className={"sidebar-nav-link"}>
            <NavLink to={"moderators"} title={"Profile"}>
              <AccountCircle/>
              <span>{user?.name} {user?.surname}</span>
            </NavLink>
          </div>
          <div className={"icon-btn more-btn"}>
            <MoreVert/>
          </div>
        </div>
      </div>
      <div className={"main-content"}>
        <h1>Workspace of {user?.name} {user?.surname}</h1>
        <Outlet/>
      </div>
    </div>
  </>
}
