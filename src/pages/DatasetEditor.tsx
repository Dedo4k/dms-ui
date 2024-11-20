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

import { FC, useEffect } from "react"
import "../styles/DatasetEditor.css"
import { useDispatch, useSelector } from "react-redux"
import { useParams } from "react-router-dom"
import { Tree, TreeNode } from "../components/tree/Tree"
import { AnnotationsList } from "../layouts/AnnotationsList"
import { AnnotationsView } from "../layouts/AnnotationsView"
import { EditorControls } from "../layouts/EditorControls"
import { DataGroup } from "../models/DataGroup"
import { setCurrent } from "../store/BufferSlice"
import { RootState, store } from "../store/Store"
import { fetchDataset, fetchDatasetGroups, fillBuffer } from "../store/StoreActions"

export const DatasetEditor: FC = () => {
  const dispatch = useDispatch<typeof store.dispatch>()

  const {id} = useParams()

  if (!id) {
    throw new Error("Dataset ID was not provided")
  }

  const datasetId = Number.parseInt(id)

  const editorState = useSelector((state: RootState) => state.editorState)
  const bufferState = useSelector((state: RootState) => state.bufferState)


  const treeData: TreeNode[] = editorState.dataset?.groups?.map(group => ({
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
    const loadData = async () => {
      const dataset = await dispatch(fetchDataset(datasetId)).unwrap()
      await dispatch(fetchDatasetGroups(dataset.id))
      dispatch(fillBuffer())
    }

    loadData()
  }, [])

  const onNodeClick = (node: TreeNode, nodeId: string) => {
    const data = node.data
    if (data.type === "group") {
      const group = data as DataGroup
      dispatch(setCurrent(group.id))
    } else if (data.type === "file") {

    }
  }

  const nodeDataRenderer = (data: any) => {
    if (data.type === "group") {
      return <div>{data.name}</div>
    } else if (data.type === "file") {
      return <div>{data.fileName}</div>
    }
  }

  return <>
    <div className="dataset-editor">
      <div className={"groups"}>
        <div className="dataset-info">
          <div>{editorState.dataset?.name}</div>
          <div>{editorState.dataset?.description}</div>
        </div>
        <div className="groups-list">
          {
            treeData && <Tree nodes={treeData} dataRenderer={nodeDataRenderer} onNodeClick={onNodeClick}/>
          }
        </div>
      </div>
      <div className={"editor"}>
        <EditorControls/>
        <div className={"editor-view"}>
          <img src={bufferState.annotations[bufferState.current]?.imageUrl} alt={""} className={"annotation-img"}/>
          <AnnotationsView annotation={bufferState.annotations[bufferState.current]}/>
        </div>
      </div>
      <div className={"annotations"}>
        <AnnotationsList annotation={bufferState.annotations[bufferState.current]}/>
      </div>
    </div>
  </>
}
