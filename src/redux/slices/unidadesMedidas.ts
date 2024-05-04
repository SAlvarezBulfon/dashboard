import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import UnidadMedida from '../../types/UnidadMedida';


interface IInitialState {
  unidadMedida: UnidadMedida[];
}

const initialState: IInitialState = {
    unidadMedida: [],
}

export const unidadMedidaSlice = createSlice({
  name: 'unidadMedidaState',
  initialState,
  reducers: {
    setUnidadMedida: (state, action: PayloadAction<UnidadMedida[]>) => {
      state.unidadMedida = action.payload;
    },
    resetUnidadMedida: (state) => {
      state.unidadMedida = [];
    }
  },
})

export const { setUnidadMedida, resetUnidadMedida } = unidadMedidaSlice.actions;

export default unidadMedidaSlice.reducer;