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

import { Add } from "@mui/icons-material"
import { FC } from "react"
import "../../styles/ConfigView.css"
import { useSelector } from "react-redux"
import { RootState } from "../../store/Store"

export const ConfigView: FC = () => {
  const editorState = useSelector((state: RootState) => state.editorState)

  return <>
    <div className={"config-view"}>
      <div className={"title"}>Dataset config</div>
      {
        editorState.config === null &&
          <div className={"no-config"}>
              <div className={"add-config-btn"}>
                  <Add/>
                  Add Config
              </div>
          </div>
      }
    </div>
  </>
}
