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
import { fetchDataset, fetchDatasetGroups } from "./StoreActions"

interface EditorState {
  dataset: Dataset | null
  status: "initial" | "loading" | "loaded" | "initialized" | "error"
}

const initialState: EditorState = {
  dataset: null,
  status: "initial"
}

export const editorSlice = createSlice({
                                         name: "editor",
                                         initialState,
                                         reducers: {
                                           setDataset: (state: EditorState, action: PayloadAction<Dataset>) => {
                                             state.dataset = action.payload
                                           }
                                         },
                                         extraReducers: (builder) => {
                                           builder
                                             .addCase(fetchDataset.pending, (state) => {
                                               state.status = "loading"
                                             })
                                             .addCase(fetchDataset.fulfilled, (state, action) => {
                                               state.dataset = action.payload
                                               state.status = "loaded"
                                             })
                                             .addCase(fetchDataset.rejected, (state) => {
                                               state.status = "error"
                                             })
                                             .addCase(fetchDatasetGroups.pending, (state) => {
                                               state.status = "loading"
                                             })
                                             .addCase(fetchDatasetGroups.fulfilled, (state, action) => {
                                               if (state.dataset) {
                                                 state.dataset.groups = action.payload
                                                 state.status = "initialized"
                                               } else {
                                                 state.status = "error"
                                               }
                                             })
                                             .addCase(fetchDatasetGroups.rejected, (state) => {
                                               state.status = "error"
                                             })
                                         }
                                       })

export const {setDataset} = editorSlice.actions

export default editorSlice.reducer
