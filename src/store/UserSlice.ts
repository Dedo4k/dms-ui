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
import { User } from "../models/User"

export interface UserAuthState {
  user: User | null
  token: string | null
}

const initialState: UserAuthState = {
  user: {
    id: 3,
    name: "Vlad",
    surname: "Lailo",
    email: "lailo.vlad@gmail.com"
  },
  token: "sadf3fdsdjhfh7yh2983hjd7sa91230-fiu09eh02i3"
}

export const userSlice = createSlice({
                                       name: "user",
                                       initialState,
                                       reducers: {
                                         login: (state: UserAuthState, action: PayloadAction<User>) => {
                                           state.user = action.payload
                                         }
                                       }
                                     })

export const {login} = userSlice.actions

export default userSlice.reducer
