import React, { useEffect, useState } from "react";
import { Box, Typography, Button, Container } from "@mui/material";
import { Add } from "@mui/icons-material";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import TableComponent from "../Table/Table";
import SearchBar from "../common/SearchBar";
import { setPromocion } from "../../redux/slices/Promocion";
import PromocionService from "../../services/PromocionService";
import Row from "../../types/Row";
import Column from "../../types/Column";
import { handleDelete, handleSearch } from "../../utils/utilities";


const Promocion: React.FC = () => {
  // Obtiene la función de despacho de acciones de Redux.
  const dispatch = useAppDispatch();
  // Obtiene el estado global de Redux relacionado con las promociones.
  const globalPromociones = useAppSelector(
    (state) => state.promocion.promocion
  );

  const url = import.meta.env.VITE_API_URL;
  const promocionService = new PromocionService();

  // Estado local para almacenar los datos filtrados.
  const [filteredData, setFilteredData] = useState<Row[]>([]);


  const fetchPromociones = async () => {
    try {
      // Obtiene todas las promociones.
      const promociones = await promocionService.getAll(url + 'promociones')       
       // Envía las promociones al estado global de Redux.
      dispatch(setPromocion(promociones)); 
      // Establece los datos filtrados para su visualización.
      setFilteredData(promociones); 
    } catch (error) {
      console.error("Error al obtener las promociones:", error);
    }
  };


  // Efecto que se ejecuta al cargar el componente para obtener las promociones.
  useEffect(() => {
    fetchPromociones();
  }, [dispatch]);

  // Llama a la función handleSearch cuando se realiza una búsqueda
  const onSearch = (query: string) => {
    handleSearch(query, globalPromociones, 'denominacion', setFilteredData);
  };

    // Función para editar la promoción
    const handleEdit = (index: number) => {
      console.log("Editar la promoción en el índice", index);
    };
  
    const onDelete = async (index: number) => {
      handleDelete(
        index,
        promocionService,
        filteredData,
        fetchPromociones,
        '¿Estás seguro de eliminar esta promoción?',
        'Promoción eliminada correctamente.',
        'Hubo un problema al eliminar la promoción.',
        url + 'promociones'
      );
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
          <SearchBar onSearch={onSearch} />
        </Box>
        <TableComponent data={filteredData} columns={columns} onDelete={onDelete} onEdit={handleEdit} />
      </Container>
    </Box>
  );
};


export default Promocion;
