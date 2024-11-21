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
import { Dataset } from "../models/Dataset"

export interface DatasetsState {
  datasets: Dataset[]
}

const initialState: DatasetsState = {
  datasets: []
}

export const datasetsSlice = createSlice(
  {
    name: "datasetsSlice",
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
      }
    }
  })

export const {
  addDatasets,
  addDataset
} = datasetsSlice.actions

export default datasetsSlice.reducer
