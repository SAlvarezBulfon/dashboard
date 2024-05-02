import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import Sucursal from '../../types/Sucursal';


interface IInitialState {
  sucursal: Sucursal[];
}

const initialState: IInitialState = {
  sucursal: [],
}

export const sucursalSlice = createSlice({
  name: 'sucursalState',
  initialState,
  reducers: {
    setSucursal: (state, action: PayloadAction<Sucursal[]>) => {
      state.sucursal = action.payload;
    },
    resetSucursal: (state) => {
      state.sucursal = [];
    }
  },
})

export const { setSucursal, resetSucursal } = sucursalSlice.actions;

export default sucursalSlice.reducer;