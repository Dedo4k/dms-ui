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
import "../../styles/AnnotationView.css"
import { useDispatch, useSelector } from "react-redux"
import { Bndbox, Object, Polygon } from "../../models/Annotation"
import {
  addLayoutObject, clearObjectSelection, setDrawingObject, setDrawingStartPoint, toggleObject
} from "../../store/EditorStore"
import { RootState } from "../../store/Store"

interface AnnotationsViewProps {
}

export const AnnotationsView: FC<AnnotationsViewProps> = (props: AnnotationsViewProps) => {
  const dispatch = useDispatch()
  const editorState = useSelector((state: RootState) => state.editorState)
  const editorViewRef = React.createRef<HTMLDivElement>()

  const handleObjectClick = (object: Object, e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation()

    dispatch(toggleObject({
                            object,
                            ctrlKey: e.ctrlKey
                          }))
  }

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation()
    e.preventDefault()

    if (editorViewRef.current) {
      const {
        clientX,
        clientY
      } = e

      const {
        left,
        top
      } = editorViewRef.current.getBoundingClientRect()

      const x = clientX - left
      const y = clientY - top

      dispatch(setDrawingStartPoint({
                                      x,
                                      y
                                    }))
    }
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation()

    const {
      drawingObject,
      drawingStartPoint
    } = editorState

    if (editorViewRef.current && drawingStartPoint) {
      const {
        clientX,
        clientY
      } = e

      const {
        left,
        top
      } = editorViewRef.current.getBoundingClientRect()

      switch (editorState.mode) {
        case "bndbox": {
          const x = clientX - left
          const y = clientY - top

          dispatch(clearObjectSelection())
          dispatch(setDrawingObject({
                                      ...drawingObject,
                                      layout: {
                                        type: "bndbox",
                                        xmin: Math.min(drawingStartPoint.x, x) / editorState.zoom,
                                        ymin: Math.min(drawingStartPoint.y, y) / editorState.zoom,
                                        xmax: Math.max(drawingStartPoint.x, x) / editorState.zoom,
                                        ymax: Math.max(drawingStartPoint.y, y) / editorState.zoom
                                      }
                                    } as Object))
          break
        }
        case "polygon": {

          break
        }
      }
    }
  }

  const handleMouseUp = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation()

    const {
      drawingObject,
      drawingStartPoint
    } = editorState

    if (drawingObject && drawingStartPoint) {
      const layout = drawingObject.layout

      switch (layout.type) {
        case "polygon": {

          break
        }
        case "bndbox": {
          if (layout.ymin !== layout.ymax && layout.xmin !== layout.xmax) {
            dispatch(addLayoutObject(drawingObject))
          }
          break
        }
      }
    }

    dispatch(setDrawingObject(null))
    dispatch(setDrawingStartPoint(null))
  }

  const renderLayoutObject = (object: Object, id: string) => {
    switch (object.layout.type) {
      case "polygon":
        return renderPolygon(object, id)
      case "bndbox":
        return renderBndbox(object, id)
    }
  }

  const renderBndbox = (object: Object, id: string) => {
    const bndbox = object.layout as Bndbox
    return <React.Fragment key={id}>
      <div className={"bndbox"}
           title={object.name}
           onClick={(e) => handleObjectClick(object, e)}
           style={{
             position: "absolute",
             top: bndbox.ymin * editorState.zoom,
             left: bndbox.xmin * editorState.zoom,
             width: (bndbox.xmax - bndbox.xmin) * editorState.zoom,
             height: (bndbox.ymax - bndbox.ymin) * editorState.zoom,
             border: `2px solid ${editorState.selectedObjects.includes(object) ? "blue" : "red"}`,
             boxSizing: "border-box",
             cursor: `${editorState.mode && editorState.drawingObject ? "crosshair" : "pointer"}`
           }}>
        <div>{object.name}</div>
      </div>
    </React.Fragment>
  }

  const renderPolygon = (object: Object, id: string) => {
    const polygon = object.layout as Polygon
    return <React.Fragment key={id}>
      <div id={id} className="polygon">

      </div>
    </React.Fragment>
  }

  return <>
    <div ref={editorViewRef}
         className="annotations-view"
         onMouseDown={(e) => handleMouseDown(e)}
         onMouseMove={(e) => handleMouseMove(e)}
         onMouseUp={(e) => handleMouseUp(e)}
         style={{
           width: `${(editorState?.annotation?.layout?.size.width! * editorState.zoom)}px`,
           height: `${editorState?.annotation?.layout?.size.height! * editorState.zoom}px`,
           cursor: `${editorState.mode !== null ? "crosshair" : "default"}`
         }}>
      {
        editorState.annotation?.layout?.objects.map((object: Object, index: number) => renderLayoutObject(
          object,
          index.toString()
        ))
      }
      {
        editorState.drawingObject && renderLayoutObject(editorState.drawingObject, editorState.drawingObject.id)
      }
    </div>
  </>
}
