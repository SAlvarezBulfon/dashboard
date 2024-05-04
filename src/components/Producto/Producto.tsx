import { useEffect, useState } from "react";
import { Box, Typography, Button, Container } from "@mui/material";
import { Add } from "@mui/icons-material";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { setArticuloManufacturado } from "../../redux/slices/articuloManufacturado";
import TableComponent from "../Table/Table";
import ProductoService from "../../services/ProductoService";
import Row from "../../types/Row";
import Column from "../../types/Column";
import { handleDelete, handleSearch } from "../../utils/utilities";
import SearchBar from "../common/SearchBar";

const Producto = () => {
  const url = import.meta.env.VITE_API_URL;
  const dispatch = useAppDispatch();
  const productoService = new ProductoService();
  // Estado global de Redux
  const globalArticulosManufacturados = useAppSelector(
    (state) => state.articuloManufacturado.articuloManufacturado
  );

  const [filteredData, setFilteredData] = useState<Row[]>([]);

  // Función para obtener los productos
  const fetchProductos = async () => {
    try {
      const productos = await productoService.getAll(url + 'articulosManufacturados');
      dispatch(setArticuloManufacturado(productos));
      setFilteredData(productos);
    } catch (error) {
      console.error("Error al obtener los productos:", error);
    }
  };

  useEffect(() => {
    fetchProductos();
  }, [dispatch]);


  // Llama a la función handleSearch cuando se realiza una búsqueda
  const onSearch = (query: string) => {
    handleSearch(query, globalArticulosManufacturados, 'denominacion', setFilteredData);
  };

  const onDelete = async (index: number) => {
    handleDelete(
      index,
      productoService,
      filteredData,
      fetchProductos,
      '¿Estás seguro de eliminar este producto?',
      'Producto eliminado correctamente.',
      'Hubo un problema al eliminar el producto.',
      url + 'articulosManufacturados'
    );
  };
  
  // Función para editar 
  const handleEdit = (index: number) => {
    console.log("Editar producto en el índice", index);
  };

  // Definición de las columnas para la tabla de artículos manufacturados
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
    { id: "precioVenta", label: "Precio", renderCell: (rowData) => <>{rowData.precioVenta}</> },
    { id: "descripcion", label: "Descripción", renderCell: (rowData) => <>{rowData.descripcion}</> },
    {
      id: "tiempoEstimadoMinutos",
      label: "Tiempo estimado en minutos",
      renderCell: (rowData) => <>{rowData.tiempoEstimadoMinutos}</>,
    },
  ];

  return (
    <Box component="main" sx={{ flexGrow: 1, my: 2 }}>
      <Container>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", my: 1 }}>
          <Typography variant="h5" gutterBottom>
            Productos
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
            Producto
          </Button>
        </Box>
        {/* Barra de búsqueda */}
        <Box sx={{ mt: 2 }}>
          <SearchBar onSearch={onSearch} />
        </Box>
        {/* Componente de tabla para mostrar los artículos manufacturados */}
        <TableComponent data={filteredData} columns={columns} onDelete={onDelete} onEdit={handleEdit} />
      </Container>
    </Box>
  );
};

export default Producto;
