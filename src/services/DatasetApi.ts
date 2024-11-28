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

import axios from "axios"
import { Pagination } from "../hooks/PaginationHook"
import { Config } from "../models/Config"
import { DataGroup } from "../models/DataGroup"
import { Dataset } from "../models/Dataset"
import { store } from "../store/Store"
import { ApiResponse } from "../types/types"

const datasetApi = axios.create({
                                  baseURL: process.env.REACT_APP_DATASETS_API_URL
                                })

datasetApi.interceptors.request.use(
  (config) => {
    const user = store.getState().authState.user

    if (user) {
      config.headers["X-User-Id"] = user.id
    }

    return config
  },
  (error) => Promise.reject(error)
)

export const getDatasets = async (pagination?: Pagination): Promise<ApiResponse<Dataset[]>> => {
  const response = await datasetApi.get("/list", {
    params: {
      size: pagination?.size,
      page: pagination?.number
    }
  })

  const body = response.data
  const page = body.page

  if (page) {
    pagination?.setPagination(page)
  }

  return {
    data: body._embedded?.datasets || []
  }
}

export const getDataset = async (datasetId: number): Promise<ApiResponse<Dataset>> => {
  const response = await datasetApi.get(`/${datasetId}`)

  return {
    data: response.data
  }
}

export const getGroups = async (datasetId: number, pagination?: Pagination): Promise<ApiResponse<DataGroup[]>> => {
  const response = await datasetApi.get(`/${datasetId}/groups`, {
    params: {
      size: pagination?.size,
      number: pagination?.number
    }
  })

  const data = response.data
  const page = data.page

  if (page) {
    pagination?.setPagination(page)
  }

  return {
    data: data._embedded?.groups || []
  }
}

export const downloadDataset = async (datasetId: number) => {
  const response = await datasetApi.get(`/${datasetId}/download`, {
    responseType: "blob",
    params: {
      archiveType: "ZIP"
    }
  })

  const contentDisposition = response.headers["content-disposition"]

  if (!contentDisposition) {
    throw new Error("Content-Disposition header was not provided")
  }

  let filename = ""
  const match = contentDisposition.match(/filename="(.+?)"/)

  if (match && match[1]) {
    filename = match[1]
  }

  const blob = new Blob([response.data])

  const blobUrl = URL.createObjectURL(blob)

  const link = document.createElement("a")
  link.href = blobUrl
  link.download = filename
  link.click()

  link.remove()
  URL.revokeObjectURL(blobUrl)
}

export const getConfig = async (datasetId: number): Promise<ApiResponse<Config>> => {
  const response = await datasetApi.get(`/${datasetId}/config`)

  return {
    data: response.data
  }
}
