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
import { usePagination } from "../hooks/PaginationHook"
import { AnnotationsList } from "../layouts/AnnotationsList"
import { AnnotationsView } from "../layouts/AnnotationsView"
import { EditorControls } from "../layouts/EditorControls"
import { DataGroup } from "../models/DataGroup"
import { setCurrent } from "../store/EditorStore"
import { RootState, store } from "../store/Store"
import { fetchAnnotation, fetchDataset, fetchDatasetGroups } from "../store/StoreActions"

export const DatasetEditor: FC = () => {
  const dispatch = useDispatch<typeof store.dispatch>()

  const {id} = useParams()

  if (!id) {
    throw new Error("Dataset ID was not provided")
  }

  const datasetId = Number.parseInt(id)

  const editorState = useSelector((state: RootState) => state.editorState)
  const pagination = usePagination({size: 20})

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
    const loadData = async () => {
      const dataset = await dispatch(fetchDataset(datasetId)).unwrap()
      await dispatch(fetchDatasetGroups({
                                          datasetId: dataset.id,
                                          pagination
                                        }))
    }

    loadData()
  }, [])

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
              <Tree nodes={treeData} dataRenderer={nodeDataRenderer} onNodeClick={onNodeClick} isActive={isNodeActive}/>
          }
        </div>
      </div>
      <div className={"editor"}>
        <EditorControls/>
        <div className={"editor-view"}>
          <img src={editorState.annotation?.imageObjectUrl} alt={""} className={"annotation-img"}/>
          <AnnotationsView annotation={editorState.annotation}/>
        </div>
      </div>
      <div className={"annotations"}>
        <AnnotationsList annotation={editorState.annotation}/>
      </div>
    </div>
  </>
}
