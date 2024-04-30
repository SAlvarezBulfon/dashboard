import { useState, useEffect } from 'react';
import { Box, Typography, Button, Container } from '@mui/material';
import { Add } from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import SearchBar from '../common/SearchBar';
import BackendClient from '../../services/BackendClient';
import CategoriaLista from '../Categoria/CategoriaLista';
import ICategoria from '../../types/Categoria';
import { setCategoria } from '../../redux/slices/categoria';
import CategoriaService from '../../services/CategoriaService';

const Categoria = () => {
  const url = import.meta.env.VITE_API_URL;
  const dispatch = useAppDispatch();
  const globalCategorias = useAppSelector((state) => state.categoria.categoria); // Obtiene las categorías globales del estado Redux
  const categoriaService = new CategoriaService();

  const [filteredData, setFilteredData] = useState<ICategoria[]>([]); // Estado local para almacenar los datos filtrados

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        // Crea una instancia del cliente BackendClient para las categorías
        const categorias = await categoriaService.getAll(url + 'categorias')
        // Actualiza el estado global de las categorías en Redux
        dispatch(setCategoria(categorias));
        setFilteredData(categorias); 
      } catch (error) {
        console.error('Error al obtener las categorías:', error);
      }
    };

    fetchCategorias();
  }, [dispatch]);

  // Manejador de búsqueda para filtrar las categorías
  const handleSearch = (query: string) => {
    const filtered = globalCategorias.filter((item: ICategoria) =>
      item.denominacion.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredData(filtered);
  };

  return (
    <Box component="main" sx={{ flexGrow: 1, my: 2 }}>
      <Container>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', my: 1 }}>
          <Typography variant="h5" gutterBottom>
            Categorías
          </Typography>
          <Button
            sx={{
              bgcolor: '#fb6376',
              '&:hover': {
                bgcolor: '#d73754',
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
          <SearchBar onSearch={handleSearch} />
        </Box>
        {/* Renderiza el componente de lista de categorías con los datos filtrados */}
        <CategoriaLista categorias={filteredData} />
      </Container>
    </Box>
  );
};

export default Categoria;
