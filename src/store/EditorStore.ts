/*
 * Copyright (c) 2024-2025 Uladzislau Lailo.
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

import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { v1 as uuidv1 } from "uuid"
import { Annotation, Object } from "../models/Annotation"
import { DataGroup } from "../models/DataGroup"
import { Dataset } from "../models/Dataset"
import { fetchAnnotation, fetchDataset, fetchDatasetGroups } from "./StoreActions"

interface EditorState {
  dataset: Dataset | null
  groups: DataGroup[]
  current: DataGroup | null
  annotation: Annotation | null
  selectedObjects: Object[]
  invisibleObjects: Object[]
  mode: EditorMode
  drawingObject: Object | null
  drawingStartPoint: {
    x: number,
    y: number
  } | null
  movingStartPoint: {
    x: number,
    y: number
  } | null
  zoom: number
  minZoom: number
  maxZoom: number
  zoomStep: number
  datasetStatus: "initial" | "loading" | "loaded" | "error"
  groupsStatus: "initial" | "loading" | "loaded" | "error"
  annotationStatus: "initial" | "loading" | "loaded" | "error" | "changed"
}

export type EditorMode = "bndbox" | "polygon" | null

const initialState: EditorState = {
  dataset: null,
  groups: [],
  current: null,
  annotation: null,
  selectedObjects: [],
  invisibleObjects: [],
  mode: null,
  drawingObject: null,
  drawingStartPoint: null,
  movingStartPoint: null,
  zoom: 1,
  minZoom: 0.05,
  maxZoom: 2,
  zoomStep: 0.05,
  datasetStatus: "initial",
  groupsStatus: "initial",
  annotationStatus: "initial"
}

export const editorStore = createSlice(
  {
    name: "editorSlice",
    initialState,
    reducers: {
      setDataset: (state: EditorState, action: PayloadAction<Dataset>) => {
        state.dataset = action.payload
      },
      setCurrent: (state: EditorState, action: PayloadAction<number>) => {
        const group = state.groups.find(group => group.id === action.payload)
        if (group) {
          state.current = group
        }
      },
      selectAllObjects: (state: EditorState) => {
        const objects = state.annotation?.layout?.objects
        if (objects) {
          state.selectedObjects = objects
        }
      },
      clearObjectSelection: (state: EditorState) => {
        state.selectedObjects = []
      },
      toggleObject: (
        state: EditorState,
        action: PayloadAction<{
          object: Object,
          ctrlKey: boolean
        }>
      ) => {
        const {
          object,
          ctrlKey
        } = action.payload
        if (state.selectedObjects.find(obj => obj.id === object.id)) {
          if (!ctrlKey && state.selectedObjects.length > 1) {
            state.selectedObjects = []
          } else {
            state.selectedObjects = state.selectedObjects.filter(obj => obj.id !== object.id)
          }
        } else {
          if (ctrlKey && !state.selectedObjects.find(obj => obj.id === object.id)) {
            state.selectedObjects.push(object)
          } else {
            state.selectedObjects = []
            state.selectedObjects.push(object)
          }
        }
      },
      setMode: (state: EditorState, action: PayloadAction<EditorMode>) => {
        state.mode = action.payload
      },
      setDrawingObject: (state: EditorState, action: PayloadAction<Object | null>) => {
        state.drawingObject = action.payload
      },
      addLayoutObject: (state: EditorState, action: PayloadAction<Object>) => {
        state.annotation?.layout?.objects.push({
                                                 ...action.payload,
                                                 id: uuidv1()
                                               })
        state.annotationStatus = "changed"
      },
      removeLayoutObjects: (state: EditorState, action: PayloadAction<Object[]>) => {
        if (state.annotation?.layout) {
          state.annotation.layout.objects = state.annotation.layout.objects
                                                 .filter(object => !action.payload
                                                                          .map(obj => obj.id)
                                                                          .includes(object.id)
                                                 )
        }
      },
      setDrawingStartPoint: (
        state: EditorState,
        action: PayloadAction<{
          x: number,
          y: number
        } | null>
      ) => {
        state.drawingStartPoint = action.payload
      },
      setZoom: (state: EditorState, action: PayloadAction<number>) => {
        state.zoom = action.payload
      },
      toggleObjectVisibility: (state: EditorState, action: PayloadAction<Object>) => {
        if (state.invisibleObjects.find(obj => obj.id === action.payload.id)) {
          state.invisibleObjects = state.invisibleObjects.filter(obj => obj.id !== action.payload.id)
        } else {
          state.invisibleObjects.push(action.payload)
        }
      },
      showAllObjects: (state: EditorState) => {
        state.invisibleObjects = state.annotation?.layout?.objects || []
      },
      hideAllObjects: (state: EditorState) => {
        state.invisibleObjects = []
      },
      setMovingStartPoint: (
        state: EditorState,
        action: PayloadAction<{
          x: number,
          y: number
        } | null>
      ) => {
        state.movingStartPoint = action.payload
      }
    },
    extraReducers: (builder) => {
      builder
        .addCase(fetchDataset.pending, (state) => {
          state.datasetStatus = "loading"
        })
        .addCase(fetchDataset.fulfilled, (state, action) => {
          state.dataset = action.payload
          state.datasetStatus = "loaded"
        })
        .addCase(fetchDataset.rejected, (state) => {
          state.datasetStatus = "error"
        })
        .addCase(fetchDatasetGroups.pending, (state) => {
          state.groupsStatus = "loading"
        })
        .addCase(fetchDatasetGroups.fulfilled, (state, action) => {
          if (state.dataset) {
            state.groups = action.payload
            if (state.groups.length) {
              state.current = state.groups[0]
            }
            state.groupsStatus = "loaded"
          } else {
            state.datasetStatus = "error"
          }
        })
        .addCase(fetchDatasetGroups.rejected, (state) => {
          state.groupsStatus = "error"
        })
        .addCase(fetchAnnotation.pending, (state) => {
          state.annotationStatus = "loading"
        })
        .addCase(fetchAnnotation.fulfilled, (state, action) => {
          if (state.annotation?.imageObjectUrl) {
            URL.revokeObjectURL(state.annotation.imageObjectUrl)
          }
          state.annotation = action.payload
          state.selectedObjects = []
          state.annotationStatus = "initial"
        })
        .addCase(fetchAnnotation.rejected, (state) => {
          state.annotationStatus = "error"
        })
    }
  })

export const {
  setDataset,
  setCurrent,
  selectAllObjects,
  clearObjectSelection,
  toggleObject,
  setMode,
  setDrawingObject,
  addLayoutObject,
  removeLayoutObjects,
  setDrawingStartPoint,
  setZoom,
  toggleObjectVisibility,
  showAllObjects,
  hideAllObjects,
  setMovingStartPoint
} = editorStore.actions

export default editorStore.reducer
