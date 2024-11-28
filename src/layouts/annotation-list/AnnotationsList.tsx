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

import React, { FC } from "react"
import "../../styles/AnnotationsList.css"
import { useDispatch, useSelector } from "react-redux"
import { Object } from "../../models/Annotation"
import { toggleObject } from "../../store/EditorStore"
import { RootState } from "../../store/Store"
import { AnnotationsListControls } from "./AnnotationsListControls"


interface AnnotationsListProps {
}

export const AnnotationsList: FC<AnnotationsListProps> = (props: AnnotationsListProps) => {
  const dispatch = useDispatch()
  const editorState = useSelector((state: RootState) => state.editorState)

  const handleObjectClick = (object: Object, e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation()

    dispatch(toggleObject({
                            object,
                            ctrlKey: e.ctrlKey
                          }))
  }

  return <>
    <div className="annotations-list">
      <AnnotationsListControls/>
      {
        editorState.annotation?.layout?.objects.map((object: Object, index: number) => <React.Fragment key={index}>
          <div className={`annotation ${editorState.selectedObjects.includes(object) ? "selected" : ""}`}
               onClick={(e) => handleObjectClick(object, e)}>
            <div>{object.name}</div>
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
