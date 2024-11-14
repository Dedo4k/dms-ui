import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {User} from "../models/User";

export interface UserAuthState {
  user: User | null
  token: string | null
}

const initialState: UserAuthState = {
  user: {
    id: 1,
    name: "Vlad",
    surname: "Lailo",
    email: "lailo.vlad@gmail.com"
  },
  token: "sadf3fdsdjhfh7yh2983hjd7sa91230-fiu09eh02i3"
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    login: (state: UserAuthState, action: PayloadAction<User>) => {
      state.user = action.payload
    }
  }
})

export const {login} = userSlice.actions

export default userSlice.reducer
