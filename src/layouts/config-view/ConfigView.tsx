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
import { AppendableSelect } from "../../components/appendable-select/AppendableSelect"
import { Spinner } from "../../components/spinner/Spinner"
import { RootState } from "../../store/Store"

export const ConfigView: FC = () => {
  const editorState = useSelector((state: RootState) => state.editorState)

  const classOptions = editorState.config?.classes || []

  const optionRenderer = (option: string) => option

  return <>
    <div className={"config-view"}>
      <div className={"title"}>Dataset config</div>
      <div className={"config-container"}>
        {
          editorState.configStatus === "loading" && <Spinner/>
        }
        {
          editorState.config === null &&
            <div className={"no-config"}>
              {
                //TODO for dataset owner
                false ?
                  <div className={"add-config-btn"}>
                    <Add/>
                    Add Config
                  </div>
                  :
                  <div>No default config</div>
              }
            </div>
        }
        <div className={"annotation-class-view"}>
          <div className={"classes"}>Class:</div>
          <div className={"class-selector"}>
            <AppendableSelect options={classOptions} optionRenderer={optionRenderer} placeholder={"New Class"}/>
          </div>
        </div>
      </div>
    </div>
  </>
}
