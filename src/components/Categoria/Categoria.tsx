import { useEffect, useState } from "react";
import { Box, Typography, Button, Container } from "@mui/material";
import { Add } from "@mui/icons-material";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { setCategoria } from "../../redux/slices/categoria";
import TableComponent from "../Table/Table";
import SearchBar from "../common/SearchBar";
import CategoriaService from "../../services/CategoriaService";
import Row from "../../types/Row";
import Column from "../../types/Column";
import Swal from 'sweetalert2';
import ModalCategoria from "../Modal/ModalCategoria"; // Importa ModalCategoria
import { toggleModal } from "../../redux/slices/modal";

const Categoria = () => {
  const url = import.meta.env.VITE_API_URL;
  const dispatch = useAppDispatch();
  const categoriaService = new CategoriaService();
  // Estado global de Redux
  const globalCategorias = useAppSelector(
    (state) => state.categoria.categoria
  );

  const [filteredData, setFilteredData] = useState<Row[]>([]);

  // Función para obtener las categorias
  const fetchCategorias = async () => {
    try {
      const categorias = await categoriaService.getAll(url + 'categorias');
      dispatch(setCategoria(categorias)); 
      setFilteredData(categorias); 
    } catch (error) {
      console.error("Error al obtener las categorias:", error);
    }
  };

  useEffect(() => {
    fetchCategorias(); 
  }, [dispatch]); 

  // Función para manejar la búsqueda de categorias
  const handleSearch = (query: string) => {
    const filtered = globalCategorias.filter((item) =>
      item.denominacion.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredData(filtered);
  };

  // Función para editar una categoría
  const handleEdit = (index: number) => {
    // Aquí implementa la lógica para editar la categoría en el índice especificado
    console.log("Editar categoría en el índice", index);
  };

  // Función para eliminar una categoría
  const handleDelete = async (index: number) => {
    const categoryId = filteredData[index].id.toString(); // Convertimos el ID a string
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción eliminará la categoría. ¿Quieres continuar?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      try {
        await categoriaService.delete(url + 'categorias', categoryId);
        // Vuelve a obtener las categorías después de la eliminación
        fetchCategorias(); 
        Swal.fire(
          '¡Eliminado!',
          'La categoría ha sido eliminada correctamente.',
          'success'
        );
      } catch (error) {
        console.error("Error al eliminar la categoría:", error);
        Swal.fire(
          'Error',
          'Hubo un problema al eliminar la categoría.',
          'error'
        );
      }
    }
  };

  // Función para mostrar el modal de añadir categoría
  const handleAddCategoria = () => {
    dispatch(toggleModal({ modalName: "modalCategoria" }));
  };

  // Definición de las columnas para la tabla de categorías
  const columns: Column[] = [
    { id: "denominacion", label: "Nombre", renderCell: (rowData) => <>{rowData.denominacion}</> },
  ];

  return (
    <Box component="main" sx={{ flexGrow: 1, my: 2}}>
      <Container>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", my: 1 }}>
          <Typography variant="h5" gutterBottom>
            Categorías
          </Typography>
          <Button
            onClick={handleAddCategoria} // Maneja el evento de clic para mostrar el modal
            sx={{
              bgcolor: "#fb6376",
              "&:hover": {
                bgcolor: "#d73754",
              },
            }}
            variant="contained"
            startIcon={<Add />}
          >
            Categoría
          </Button>
        </Box>
        {/* Barra de búsqueda */}
        <Box sx={{mt:2 }}>
          <SearchBar onSearch={handleSearch} />
        </Box>
        {/* Componente de tabla para mostrar las categorías */}
        <TableComponent 
          data={filteredData} 
          columns={columns} 
          onEdit={handleEdit} 
          onDelete={handleDelete} 
        />
        {/* Modal de añadir categoría */}
        <ModalCategoria getCategorias={fetchCategorias} />
      </Container>
    </Box>
  );
};

export default Categoria;
