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

import React, { FC, useEffect, useRef } from "react"
import "../styles/DatasetEditor.css"
import { useDispatch, useSelector } from "react-redux"
import { useParams } from "react-router-dom"
import { Tree, TreeNode } from "../components/tree/Tree"
import { usePagination } from "../hooks/PaginationHook"
import { AnnotationsList } from "../layouts/annotation-list/AnnotationsList"
import { AnnotationsView } from "../layouts/annotation-view/AnnotationsView"
import { ConfigView } from "../layouts/config-view/ConfigView"
import { EditorControls } from "../layouts/datasets/EditorControls"
import { DataGroup } from "../models/DataGroup"
import { setCurrent, setZoom } from "../store/EditorStore"
import { RootState, store } from "../store/Store"
import { fetchAnnotation, fetchDataset, fetchDatasetConfig, fetchDatasetGroups } from "../store/StoreActions"

export const DatasetEditor: FC = () => {
  const dispatch = useDispatch<typeof store.dispatch>()
  const editorViewRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)

  const {id} = useParams()

  if (!id) {
    throw new Error("Dataset ID was not provided")
  }

  const datasetId = Number.parseInt(id)
  const editorState = useSelector((state: RootState) => state.editorState)
  const pagination = usePagination({size: 20})
  const zoomRef = useRef(editorState.zoom)

  const treeData: TreeNode[] = editorState.groups?.map(group => ({
    data: {
      ...group,
      type: "group"
    },
    children: group.files.map(file => ({
      data: {
        ...file,
        type: "file"
      },
      children: []
    }))
  })) || []

  useEffect(() => {
    if (editorViewRef.current) {
      editorViewRef.current.addEventListener("wheel", (e) => handleMouseWheel(e), {passive: false})
    }

    const loadData = async () => {
      const dataset = await dispatch(fetchDataset(datasetId)).unwrap()
      dispatch(fetchDatasetGroups({
                                          datasetId: dataset.id,
                                          pagination
                                        }))
      dispatch(fetchDatasetConfig(datasetId))
    }

    loadData()

    return () => {
      if (editorViewRef.current) {
        editorViewRef.current.removeEventListener("wheel", handleMouseWheel)
      }
    }
  }, [])

  useEffect(() => {
    zoomRef.current = editorState.zoom
  }, [editorState.zoom])

  useEffect(() => {
    dispatch(fetchAnnotation())
  }, [editorState.current])

  const onNodeClick = (node: TreeNode, nodeId: string) => {
    const data = node.data
    if (data.type === "group") {
      const group = data as DataGroup
      dispatch(setCurrent(group.id))
    } else if (data.type === "file") {

    }
  }

  const isNodeActive = (node: TreeNode) => {
    return editorState.current?.id === node.data.id
  }

  const nodeDataRenderer = (data: any) => {
    if (data.type === "group") {
      return <div>{data.name}</div>
    } else if (data.type === "file") {
      return <div>{data.fileName}</div>
    }
  }

  const contextMenuRenderer = (node: TreeNode) => {
    switch (node.data.type) {
      case "group": {
        return <>
          <div className={"menu-action"}>New</div>
          <div className={"menu-action"}>Delete</div>
        </>
      }
      case "file": {

        break
      }
    }
  }

  const handleMouseWheel = (e: WheelEvent) => {
    if (e.ctrlKey) {
      e.preventDefault()

      if (editorViewRef.current) {
        const {
          deltaY
        } = e

        const delta = deltaY < 0 ? editorState.zoomStep : -editorState.zoomStep
        const newZoom = Math.min(Math.max(editorState.minZoom, zoomRef.current + delta), editorState.maxZoom)

        dispatch(setZoom(newZoom))
      }
    }
  }

  return <>
    <div className="dataset-editor">
      <div className={"groups"}>
        <div className="dataset-info">
          <div className={"dataset-name"}>{editorState.dataset?.name}</div>
          <div className={"dataset-description"}>{editorState.dataset?.description}</div>
          <div className="groups-info">
            <div className={"total-groups"}>Groups: {editorState.groups.length} of {pagination?.totalElements}</div>
          </div>
        </div>
        <div className="groups-list">
          {
            treeData &&
              <Tree nodes={treeData}
                    dataRenderer={nodeDataRenderer}
                    contextMenuRenderer={contextMenuRenderer}
                    onNodeClick={onNodeClick}
                    isActive={isNodeActive}/>
          }
        </div>
      </div>
      <div className={"editor"}>
        <EditorControls/>
        <div id={"editorView"} ref={editorViewRef} className={"editor-view"}>
          <img ref={imageRef}
               src={editorState.annotation?.imageObjectUrl}
               alt={""}
               className={"annotation-img"}
               style={{
            transform: `scale(${editorState.zoom})`,
            transformOrigin: "top left"
          }}/>
          <AnnotationsView/>
        </div>
      </div>
      <div className={"annotations"}>
        <ConfigView/>
        <AnnotationsList/>
      </div>
    </div>
  </>
}
