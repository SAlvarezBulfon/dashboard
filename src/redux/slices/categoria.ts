import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import Categoria from '../../types/Categoria';


interface IInitialState {
  categoria: Categoria[];
}

const initialState: IInitialState = {
  categoria: [],
}

export const categoriaSlice = createSlice({
  name: 'categoriaState',
  initialState,
  reducers: {
    setCategoria: (state, action: PayloadAction<Categoria[]>) => {
      state.categoria = action.payload;
    },
    resetCategoria: (state) => {
      state.categoria = [];
    }
  },
})

export const { setCategoria, resetCategoria } = categoriaSlice.actions;

export default categoriaSlice.reducer;