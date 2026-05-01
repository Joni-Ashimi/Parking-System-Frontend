import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type User = {
    id: string;
    email: string;
    name: string;
};

interface AuthState {
    user: User | null;
    accessToken: string | null;
    refreshToken : string | null;
}

const initialState: AuthState = {
    user: null,
    accessToken: null,
    refreshToken : null
};

const authSlice = createSlice({
    name: "authSlice",
    initialState,
    reducers: {
        loginSucces: (
            state,
            action: PayloadAction<{ user: User; accessToken: string, refreshToken : string }>
        ) => {
            state.user = action.payload.user;
            state.accessToken = action.payload.accessToken;
            state.refreshToken = action.payload.refreshToken;
        },

        logOut: (state) => {
            state.user = null;
            state.accessToken = null;
            state.refreshToken = null;
        },
    },
});

export const { loginSucces, logOut } = authSlice.actions;
export default authSlice.reducer;
  