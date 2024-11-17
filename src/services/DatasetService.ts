import {getDataset, getDatasets, getGroups} from "./DatasetApi";
import {addDataset, addDatasets, addGroups} from "../store/DatasetSlice";
import {store} from "../store/Store";
import {Pagination} from "../hooks/PaginationHook";

export const fetchDatasets = async (pagination?: Pagination) => {
  const apiResponse = await getDatasets(pagination);

  store.dispatch(addDatasets(apiResponse.data))
}

export const fetchDataset = async (datasetId: number) => {
  const apiResponse = await getDataset(datasetId);

  store.dispatch(addDataset(apiResponse.data))
}

export const fetchGroups = async (datasetId: number) => {
  const apiResponse = await getGroups(datasetId);

  store.dispatch(addGroups({datasetId: datasetId, groups: apiResponse.data}))
}
