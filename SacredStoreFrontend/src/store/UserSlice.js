import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  isAuthenticated: false,
  error: null, 
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
    },
     updateUser: (state, action) => {
      state.user = { ...state.user, ...action.payload }; // Merge existing user with updated payload
      state.error = null; // Clear any previous errors
    },
  },
});

export const { loginSuccess, logout , updateUser } = userSlice.actions;
export default userSlice.reducer;
