import React, { useState, useEffect } from "react";
import { Box, Typography, Button, Container } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import TableComponent from "../Table/Table";
import SearchBar from "../common/SearchBar";
import { Add } from "@mui/icons-material";
import { setArticuloInsumo } from "../../redux/slices/articuloInsumo";
import InsumoService from "../../services/InsumoService";
import Row from "../../types/Row";
import Column from "../../types/Column";
import ModalArticuloInsumo from "../Modal/ModalArticuloInsumo"; 
import { handleDelete, handleSearch } from "../../utils/utilities";
import IArticuloInsumo from "../../types/ArticuloInsumo";

const Insumo = () => {
  const dispatch = useAppDispatch();
  const globalArticulosInsumos = useAppSelector((state) => state.articuloInsumo.articuloInsumo);
  const url = import.meta.env.VITE_API_URL;
  const insumoService = new InsumoService();
  const [filteredData, setFilteredData] = useState<Row[]>([]);
  const [openModal, setOpenModal] = useState(false); // Estado para controlar la apertura y cierre del modal
  const [selectedArticle, setSelectedArticle] = useState<IArticuloInsumo | null>(null); // Estado para almacenar el artículo seleccionado

  const fetchArticulosInsumos = async () => {
    try {
      const articulosInsumos = await insumoService.getAll(url + 'articulosInsumos');
      dispatch(setArticuloInsumo(articulosInsumos)); 
      setFilteredData(articulosInsumos); 
    } catch (error) {
      console.error("Error al obtener los artículos de insumo:", error);
    }
  };

  useEffect(() => {
    fetchArticulosInsumos();
  }, [dispatch]); 

  const onSearch = (query: string) => {
    handleSearch(query, globalArticulosInsumos, 'denominacion', setFilteredData);
  };

  const handleEdit = (index: number) => {
    const selectedArticle = filteredData[index] as IArticuloInsumo; // Conversión explícita de Row a IArticuloInsumo
    setSelectedArticle(selectedArticle); // Asigna el artículo seleccionado al estado
    setOpenModal(true); // Abre el modal
};

  const onDelete = async (index: number) => {
    handleDelete(
      index,
      insumoService,
      filteredData,
      fetchArticulosInsumos,
      '¿Estás seguro de eliminar este producto?',
      'Producto eliminado correctamente.',
      'Hubo un problema al eliminar el producto.',
      url + 'articulosInsumos'
    );
  };

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
            onClick={() => setOpenModal(true)} // Abre el modal al hacer clic en el botón de agregar
          >
            Insumo
          </Button>
        </Box>
        <Box sx={{mt:2 }}>
          <SearchBar onSearch={onSearch} />
        </Box>
        <TableComponent data={filteredData} columns={columns} onDelete={onDelete} onEdit={handleEdit} />
        <ModalArticuloInsumo 
          show={openModal} 
          onClose={() => setOpenModal(false)} 
          getArticulosInsumo={fetchArticulosInsumos} 
          selectedArticle={selectedArticle} // Pasa el artículo seleccionado como prop
        />
      </Container>
    </Box>
  );
};

export default Insumo;
