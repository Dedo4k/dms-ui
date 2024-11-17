import axios from "axios";
import {Dataset} from "../models/Dataset";
import {ApiResponse} from "../types/types";
import {DataGroup} from "../models/DataGroup";
import {store} from "../store/Store";
import {DataFile} from "../models/DataFile";
import {Pagination} from "../hooks/PaginationHook";

const datasetApi = axios.create({
  baseURL: process.env.REACT_APP_DATASETS_API_URL
})

datasetApi.interceptors.request.use(
  (config) => {
    const user = store.getState().authState.user

    if (user) {
      config.headers['X-User-Id'] = user.id
    }

    return config
  },
  (error) => Promise.reject(error)
);

export const getDatasets = async (pagination?: Pagination): Promise<ApiResponse<Dataset[]>> => {
  const response = await datasetApi.get("/list", {
    params: {
      size: pagination?.size,
      page: pagination?.number
    }
  });

  const body = response.data
  const page = body.page;

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

export const getGroups = async (datasetId: number): Promise<ApiResponse<DataGroup[]>> => {
  const response = await datasetApi.get(`/${datasetId}/groups`)

  return {
    data: response.data._embedded?.groups || []
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

  const blobUrl = URL.createObjectURL(blob);

  const link = document.createElement('a')
  link.href = blobUrl
  link.download = filename
  link.click()

  link.remove();
  URL.revokeObjectURL(blobUrl);
}

export const downloadFile = (file: DataFile) => {
  const user = store.getState().authState.user

  if (!user) {
    return
  }

  const headers = new Headers();
  headers.append("X-User-Id", user.id.toString())

  let filename: string | undefined = ""

  fetch(file._links.resource.href, {headers: headers})
    .then(response => {
      if (!response.ok) {
        throw new Error()
      }

      const contentDisposition = response.headers.get("Content-Disposition")

      if (!contentDisposition) {
        throw new Error()
      }

      const match = contentDisposition.match(/filename="(.+?)"/);

      if (match && match[1]) {
        filename = match[1]
      }

      return response.blob()
    })
    .then(blob => {
      const link = document.createElement('a')
      link.href = URL.createObjectURL(blob)
      link.download = filename!
      link.click()
    })
    .catch(error => console.error('Error downloading file:', error));
}
