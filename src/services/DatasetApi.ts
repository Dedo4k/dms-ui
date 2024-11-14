import axios from "axios";
import {Dataset} from "../models/Dataset";
import {ApiResponse, Page} from "../types/types";
import {DataGroup} from "../models/DataGroup";
import {store} from "../store/Store";

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

export const getDatasets = async (): Promise<ApiResponse<{ datasets: Dataset[], page: Page }>> => {
  const page = store.getState().datasetsState.page;

  const response = await datasetApi.get("/list", {
    params: {
      size: page.size,
      page: page.number
    }
  });

  let body = response.data;

  return {
    data: {
      datasets: body._embedded.datasets,
      page: body.page
    }
  }
}

export const getGroups = async (datasetId: number): Promise<ApiResponse<DataGroup>> => {
  const response = await datasetApi.get(`/${datasetId}/groups`);

  return {
    data: {
      ...response.data.page,
      content: response.data._embedded.groups
    }
  }
}
