import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import Empresa from '../../types/Empresa';


interface IInitialState {
  empresa: Empresa[];
}

const initialState: IInitialState = {
  empresa: [],
}

export const empresaSlice = createSlice({
  name: 'empresaState',
  initialState,
  reducers: {
    setEmpresa: (state, action: PayloadAction<Empresa[]>) => {
      state.empresa = action.payload;
    },
    resetEmpresa: (state) => {
      state.empresa = [];
    }
  },
})

export const { setEmpresa, resetEmpresa } = empresaSlice.actions;

export default empresaSlice.reducer;