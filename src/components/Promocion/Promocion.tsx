import React, { useEffect, useState } from "react";
import { Box, Typography, Button, Container } from "@mui/material";
import { Add } from "@mui/icons-material";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import TableComponent from "../Table/Table";
import SearchBar from "../common/SearchBar";
import PromocionType from "../../types/Promocion";
import { setPromocion } from "../../redux/slices/Promocion";
import PromocionService from "../../services/PromocionService";
import Swal from "sweetalert2";

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

  // Función para manejar la búsqueda de promociones.
  const handleSearch = (query: string) => {
    // Filtra las promociones globales según la consulta de búsqueda.
    const filtered = globalPromociones.filter((promocion: PromocionType) =>
      promocion.denominacion.toLowerCase().includes(query.toLowerCase())
    );
    // Establece los datos filtrados para su visualización.
    setFilteredData(filtered);
  };

    // Función para editar la promoción
    const handleEdit = (index: number) => {
      console.log("Editar la promoción en el índice", index);
    };
  
    // Función para eliminar la promoción
    const handleDelete = async (index: number) => {
      const promocionId = filteredData[index].id.toString(); // Convertimos el ID a string
      const result = await Swal.fire({
        title: '¿Estás seguro?',
        text: 'Esta acción eliminará la promoción. ¿Quieres continuar?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
      });
  
      if (result.isConfirmed) {
        try {
          await promocionService.delete(url + 'promociones', promocionId);
          // Vuelve a obtener las promociones después de la eliminación
          fetchPromociones(); 
          Swal.fire(
            '¡Eliminado!',
            'La promoción ha sido eliminado correctamente.',
            'success'
          );
        } catch (error) {
          console.error("Error al eliminar la promoción:", error);
          Swal.fire(
            'Error',
            'Hubo un problema al eliminar La promoción.',
            'error'
          );
        }
      }
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
        <TableComponent data={filteredData} columns={columns} onDelete={handleDelete} onEdit={handleEdit} />
      </Container>
    </Box>
  );
};


export default Promocion;
