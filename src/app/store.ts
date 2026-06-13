// src/app/store.ts
import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // localStorage
import { combineReducers } from 'redux';
import authReducer from '../features/auth/authSlice';
import addressReducer from '../features/address/addressSlice';
import categoryReducer from '../features/category/categorySlice';
import productReducer from '../features/product/productSlice';
import sellerProductReducer from '../features/sellerProduct/sellerProductSlice';
import cartReducer from '../features/cart/cartSlice';
import orderReducer from '../features/order/orderSlice';
import wishList from '../features/wishlist/wishlistSlice';
import verifyRoleReducer from '../features/roles/verifyRoleSlice';
import reviewReducer from '../features/reviews/reviewSlice';
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth'], // only persist auth
};

const rootReducer = combineReducers({
  auth: authReducer,
  address: addressReducer,
  category: categoryReducer,
  product: productReducer,
  sellerProduct: sellerProductReducer,
  cart: cartReducer,
  order: orderReducer,
  wishlist: wishList,
  roles: verifyRoleReducer,
  reviews: reviewReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
