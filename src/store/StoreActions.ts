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

import { createAsyncThunk } from "@reduxjs/toolkit"
import { DataGroup } from "../models/DataGroup"
import { Dataset } from "../models/Dataset"
import { getDataset, getGroups } from "../services/DatasetApi"
import { addAnnotation, Annotation, AnnotationInfo } from "./BufferSlice"
import { RootState } from "./Store"

export const fetchDataset = createAsyncThunk<Dataset, number>(
  "fetchDataset",
  async (datasetId: number) => {
    const response = await getDataset(datasetId)

    return response.data
  }
)

export const fetchDatasetGroups = createAsyncThunk<DataGroup[], number>(
  "fetchDatasetGroups",
  async (datasetId: number) => {
    const response = await getGroups(datasetId)

    return response.data
  }
)

export const fillBuffer = createAsyncThunk(
  "fillBuffer",
  async (_,
         {
           getState,
           dispatch
         }) => {
    const {
      current,
      cursor,
      size,
      loadFactor,
      downloadInfo,
      annotations
    } = (getState() as RootState).bufferState

    const nextDownload = size * loadFactor - annotations.length + current
    const prevDownload = size - size * loadFactor - current

    let nextEndIndex = cursor + annotations.length - current + nextDownload
    let prevEndIndex = cursor - current - prevDownload

    if (nextEndIndex >= downloadInfo.length) {
      nextEndIndex = downloadInfo.length - 1
    }

    if (prevEndIndex < 0) {
      prevEndIndex = 0
    }

    const nextDownloadInfo = downloadInfo.slice(cursor, nextEndIndex)
    const prevDownloadInfo = downloadInfo.slice(prevEndIndex, cursor)

    for (const downloadInfo of [...nextDownloadInfo, ...prevDownloadInfo]) {
      const annotation = await dispatch(fetchAnnotation(downloadInfo)).unwrap()
      dispatch(addAnnotation(annotation))
    }
  }
)

export const fetchAnnotation = createAsyncThunk<Annotation, AnnotationInfo>(
  "fetchAnnotation",
  async (annotationInfo: AnnotationInfo,
         {
           getState
         }) => {
    const user = (getState() as RootState).authState.user

    if (!user) {
      throw new Error("User is not authenticated")
    }

    const headers = {
      "X-User-Id": user.id.toString()
    }

    const imagePromise = fetch(annotationInfo.imageUrl, {
      headers: headers
    }).then(res => res.blob())

    const layoutPromise = fetch(annotationInfo.layoutUrl, {
      headers: headers
    }).then(res => res.blob())

    const [imageBlob, layoutBlob] = await Promise.all([imagePromise, layoutPromise])

    return {
      id: annotationInfo.id,
      imageUrl: URL.createObjectURL(imageBlob),
      layout: await layoutBlob.text()
    } as Annotation
  }
)
