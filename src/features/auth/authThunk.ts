// src/features/auth/authThunk.ts
import { createAsyncThunk } from '@reduxjs/toolkit';
import { setUser } from './authSlice';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../../firebase';
import axios from 'axios';
import {
  registerUserAPI,
  registerSellerAPI,
  loginUserAPI,
  forgetPasswordRequestAPI,
  verifyOtpAPI,
  resetPasswordAPI,
  changePasswordAPI,
  getUserProfileAPI,
  updateUserProfileAPI,
  registerSellerBranch,
  fetchSellerBranch,
  updateSellerBranch,
   deleteSellerBranch ,
   getprovinces
} from './authAPI';

interface LoginPayload {
  email_or_phone: string;
  password: string;
}

interface LoginResponse {
  token: string;
  user: any; 
}

export const loginUser = createAsyncThunk<LoginResponse, LoginPayload>(
  'auth/login',
  async (payload, thunkAPI) => {
    try {
      const res = await loginUserAPI(payload);

      localStorage.setItem('accessToken', res.data.tokens.access);
      localStorage.setItem('refreshToken', res.data.tokens.refresh);
      // console.log(res.data);
      
      thunkAPI.dispatch(setUser(res.data.user));

      console.log('User:', res.data.user);

      await thunkAPI.dispatch(getUserProfile());
      

      return res.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const googleLogin = createAsyncThunk(
  "auth/googleLogin",
  async (_, thunkAPI) => {
    try {
      // 1️⃣ Firebase popup
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      // 2️⃣ Firebase ID token
      const idToken = await user.getIdToken();

      const payload = {
        displayName: user.displayName,
        email: user.email,
        phone_number: user.phoneNumber || "",
        photoUrl: user.photoURL,
        idToken,
        platform: "web",
      };

      // 3️⃣ Backend call
      const res = await axios.post(
        "https://api.ecoflaresolutions.com/account/google-login/",
        payload
      );

      // 4️⃣ Store tokens
      localStorage.setItem("accessToken", res.data.tokens.access);
      localStorage.setItem("refreshToken", res.data.tokens.refresh);

      // 5️⃣ Redux user set
      thunkAPI.dispatch(setUser(res.data.user));
      await thunkAPI.dispatch(getUserProfile());

      return res.data; // { tokens, user }
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Google login failed"
      );
    }
  }
);

export const registerUser = createAsyncThunk<any, any>('/register', async (payload, thunkAPI) => {
  try {
    const res = await registerUserAPI(payload);
    return res.data;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error);
  }
});
export const registerAsseller = createAsyncThunk<any, any>('/user-seller', async (payload, thunkAPI) => {
  try {
    const res = await registerSellerAPI(payload);
    return res.data;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error);
  }
});
export const registerBranch = createAsyncThunk<any, any>(
  '/user-seller-branch',
  async (payload, { rejectWithValue }) => {
    try {
      const res = await registerSellerBranch(payload);
      const data = res.data;

      // agar status 0 nahi hai to error return karo
      if (data.status !== 0) {
        return rejectWithValue(data.error);
      }

      return data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message || "Something went wrong");
    }
  }
);


// ✅ Update branch
export const updateBranch = createAsyncThunk<any, { id: number; data: any }>(
  'auth/updateBranch',
  async ({ id, data }, thunkAPI) => {
    try {
      const res = await updateSellerBranch(id, data);
      return res.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

// ✅ Delete branch
export const deleteBranch = createAsyncThunk<any, number>(
  'auth/deleteBranch',
  async (id, thunkAPI) => {
    try {
      await deleteSellerBranch(id);
      return id; // we'll use this to remove it from state
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const getUserBranch = createAsyncThunk<any>('auth/user-seller-branches', async (_, thunkAPI) => {
  try {
    const res = await fetchSellerBranch();
    // console.log(res);
    
    return res.data;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error);
  }
});
export const getUserProfile = createAsyncThunk<any>('auth/getProfile', async (_, thunkAPI) => {
  try {
    const res = await getUserProfileAPI();
    console.log(res.data);
    
    return res.data.user;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error);
  }
});

export const getgetprovinces = createAsyncThunk<any>('auth/getprovinces', async (_, thunkAPI) => {
  try {
    const res = await getprovinces();
    
    return res.data;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error);
  }
});



// export const loginUser = createAsyncThunk<LoginResponse, LoginPayload>(
//   'auth/login',
//   async (payload, thunkAPI) => {
//     try {
//       const res = await loginUserAPI(payload);

//       localStorage.setItem('accessToken', res.data.tokens.access);
//       localStorage.setItem('refreshToken', res.data.tokens.refresh);

//       console.log('User:', res.data.user);
//       return res.data;
//     } catch (error: any) {
//       return thunkAPI.rejectWithValue(error);
//     }
//   }
// );



export const logoutUser = createAsyncThunk('auth/logout', async (_, thunkAPI) => {
  try {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    thunkAPI.dispatch(setUser(null));
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error);
  }
});



// Repeat this typing style for the rest:
export const forgetPasswordRequest = createAsyncThunk<any, any>(
  'auth/forgetPasswordRequest',
  async (payload, thunkAPI) => {
    try {
      const res = await forgetPasswordRequestAPI(payload);
      return res.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const verifyOtp = createAsyncThunk<any, any>('auth/verifyOtp', async (payload, thunkAPI) => {
  try {
    const res = await verifyOtpAPI(payload);
    return res.data;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error);
  }
});


export const resetPassword = createAsyncThunk<any, any>(
  'auth/resetPassword',
  async (payload, thunkAPI) => {
    try {
      const res = await resetPasswordAPI(payload);
      return res.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const changePassword = createAsyncThunk<any, any>('auth/changePassword', async (payload, thunkAPI) => {
  try {
    const res = await changePasswordAPI(payload);
    return res.data;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error);
  }
});




export const updateUserProfile = createAsyncThunk<any, FormData>('auth/updateProfile', async (formData, thunkAPI) => {
  try {
    const res = await updateUserProfileAPI(formData);
    return res.data.data;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error);
  }
});
