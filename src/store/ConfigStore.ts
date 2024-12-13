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
import { Config } from "../models/Config"
import { fetchDatasetConfig } from "./StoreActions"

interface ConfigStoreState {
  defaultConfig: Config | null | undefined
  customConfig: CustomConfig
  activeClass: string | null
  status: "initial" | "loading" | "loaded" | "error"
}

interface CustomConfig {
  classes: string[]
}

const initialState: ConfigStoreState = {
  defaultConfig: undefined,
  customConfig: {classes: []},
  activeClass: null,
  status: "initial"
}

export const configStore = createSlice(
  {
    name: "configStore",
    initialState,
    reducers: {
      addClass: (state: ConfigStoreState, action: PayloadAction<string>) => {
        if (action.payload.length && !state.customConfig.classes.includes(action.payload)) {
          state.customConfig.classes.push(action.payload)
        }
      },
      removeClass: (state: ConfigStoreState, action: PayloadAction<string>) => {
        state.customConfig.classes = state.customConfig.classes.filter(ell => ell !== action.payload)
        if (state.activeClass === action.payload) {
          state.activeClass = state.defaultConfig?.classes[0] || state.customConfig.classes[0] || null
        }
      },
      setActiveClass: (state: ConfigStoreState, action: PayloadAction<string>) => {
        state.activeClass = action.payload
      }
    },
    extraReducers: (builder) => {
      builder
        .addCase(fetchDatasetConfig.pending, (state) => {
          state.status = "loading"
        })
        .addCase(fetchDatasetConfig.fulfilled, (state, action) => {
          state.defaultConfig = action.payload
          state.activeClass = state.defaultConfig.classes[0] || null
          state.status = "loaded"
        })
        .addCase(fetchDatasetConfig.rejected, (state) => {
          state.defaultConfig = null
          state.status = "error"
        })
    }
  }
)

export const {
  addClass,
  removeClass,
  setActiveClass
} = configStore.actions

export default configStore.reducer
