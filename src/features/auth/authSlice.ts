// src/features/auth/authSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  registerUser,
  registerAsseller,
  registerBranch,
  loginUser,
  forgetPasswordRequest,
  verifyOtp,
  resetPassword,
  changePassword,
  getUserProfile,
  updateUserProfile,
  getUserBranch,
  updateBranch,
  deleteBranch,
  getgetprovinces,
  googleLogin,
} from "./authThunk";

interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  roles: string;
  // Add more fields if needed
}

interface Province {
  id: number;
  name: string;
  // other properties
}

interface AuthState {
  user: User | null;
  branches: [];
  userprofile: any;
  provinces: Province[];
  token: string | null;
  loading: boolean;
  error: string | null;
  message: string | null;
}

const initialState: AuthState = {
  user: null,
  branches: [],
  userprofile: null,
  provinces: [],
  token: localStorage.getItem("token"),
  loading: false,
  error: null,
  message: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      state.user = null;
      state.token = null;
      state.userprofile = null;
    },
    clearError: (state) => {
      state.error = null;
      state.message = null;
    },
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.loading = false;
        state.message = "Registration successful";
      })
      .addCase(registerUser.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(registerAsseller.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerAsseller.fulfilled, (state) => {
        state.loading = false;
        state.message = "Registration successful";
      })
      .addCase(
        registerAsseller.rejected,
        (state, action: PayloadAction<any>) => {
          state.loading = false;
          state.error = action.payload;
        }
      )
      .addCase(registerBranch.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerBranch.fulfilled, (state) => {
        state.loading = false;
        state.message = "Registration successful";
      })
      .addCase(registerBranch.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getUserBranch.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserBranch.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.branches = action.payload;
        state.message = "Fetch User-Branch successful";
      })
      .addCase(getUserBranch.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
      })
      .addCase(updateBranch.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateBranch.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.message = "Branch updated successfully";
        const index = state.branches.findIndex(
          (b: any) => b.id === action.payload.id
        );
        if (index !== -1) state.branches[index] = action.payload;
      })
      .addCase(updateBranch.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to update branch";
      })

      // ✅ Delete branch
      .addCase(deleteBranch.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        deleteBranch.fulfilled,
        (state, action: PayloadAction<number>) => {
          state.loading = false;
          state.message = "Branch deleted successfully";
          state.branches = state.branches.filter(
            (b: any) => b.id !== action.payload
          );
        }
      )
      .addCase(deleteBranch.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to delete branch";
      })

      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        loginUser.fulfilled,
        (state, action: PayloadAction<{ token: string; user: User }>) => {
          state.loading = false;
          state.token = action.payload.token;
          state.user = action.payload.user;
        }
      )
      .addCase(loginUser.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(googleLogin.pending, (state) => {
  state.loading = true;
  state.error = null;
})
.addCase(googleLogin.fulfilled, (state, action: PayloadAction<any>) => {
  state.loading = false;
  state.user = action.payload.user;
  state.token = action.payload.tokens.access;
})
.addCase(googleLogin.rejected, (state, action: PayloadAction<any>) => {
  state.loading = false;
  state.error = action.payload;
})


      .addCase(
        getUserProfile.fulfilled,
        (state, action: PayloadAction<User>) => {
          state.userprofile = action.payload;
        }
      )

      // .addCase(updateUserProfile.fulfilled, (state, action: PayloadAction<User>) => {
      //   console.log("Updated user payload:", action.payload);
      //   state.user = action.payload;
      // })
      .addCase(
        updateUserProfile.fulfilled,
        (state, action: PayloadAction<User>) => {
          console.log("Updated user payload:", action.payload);
          // ❌ Don't change state.user
        }
      )

      .addCase(
        forgetPasswordRequest.fulfilled,
        (state, action: PayloadAction<{ message: string }>) => {
          state.message = action.payload.message;
        }
      )
      .addCase(
        verifyOtp.fulfilled,
        (state, action: PayloadAction<{ message: string }>) => {
          state.message = action.payload.message;
        }
      )
      .addCase(
        resetPassword.fulfilled,
        (state, action: PayloadAction<{ message: string }>) => {
          state.message = action.payload.message;
        }
      )
      .addCase(
        changePassword.fulfilled,
        (state, action: PayloadAction<{ message: string }>) => {
          state.message = action.payload.message;
        }
      )
      .addCase(
        getgetprovinces.fulfilled,
        (state, action: PayloadAction<{ provinces: any[] }>) => {
          // ✅ any use karein
          console.log(action.payload);
          
          state.provinces = action.payload.data;
        }
      );
  },
});

export const { logout, clearError, setUser } = authSlice.actions;
export default authSlice.reducer;
