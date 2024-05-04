import { configureStore } from '@reduxjs/toolkit'
import articuloManufacturadoSlice from '../slices/articuloManufacturado'
import { articuloInsumoSlice } from '../slices/articuloInsumo' 
import { PromocionSlice } from '../slices/Promocion'
import { categoriaSlice } from '../slices/categoria'
import { empresaSlice } from '../slices/empresa'
import { sucursalSlice } from '../slices/sucursal'
import modal from '../slices/modal'
import tabla from '../slices/tabla'
import { unidadMedidaSlice } from '../slices/unidadesMedidas'

export const store = configureStore({
  reducer: {
    articuloManufacturado: articuloManufacturadoSlice,
    articuloInsumo: articuloInsumoSlice.reducer, 
    promocion: PromocionSlice.reducer,
    categoria: categoriaSlice.reducer,
    empresa: empresaSlice.reducer,
    sucursal: sucursalSlice.reducer,
    modal: modal,
    tabla: tabla,
    unidadMedida: unidadMedidaSlice.reducer
  },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
