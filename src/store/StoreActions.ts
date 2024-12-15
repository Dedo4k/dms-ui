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
import { Pagination } from "../hooks/PaginationHook"
import { Annotation } from "../models/Annotation"
import { Config } from "../models/Config"
import { DataGroup } from "../models/DataGroup"
import { Dataset } from "../models/Dataset"
import { XmlToLayout } from "../services/AnnotationService"
import { getConfig, getDataset, getGroups } from "../services/DatasetApi"
import { RootState } from "./Store"

export const fetchDataset = createAsyncThunk<Dataset, number>(
  "fetchDataset",
  async (datasetId: number) => {
    const response = await getDataset(datasetId)

    return response.data
  }
)

export const fetchDatasetGroups = createAsyncThunk<DataGroup[], {
  datasetId: number,
  pagination: Pagination
}>(
  "fetchDatasetGroups",
  async ({
           datasetId,
           pagination
         }) => {
    const response = await getGroups(datasetId, pagination)

    return response.data
  }
)

export const fetchAnnotation = createAsyncThunk<Annotation>(
  "fetchAnnotation",
  async (_, {getState}) => {
    const {
      authState,
      editorState
    } = getState() as RootState

    if (!authState.user) {
      throw new Error("User is not authenticated")
    }

    const headers = {
      "X-User-Id": authState.user.id.toString()
    }

    const image = editorState.current?.files.find(file => file.fileName.includes(".jpg"))

    const imagePromise = image && fetch(image?._links.resource.href, {
      headers: headers
    }).then(res => res.blob())

    const xml = editorState.current?.files.find(file => file.fileName.includes(".xml"))

    const layoutPromise = xml && fetch(xml._links.resource.href, {
      headers: headers
    }).then(res => res.blob())

    const [imageBlob, layoutBlob] = await Promise.all([imagePromise, layoutPromise])

    let layout

    try {
      layout = layoutBlob && await XmlToLayout(layoutBlob)
    } catch (e) {

    }

    return {
      imageObjectUrl: imageBlob && URL.createObjectURL(imageBlob),
      layout
    }
  }
)

export const fetchDatasetConfig = createAsyncThunk<Config, number>(
  "fetchConfig",
  async (datasetId: number) => {
    const response = await getConfig(datasetId)

    return response.data
  }
)
