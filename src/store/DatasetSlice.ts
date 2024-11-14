import {Dataset} from "../models/Dataset";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {Page} from "../types/types";

export interface DatasetsState {
  datasets: Dataset[]
  page: Page
}

const initialState: DatasetsState = {
  datasets: [],
  page: {
    number: 0,
    totalPages: 0,
    size: 0,
    totalElements: 0
  }
}

export const datasetsSlice = createSlice({
  name: 'datasets',
  initialState,
  reducers: {
    addDatasets: (state: DatasetsState, action: PayloadAction<{ datasets: Dataset[], page: Page }>) => {
      state.datasets = action.payload.datasets
      state.page = action.payload.page
    },
    setPageSize: (state: DatasetsState, action: PayloadAction<number>) => {
      state.page.size = action.payload
      state.page.number = 0
    },
    setPageNumber: (state: DatasetsState, action: PayloadAction<number>) => {
      state.page.number = action.payload
    },
  }
})

export const {addDatasets, setPageSize, setPageNumber} = datasetsSlice.actions

export default datasetsSlice.reducer
