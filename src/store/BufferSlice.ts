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

import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { DataGroup } from "../models/DataGroup"
import { fetchDatasetGroups } from "./StoreActions"

interface BufferState {
  downloadInfo: AnnotationInfo[]
  annotations: Annotation[]
  cursor: number
  current: number
  size: number
  loadFactor: number
  initialized: boolean
}

export interface AnnotationInfo {
  id: number
  imageUrl: string
  layoutUrl: string
  status: "pending" | "loading" | "completed"
}

export interface Annotation {
  id: number
  imageUrl: string
  layout: Layout
}

const initialState: BufferState = {
  downloadInfo: [],
  annotations: [],
  cursor: 0,
  current: 0,
  size: 10,
  loadFactor: 0.7,
  initialized: false
}

export interface Layout {
  size: {
    width: number
    height: number
    depth: number
  }
  objects: Object[]
}

export interface Object {
  name: string
  pose: string
  truncated: number
  difficult: number
  layout: LayoutObject
}

export interface Bndbox {
  type: "bndbox"
  xmin: number
  ymin: number
  xmax: number
  ymax: number
}

export interface Polygon {
  type: "polygon"
  points: {
    x: number,
    y: number
  }[]
}

export type LayoutObject = Bndbox | Polygon

export const bufferSlice = createSlice({
                                         name: "annotations",
                                         initialState,
                                         reducers: {
                                           setCurrent: (state: BufferState, action: PayloadAction<number>) => {
                                             state.current = state.annotations.findIndex(annotation => {
                                               return annotation.id === action.payload
                                             })
                                           },
                                           addAnnotation: (state: BufferState, action: PayloadAction<Annotation>) => {
                                             state.annotations.push(action.payload)
                                           }
                                         },
                                         extraReducers: (builder) => {
                                           builder
                                             .addCase(
                                               fetchDatasetGroups.fulfilled,
                                               (state: BufferState, action: PayloadAction<DataGroup[]>) => {
                                                 state.downloadInfo = action.payload.map(group => ({
                                                   id: group.id,
                                                   imageUrl: group.files.find(file => file.fileName.includes(".jpg"))?._links.resource.href,
                                                   layoutUrl: group.files.find(file => file.fileName.includes(".xml"))?._links.resource.href
                                                 } as AnnotationInfo))
                                                 state.initialized = true
                                               }
                                             )
                                         }
                                       })

export const {
  setCurrent,
  addAnnotation
} = bufferSlice.actions

export default bufferSlice.reducer
