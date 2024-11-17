import {Dataset} from "../models/Dataset";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {DataGroup} from "../models/DataGroup";

export interface DatasetsState {
  datasets: Dataset[]
}

const initialState: DatasetsState = {
  datasets: []
}

export const datasetsSlice = createSlice({
  name: 'datasets',
  initialState,
  reducers: {
    addDatasets: (state: DatasetsState, action: PayloadAction<Dataset[]>) => {
      state.datasets = action.payload
    },
    addDataset: (state: DatasetsState, action: PayloadAction<Dataset>) => {
      let dataset = state.datasets.find(dataset => dataset.id === action.payload.id)
      if (!dataset) {
        state.datasets.push(action.payload)
      } else {
        dataset = action.payload
      }
    },
    addGroups: (state: DatasetsState, action: PayloadAction<{datasetId: number, groups: DataGroup[]}>) => {
      let dataset = state.datasets.find(dataset => dataset.id === action.payload.datasetId)
      if (dataset) {
        dataset.groups = action.payload.groups
      }
    }
  }
})

export const {addDatasets, addDataset, addGroups} = datasetsSlice.actions

export default datasetsSlice.reducer
