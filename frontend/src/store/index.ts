import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage"; // localStorage
import authReducer from "./authSlice";
import flightReducer from "./flightSlice";
import bookingReducer from "./bookingSlice";

const rootReducer = combineReducers({
  auth: authReducer,
  flights: flightReducer,
  booking: bookingReducer,
});

const persistConfig = {
  key: "flight-app",
  storage,
  whitelist: ["auth"], // save only auth persist
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
