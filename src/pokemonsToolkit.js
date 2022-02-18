import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const defaultState = {
  data: [],
  offset: 0,
  isPending: false,
  requestId: null
};

const fetchData = createAsyncThunk(
  "pokemons/fetchPokemons",
  async (howMuchPokemons = 10, thunkAPI) => {
    try {
      const { pokemons } = thunkAPI.getState();

      if (pokemons.isPending && pokemons.requestId !== thunkAPI.requestId) {
        return;
      }

      const response = await fetch(
        `https://pokeapi.co/api/v2/pokemon?limit=${howMuchPokemons}&offset=${pokemons.offset}`
      );

      return response.json();
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

const slice = createSlice({
  name: "pokemons",
  initialState: defaultState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchData.pending, (state, action) => {
        if (state.isPending) {
          return;
        }

        state.isPending = true;
        state.requestId = action.meta.requestId;
      })
      .addCase(fetchData.fulfilled, (state, { payload }) => {
        if (!payload) {
          return;
        }

        const { results } = payload;

        state.data.push(...results);
        state.offset += results.length;
        state.isPending = false;
        state.requestId = null;
      })
      .addCase(fetchData.rejected, (state, { error }) => {
        state.error = error.message;
        state.isPending = false;
        state.requestId = null;
      });
  }
  // extraReducers: {
  //   [fetchData.pending]: (state, action) => {
  //     if (state.isPending) {
  //       return;
  //     }

  //     state.isPending = true;
  //     state.requestId = action.meta.requestId;
  //   },
  //   [fetchData.fulfilled]: (state, { payload }) => {
  //     if (!payload) {
  //       return;
  //     }

  //     const { results } = payload;

  //     state.data.push(...results);
  //     state.offset += results.length;
  //     state.isPending = false;
  //     state.requestId = null;
  //   },
  //   [fetchData.rejected]: (state, { error }) => {
  //     state.error = error.message;
  //     state.isPending = false;
  //     state.requestId = null;
  //   }
  // }
});

export { fetchData };

export default slice.reducer;
