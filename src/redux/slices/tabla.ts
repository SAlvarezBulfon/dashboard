import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Definimos la interfaz para el estado inicial del slice
interface IInitialState<T> {
  dataTable: T[]; // Datos de la tabla de tipo T
  elementActive: null | T; // Elemento activo seleccionado de tipo T
}

// Estado inicial del slice
const initialState: IInitialState<any> = {
  dataTable: [], // Inicialmente la tabla está vacía
  elementActive: null, // No hay ningún elemento activo seleccionado inicialmente
};

// Interfaz para la acción del payload personalizado
interface PayloadSetElement<T> {
  element: T; // Elemento de tipo T
}

// Creamos un slice con Redux Toolkit para manejar la tabla
const TablaReducer = createSlice({
  name: "TablaReducer", // Nombre del slice
  initialState, // Estado inicial del slice
  reducers: {
    // Reducer para establecer los datos de la tabla
    setDataTable(state, action: PayloadAction<any[]>) {
      state.dataTable = action.payload; // Actualizamos los datos de la tabla con los datos proporcionados
    },
    // Reducer para establecer el elemento activo
    setElementActive(state, action: PayloadAction<PayloadSetElement<any>>) {
      state.elementActive = action.payload.element; // Establecemos el elemento activo con el elemento proporcionado en el payload
    },
    // Reducer para eliminar el elemento activo
    removeElementActive(state) {
      state.elementActive = null; // Eliminamos el elemento activo estableciéndolo como null
    },
  },
});

// Exportamos los actions generados por el slice
export const { setDataTable, setElementActive, removeElementActive } =
  TablaReducer.actions;

// Exportamos el reducer generado por el slice
export default TablaReducer.reducer;
