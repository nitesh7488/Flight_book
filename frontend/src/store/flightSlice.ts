import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api";

export interface Flight {
  id: number;
  fromCity: string;
  toCity: string;
  departureTime: string;
  arrivalTime: string;
  airlineName: string;
  airlineLogoUrl: string;
  flightNumber: string;
  durationMin: number;
  price: number;
}

export interface SearchRequest {
  from: string;
  to: string;
  date: string;
  passengers: number;
  page?: number;
  limit?: number;
  sortBy?: "price" | "departure" | "duration";
  sortOrder?: "asc" | "desc";
  minPrice?: number;
  maxPrice?: number;
  maxDuration?: number;
  airlines?: string[];
}

interface FlightState {
  flights: Flight[];
  selectedFlight: Flight | null;
  loading: boolean;
  error: string | null;
  passengers: number;
  page: number;
  totalPages: number;
  total: number;
}

const initialState: FlightState = {
  flights: [],
  selectedFlight: null,
  loading: false,
  error: null,
  passengers: 1,
  page: 1,
  totalPages: 1,
  total: 0,
};

export const searchFlights = createAsyncThunk(
  "flights/search",
  async (payload: SearchRequest, thunkAPI) => {
    try {
      const res = await api.post("/flights/search", payload);
      return res.data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Search failed"
      );
    }
  }
);

const flightSlice = createSlice({
  name: "flights",
  initialState,
  reducers: {
    setSelectedFlight(state, action) {
      state.selectedFlight = action.payload;
    },
    clearFlights(state) {
      state.flights = [];
      state.page = 1;
      state.total = 0;
      state.totalPages = 1;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(searchFlights.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchFlights.fulfilled, (state, action: any) => {
        state.loading = false;
        state.flights = action.payload.flights;
        state.passengers = action.payload.passengers;
        state.page = action.payload.page;
        state.totalPages = action.payload.totalPages;
        state.total = action.payload.total;
      })
      .addCase(searchFlights.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setSelectedFlight, clearFlights } = flightSlice.actions;
export default flightSlice.reducer;
