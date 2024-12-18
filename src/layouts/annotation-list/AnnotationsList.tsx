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

import { Remove, Visibility, VisibilityOff } from "@mui/icons-material"
import React, { FC } from "react"
import "../../styles/AnnotationsList.css"
import { useDispatch, useSelector } from "react-redux"
import { Spinner } from "../../components/spinner/Spinner"
import { Object } from "../../models/Annotation"
import { toggleObject, toggleObjectVisibility } from "../../store/EditorStore"
import { RootState } from "../../store/Store"
import { AnnotationsListControls } from "./AnnotationsListControls"


interface AnnotationsListProps {
  onObjectDelete: (object?: Object) => void
}

export const AnnotationsList: FC<AnnotationsListProps> = (props: AnnotationsListProps) => {
  const dispatch = useDispatch()
  const editorState = useSelector((state: RootState) => state.editorState)

  const {onObjectDelete} = props

  const handleObjectClick = (object: Object, e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation()

    dispatch(toggleObject({
                            object,
                            ctrlKey: e.ctrlKey
                          }))
  }

  const handleVisibilityClick = (object: Object, e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation()

    dispatch(toggleObjectVisibility(object))
  }

  const handleRemoveClick = (object: Object, e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation()

    onObjectDelete && onObjectDelete(object)
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLDivElement>) => {
    switch (e.key) {
      case "Delete": {
        onObjectDelete && onObjectDelete()
      }
    }
  }

  return <>
    <div className="annotations-list" onKeyDown={handleKeyPress} tabIndex={0}>
      {
        editorState.annotationStatus === "loading" && <Spinner/>
      }
      <AnnotationsListControls/>
      {
        editorState.annotation?.layout?.objects.map((object: Object, index: number) => <React.Fragment key={index}>
          <div className={`annotation ${editorState.selectedObjects.includes(object) ? "selected" : ""}`}
               onClick={(e) => handleObjectClick(object, e)}>
            <div className="icon-btn visibility-btn" onClick={(e) => handleVisibilityClick(object, e)}>
              {
                editorState.invisibleObjects.find(obj => obj.id === object.id) ?
                  <VisibilityOff/> : <Visibility/>
              }
            </div>
            <div>{object.name}</div>
            <div className="icon-btn remove-btn" onClick={(e) => handleRemoveClick(object, e)}>
              <Remove/>
            </div>
          </div>
        </React.Fragment>)
      }
      {
        !editorState?.annotation?.layout &&
          <div className={"no-layout"}>No Layout</div>
      }
    </div>
  </>
}
