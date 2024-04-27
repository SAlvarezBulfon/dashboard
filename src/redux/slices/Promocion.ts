import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import Promocion from '../../types/Promocion';

interface IInitialState {
  promocion: Promocion[];
}

const initialState: IInitialState = {
  promocion: [],
}

export const PromocionSlice = createSlice({
  name: 'promocionState',
  initialState,
  reducers: {
    setPromocion: (state, action: PayloadAction<Promocion[]>) => {
      state.promocion = action.payload;
    },
    resetPromocion: (state) => {
      state.promocion = [];
    }
  },
});

export const { setPromocion, resetPromocion } = PromocionSlice.actions;

export default PromocionSlice.reducer;