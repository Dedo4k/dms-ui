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

import { Add, Crop75, Polyline, Remove } from "@mui/icons-material"
import React, { FC, useEffect, useState } from "react"
import "../../styles/EditorControls.css"
import { useDispatch, useSelector } from "react-redux"
import { EditorMode, setMode, setZoom } from "../../store/EditorStore"
import { RootState } from "../../store/Store"

export const EditorControls: FC = (props) => {
  const dispatch = useDispatch()
  const editorState = useSelector((state: RootState) => state.editorState)
  const [zoomValue, setZoomValue] = useState(editorState.zoom)

  useEffect(() => {
    setZoomValue(editorState.zoom)
  }, [editorState.zoom])

  const toggleMode = (mode: EditorMode) => {
    if (editorState.mode === mode) {
      dispatch(setMode(null))
    } else {
      dispatch(setMode(mode))
    }
  }

  const handleZoomOut = () => {
    if (editorState.zoom - editorState.zoomStep >= editorState.minZoom) {
      dispatch(setZoom(Number((editorState.zoom - editorState.zoomStep).toFixed(2))))
    }
  }

  const handleZoomIn = () => {
    if (editorState.zoom + editorState.zoomStep <= editorState.maxZoom) {
      dispatch(setZoom(Number((editorState.zoom + editorState.zoomStep).toFixed(2))))
    }
  }

  const handleZoomInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.currentTarget.value) / 100
    setZoomValue(value)
  }

  const applyZoomChange = (e: React.FocusEvent<HTMLInputElement>) => {
    let value = Number(e.currentTarget.value) / 100

    if (!value) {
      value = 0
    }

    setZoomValue(value)

    if (editorState.minZoom > value) {
      dispatch(setZoom(editorState.minZoom))
    } else if (value > editorState.maxZoom) {
      dispatch(setZoom(editorState.maxZoom))
    } else {
      dispatch(setZoom(value))
    }
  }

  return <>
    <div className={"editor-controls"}>
      <div className="control-group mode-control">
        <div className={`control-btn ${editorState.mode === "bndbox" && "active"}`}
             title={"Bndbox"}
             onClick={() => toggleMode("bndbox")}>
          <Crop75/>
        </div>
        <div className={`control-btn ${editorState.mode === "polygon" && "active"}`}
             title={"Polygon"}
             onClick={() => toggleMode("polygon")}>
          <Polyline/>
        </div>
      </div>
      <div className={"control-group zoom-control"}>
        <div className={"control-btn"} title={"Zoom out"} onClick={() => handleZoomOut()}>
          <Remove/>
        </div>
        <div className={"zoom-input"}>
          <input type="number"
                 value={(zoomValue * 100).toFixed(0)}
                 title={"Zoom value"}
                 onChange={handleZoomInput}
                 onBlur={applyZoomChange}
                 min={editorState.minZoom * 100}
                 max={editorState.maxZoom * 100}/>
          <span>%</span>
        </div>
        <div className={"control-btn"} title={"Zoom in"} onClick={() => handleZoomIn()}>
          <Add/>
        </div>
      </div>
    </div>
  </>
}
