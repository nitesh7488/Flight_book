import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api";

interface BookingState {
  currentBookingId: number | null;
  bookingDetails: any | null;
  loading: boolean;
  error: string | null;
}

const initialState: BookingState = {
  currentBookingId: null,
  bookingDetails: null,
  loading: false,
  error: null,
};

export const createBooking = createAsyncThunk(
  "booking/create",
  async (
    payload: {
      flightId: number;
      passengers: number;
      passengerName: string;
      passengerEmail: string;
    },
    thunkAPI
  ) => {
    try {
      const res = await api.post("/booking/create", payload);
      return res.data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Booking failed"
      );
    }
  }
);

export const getBookingById = createAsyncThunk(
  "booking/getById",
  async (id: number, thunkAPI) => {
    try {
      const res = await api.get(`/booking/${id}`);
      return res.data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Fetch failed"
      );
    }
  }
);

const bookingSlice = createSlice({
  name: "booking",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(createBooking.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createBooking.fulfilled, (state, action: any) => {
        state.loading = false;
        state.currentBookingId = action.payload.id;
      })
      .addCase(createBooking.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getBookingById.pending, (state) => {
        state.loading = true;
      })
      .addCase(getBookingById.fulfilled, (state, action: any) => {
        state.loading = false;
        state.bookingDetails = action.payload;
      })
      .addCase(getBookingById.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default bookingSlice.reducer;
