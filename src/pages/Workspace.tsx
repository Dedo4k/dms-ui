import {FC} from "react";
import "../styles/Workspace.css"
import {NavLink, Outlet} from "react-router-dom";
import {useSelector} from "react-redux";
import {RootState} from "../store/Store";
import {AccountCircle, Dataset, MoreVert, People, VerifiedUser} from "@mui/icons-material";

export const Workspace: FC = () => {
  const user = useSelector((state: RootState) => state.authState.user);

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
        <div className="bottom-section">
          <div className={"sidebar-nav-link"}>
            <NavLink to={"moderators"} title={"Profile"}>
              <AccountCircle/>
              <span>{user?.name} {user?.surname}</span>
            </NavLink>
          </div>
          <div className={"more-btn"}>
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
