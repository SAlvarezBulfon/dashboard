import React, { useEffect, useState } from "react";
import { Box, Typography, Button, Container } from "@mui/material";
import { Add } from "@mui/icons-material";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import TableComponent from "../Table/Table";
import SearchBar from "../common/SearchBar";
import PromocionType from "../../types/Promocion";
import IPromocion from "../../types/Promocion";
import BackendClient from "../../services/BackendClient";
import { setPromocion } from "../../redux/slices/Promocion";

interface Row {
  [key: string]: any;
}

interface Column {
  id: keyof Row;
  label: string;
  renderCell: (rowData: Row) => JSX.Element;
}

const Promocion: React.FC = () => {
  // Obtiene la función de despacho de acciones de Redux.
  const dispatch = useAppDispatch();
  // Obtiene el estado global de Redux relacionado con las promociones.
  const globalPromociones = useAppSelector(
    (state) => state.promocion.promocion
  );

  // Estado local para almacenar los datos filtrados.
  const [filteredData, setFilteredData] = useState<Row[]>([]);

  // Efecto que se ejecuta al cargar el componente para obtener las promociones.
  useEffect(() => {
    const fetchPromociones = async () => {
      try {
        // Instancia un cliente BackendClient para obtener las promociones desde la API.
        const PromocionesClient = new BackendClient<IPromocion>('http://localhost:3000/promociones');

        // Obtiene todas las promociones.
        const promociones = await PromocionesClient.getAll();
        // Envía las promociones al estado global de Redux.
        dispatch(setPromocion(promociones)); 
        // Establece los datos filtrados para su visualización.
        setFilteredData(promociones); 
      } catch (error) {
        console.error("Error al obtener las promociones:", error);
      }
    };

    fetchPromociones();
  }, [dispatch]);

  // Función para manejar la búsqueda de promociones.
  const handleSearch = (query: string) => {
    // Filtra las promociones globales según la consulta de búsqueda.
    const filtered = globalPromociones.filter((promocion: PromocionType) =>
      promocion.denominacion.toLowerCase().includes(query.toLowerCase())
    );
    // Establece los datos filtrados para su visualización.
    setFilteredData(filtered);
  };

  // Columnas de la tabla de promociones.
  const columns: Column[] = [
    {
      id: "imagen",
      label: "Imagen",
      renderCell: (rowData) => (
        <img
          src={rowData.imagenes.length > 0 ? rowData.imagenes[0].url : ""}
          alt="Imagen"
          style={{ width: 50, height: 50 }}
        />
      ),
    },
    { id: "denominacion", label: "Nombre", renderCell: (rowData) => <>{rowData.denominacion}</> },
    { id: "fechaDesde", label: "Desde", renderCell: (rowData) => <>{rowData.fechaDesde}</> },
    { id: "fechaHasta", label: "Hasta", renderCell: (rowData) => <>{rowData.fechaHasta}</> },
    { id: "descripcionDescuento", label: "Descripción Descuento", renderCell: (rowData) => <>{rowData.descripcionDescuento}</> },
    { id: "precioPromocional", label: "Precio Promocional", renderCell: (rowData) => <>{rowData.precioPromocional}</> },
  ];

  return (
    <Box component="main" sx={{ flexGrow: 1, my: 2}}>
      <Container>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", my: 1 }}>
          <Typography variant="h5" gutterBottom>
            Promociones
          </Typography>
          <Button
            sx={{
              bgcolor: "#fb6376",
              "&:hover": {
                bgcolor: "#d73754",
              },
            }}
            variant="contained"
            startIcon={<Add />}
          >
            Promoción
          </Button>
        </Box>
        <Box sx={{ mt: 2 }}>
          <SearchBar onSearch={handleSearch} />
        </Box>
        <TableComponent data={filteredData} columns={columns} />
      </Container>
    </Box>
  );
};


export default Promocion;
