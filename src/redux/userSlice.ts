import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { RootState } from "./store";
import { IUserData } from "../interface/user";
import { mockData } from "../mockData/mockData";

interface IUserSlice {
  users: IUserData[];
}

const initialState: IUserSlice = { users: [...mockData] };

export const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    setUsers: (state, action: PayloadAction<IUserData[]>) => {
      state.users = action.payload;
    },
  },
});

export const { setUsers } = userSlice.actions;

export const selectCount = (state: RootState) => state.userData;

export default userSlice.reducer;
