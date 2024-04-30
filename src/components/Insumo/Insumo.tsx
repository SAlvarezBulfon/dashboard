import { useState, useEffect } from "react";
import { Box, Typography, Button, Container } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import TableComponent from "../Table/Table";
import SearchBar from "../common/SearchBar";
import { Add } from "@mui/icons-material";
import BackendClient from "../../services/BackendClient";
import IArticuloInsumo from "../../types/ArticuloInsumo";
import { setArticuloInsumo } from "../../redux/slices/articuloInsumo";
import InsumoService from "../../services/InsumoService";

interface Row {
  [key: string]: any;
}

interface Column {
  id: keyof Row;
  label: string;
  renderCell: (rowData: Row) => JSX.Element;
}

const Insumo = () => {
  // Obtiene la función de despacho de acciones de Redux.
  const dispatch = useAppDispatch();
  // Obtiene el estado global de Redux relacionado con los artículos de insumo.
  const globalArticulosInsumos = useAppSelector((state) => state.articuloInsumo.articuloInsumo);
  const url = import.meta.env.VITE_API_URL;
  const insumoService = new InsumoService();

  // Estado local para almacenar los datos filtrados.
  const [filteredData, setFilteredData] = useState<Row[]>([]);

  // Efecto que se ejecuta al cargar el componente para obtener los artículos de insumo.
  useEffect(() => {
    const fetchArticulosInsumos = async () => {
      try {
        // Obtiene todos los artículos de insumo.
        const articulosInsumos = await insumoService.getAll(url + 'articulosInsumos')
        // Envía los artículos de insumo al estado global de Redux.
        dispatch(setArticuloInsumo(articulosInsumos)); 
        // Establece los datos filtrados para su visualización.
        setFilteredData(articulosInsumos); 
      } catch (error) {
        console.error("Error al obtener los artículos de insumo:", error);
      }
    };

    fetchArticulosInsumos();
  }, [dispatch]); 

  // Función para manejar la búsqueda de artículos de insumo.
  const handleSearch = (query: string) => {
    // Filtra los artículos de insumo globales según la consulta de búsqueda.
    const filtered = globalArticulosInsumos.filter((item) =>
      item.denominacion.toLowerCase().includes(query.toLowerCase())
    );
    // Establece los datos filtrados para su visualización.
    setFilteredData(filtered);
  };

  // Columnas de la tabla de artículos de insumo.
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
    { id: "precioCompra", label: "Precio de compra", renderCell: (rowData) => <>{rowData.precioCompra}</> },
    { id: "precioVenta", label: "Precio de Venta", renderCell: (rowData) => <>{rowData.precioVenta}</> },
    { id: "stock", label: "Stock", renderCell: (rowData) => <>{rowData.stockActual}</> },
    {
      id: "elaboracion",
      label: "¿Es para elaborar?",
      renderCell: (rowData) => <>{rowData.esParaElaborar ? "Sí" : "No"}</>,
    },
  ];

  return (
    <Box component="main" sx={{ flexGrow: 1, my: 2}}>
      <Container>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", my: 1 }}>
          <Typography variant="h5" gutterBottom>
            Insumos
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
            Insumo
          </Button>
        </Box>
        <Box sx={{mt:2 }}>
          <SearchBar onSearch={handleSearch} />
        </Box>
        <TableComponent data={filteredData} columns={columns} />
      </Container>
    </Box>
  );
};

export default Insumo;
