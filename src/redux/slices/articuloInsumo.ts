import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import IArticuloInsumo from '../../types/ArticuloInsumo';

interface IInitialState {
  articuloInsumo: IArticuloInsumo[];
}

const initialState: IInitialState = {
  articuloInsumo: [],
}

export const articuloInsumoSlice = createSlice({
  name: 'articuloInsumoState',
  initialState,
  reducers: {
    setArticuloInsumo: (state, action: PayloadAction<IArticuloInsumo[]>) => {
      state.articuloInsumo = action.payload;
    },
    resetArticuloInsumo: (state) => {
      state.articuloInsumo = [];
    }
  },
});

export const { setArticuloInsumo, resetArticuloInsumo } = articuloInsumoSlice.actions;

export default articuloInsumoSlice.reducer;
