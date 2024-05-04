import { useEffect, useState } from "react";
import { Box, Typography, Button, Container, IconButton, Tooltip } from "@mui/material";
import { Add, AddCircle, Visibility } from "@mui/icons-material";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { setCategoria } from "../../redux/slices/categoria";
import TableComponent from "../Table/Table";
import SearchBar from "../common/SearchBar";
import CategoriaService from "../../services/CategoriaService";
import Row from "../../types/Row";
import Column from "../../types/Column";
import ModalCategoria from "../Modal/ModalCategoria";
import ModalSubcategoria from "../Modal/ModalSubcategorias";
import { toggleModal } from "../../redux/slices/modal";
import ICategoria from "../../types/Categoria";
import { List, ListItem, ListItemText } from "@mui/material";
import { handleDelete, handleSearch } from "../../utils/utilities";

const Categoria = () => {
  const url = import.meta.env.VITE_API_URL;
  const dispatch = useAppDispatch();
  const categoriaService = new CategoriaService();
  // Estado global de Redux
  const globalCategorias = useAppSelector(
    (state) => state.categoria.categoria
  );

  const [filteredData, setFilteredData] = useState<Row[]>([]);
  const [showSubcategoriaModal, setShowSubcategoriaModal] = useState<boolean>(
    false
  ); // Estado para controlar la visibilidad del modal de subcategoría
  const [categoriaPadre, setCategoriaPadre] = useState<ICategoria | null>(null);

  // Función para obtener las categorias
  const fetchCategorias = async () => {
    try {
      const categorias = await categoriaService.getAll(url + "categorias");
      dispatch(setCategoria(categorias));
      setFilteredData(categorias);
    } catch (error) {
      console.error("Error al obtener las categorias:", error);
    }
  };

  useEffect(() => {
    fetchCategorias();
  }, [dispatch, categoriaPadre]);

  // Llama a la función handleSearch cuando se realiza una búsqueda
  const onSearch = (query: string) => {
    handleSearch(query, globalCategorias, "denominacion", setFilteredData);
  };

  // Función para editar una categoría
  const handleEdit = (index: number) => {
    // Aquí implementa la lógica para editar la categoría en el índice especificado
    console.log("Editar categoría en el índice", index);
  };

  // Función para mostrar el modal de añadir categoría
  const handleAddCategoria = () => {
    dispatch(toggleModal({ modalName: "modal" }));
  };

  // Utiliza la función handleDelete importada
  const onDelete = async (index: number) => {
    handleDelete(
      index,
      categoriaService,
      filteredData,
      fetchCategorias,
      "¿Estás seguro de eliminar esta categoría?",
      "Categoría eliminada correctamente.",
      "Hubo un problema al eliminar la categoría.",
      url + "categorias"
    );
  };

  const handleOpenSubcategoriaModal = (categoria: ICategoria) => {
    setCategoriaPadre(categoria);
    setShowSubcategoriaModal(true);
  };

  const handleCloseSubcategoriaModal = () => {
    setShowSubcategoriaModal(false);
    setCategoriaPadre(null); // Limpiamos la categoría padre
  };

  // // Función para verificar si una categoría es una subcategoría
  // const tieneSubcategoria = (categoria: ICategoria): boolean => {
  //   // Verificar si la categoría tiene subcategorías
  //   return categoria.subCategorias.length > 0;
  // };

  // Definición de las columnas para la tabla de categorías
  const columns: Column[] = [
    { id: "denominacion", label: "Nombre", renderCell: (rowData) => <>{rowData.denominacion}</> },
    // { id: "esSubcategoria", label: "¿Tiene Subcategoría?", renderCell: (rowData) => <>{tieneSubcategoria(rowData) ? "Sí" : "No"}</> },
    {
      id: "subCategorias",
      label: "Subcategorías",
      renderCell: (rowData) => (
        <>
          {rowData.subCategorias.length > 0 ? (
            <List>
              {rowData.subCategorias.map((subcategoria: ICategoria, index: number) => (
                <ListItem key={index}>
                  <ListItemText primary={subcategoria.denominacion} />
                </ListItem>
              ))}
            </List>
          ) : (
            "-"
          )}
        </>
      ),
    },
    {
      id: "agregarSubcategoria",
      label: "Agregar Subcategoría",
      renderCell: (rowData) => (
        <Button
          onClick={() => handleOpenSubcategoriaModal(rowData)} // Abre el modal de subcategoría pasando la categoría padre
          variant="outlined"
          color="primary"
          startIcon={<Add />}
        >
          Agregar
        </Button>
      ),
    },
    {
      id: "articulos",
      label: "Artículos",
      renderCell: () => (
        <Box>
          <Tooltip title="Ver Artículos">
            <IconButton
              aria-label="Ver Artículos"
            >
              <Visibility />
            </IconButton>
          </Tooltip>
          <Tooltip title="Agregar artículo">
            <IconButton
              aria-label="Agregar artículo"
            >
               <AddCircle />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
    
  ];

  return (
    <Box component="main" sx={{ flexGrow: 1, my: 2 }}>
      <Container>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            my: 1,
          }}
        >
          <Typography variant="h5" gutterBottom>
            Categorías
          </Typography>
          <Button
            onClick={handleAddCategoria} // Maneja el evento de clic para mostrar el modal de categoría
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
        <Box sx={{ mt: 2 }}>
          <SearchBar onSearch={onSearch} />
        </Box>
        {/* Componente de tabla para mostrar las categorías */}
        <TableComponent
          data={filteredData}
          columns={columns}
          onEdit={handleEdit}
          onDelete={onDelete}
        />
        {/* Modal de añadir categoría */}
        <ModalCategoria getCategorias={fetchCategorias} />
        {/* Modal de agregar subcategoría */}
        {showSubcategoriaModal && categoriaPadre && (
          <ModalSubcategoria
            categoriaPadre={categoriaPadre}
            onClose={handleCloseSubcategoriaModal}
          />

        )}
      </Container>
    </Box>
  );
};

export default Categoria;
