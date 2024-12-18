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

import { CheckBox, CheckBoxOutlineBlank, IndeterminateCheckBox, Visibility, VisibilityOff } from "@mui/icons-material"
import { FC } from "react"
import "../../styles/AnnotationsListControls.css"
import { useDispatch, useSelector } from "react-redux"
import { clearObjectSelection, hideAllObjects, selectAllObjects, showAllObjects } from "../../store/EditorStore"
import { RootState } from "../../store/Store"

export const AnnotationsListControls: FC = () => {
  const dispatch = useDispatch()
  const editorState = useSelector((state: RootState) => state.editorState)

  const toggleSelectionControl = () => {
    if (editorState.selectedObjects.length === 0) {
      dispatch(selectAllObjects())
    } else {
      dispatch(clearObjectSelection())
    }
  }

  const toggleVisibilityControl = () => {
    if (editorState.invisibleObjects.length === 0) {
      dispatch(showAllObjects())
    } else {
      dispatch(hideAllObjects())
    }
  }

  return <>
    <div className={"annotations-list-controls"}>
      {
        editorState?.annotation?.layout?.objects.length ?
          <div className={"selection-control icon-btn control-btn"}
               onClick={toggleSelectionControl}
               title={`${editorState.selectedObjects.length ? "Unselect all objects" : "Select all objects"}`}>
            {
              editorState.selectedObjects.length === 0 ? <CheckBoxOutlineBlank/> :
                editorState.selectedObjects.length === editorState?.annotation?.layout?.objects.length ?
                  <CheckBox/> : <IndeterminateCheckBox/>
            }
          </div> : null
      }
      {
        editorState?.annotation?.layout?.objects.length ?
          <div className={"visibility-control icon-btn control-btn"}
               onClick={toggleVisibilityControl}
               title={`${editorState.invisibleObjects.length ? "Show all objects" : "Hide all objects"}`}>
            {
              editorState.invisibleObjects.length ? <Visibility/> : <VisibilityOff/>
            }
          </div> : null
      }
    </div>
  </>
}
