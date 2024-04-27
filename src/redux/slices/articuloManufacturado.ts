import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import ArticuloManufacturado from '../../types/ArticuloManufacturado';

interface IInitialState {
  articuloManufacturado: ArticuloManufacturado[];
}

const initialState: IInitialState = {
  articuloManufacturado: [],
}

export const articuloManufacturadoSlice = createSlice({
  name: 'articuloManufacturadoState',
  initialState,
  reducers: {
    setArticuloManufacturado: (state, action: PayloadAction<ArticuloManufacturado[]>) => {
      state.articuloManufacturado = action.payload;
    },
    resetArticuloManufacturado: (state) => {
      state.articuloManufacturado = [];
    }
  },
})

export const { setArticuloManufacturado, resetArticuloManufacturado } = articuloManufacturadoSlice.actions;

export default articuloManufacturadoSlice.reducer;
