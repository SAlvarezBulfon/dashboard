import { useEffect, useState } from "react";
import { Box, Typography, Button, Container } from "@mui/material";
import { Add } from "@mui/icons-material";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { setEmpresa } from "../../redux/slices/empresa";
import TableComponent from "../Table/Table";
import SearchBar from "../common/SearchBar";
import EmpresaService from "../../services/EmpresaService";
import Column from "../../types/Column";
import Empresa from "../../types/Empresa"; // Importamos la interfaz Empresa
import { Link } from "react-router-dom";
import { toggleModal } from "../../redux/slices/modal";
import ModalEmpresa from "../Modal/ModalEmpresa";
import { handleDelete, handleSearch } from "../../utils/utilities";

const EmpresaComponent = () => {
  const url = import.meta.env.VITE_API_URL;
  const dispatch = useAppDispatch();
  const empresaService = new EmpresaService();
  // Estado global de Redux
  const globalEmpresas = useAppSelector(
    (state) => state.empresa.empresa
  );

  const [filteredData, setFilteredData] = useState<Empresa[]>([]);

  // Función para obtener las empresas
  const fetchEmpresas = async () => {
    try {
      const empresas = await empresaService.getAll(url + 'empresas');
      dispatch(setEmpresa(empresas)); 
      setFilteredData(empresas); 
    } catch (error) {
      console.error("Error al obtener las empresas:", error);
    }
  }; 

  useEffect(() => {
    fetchEmpresas(); 
  }, [dispatch]); 

  // Llama a la función handleSearch cuando se realiza una búsqueda
  const onSearch = (query: string) => {
    handleSearch(query, globalEmpresas, 'nombre', setFilteredData);
  };
  
  const onDelete = async (index: number) => {
    handleDelete(
      index,
      empresaService,
      filteredData,
      fetchEmpresas,
      '¿Estás seguro de eliminar esta empresa?',
      'Empresa eliminada correctamente.',
      'Hubo un problema al eliminar la empresa.',
      url + 'empresas'
    );
  };

  // Función para editar una empresa
  const handleEdit = (index: number) => {
    console.log("Editar empresa en el índice", index);
  };

    // Función para mostrar el modal de añadir empresa
    const handleAddEmpresa = () => {
      dispatch(toggleModal({ modalName: "modal" }));
    };

  // Definición de las columnas para la tabla de empresas
  const columns: Column[] = [
    { id: "nombre", label: "Nombre", renderCell: (empresa) => <>{empresa.nombre}</> },
    { id: "razonSocial", label: "Razón Social", renderCell: (empresa) => <>{empresa.razonSocial}</> },
    { id: "cuil", label: "CUIL", renderCell: (empresa) => <>{empresa.cuil}</> },
    {
      id: "sucursales",
      label: "Sucursales",
      renderCell: (empresa) => (
      <Button component={Link} to={`/sucursales/${empresa.id}`} variant="outlined">
         Ver Sucursales
      </Button>
      ),
    },
  ];

  return (
    <Box component="main" sx={{ flexGrow: 1, my: 2}}>
      <Container>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", my: 1 }}>
          <Typography variant="h5" gutterBottom>
            Empresas
          </Typography>
          <Button
            onClick={handleAddEmpresa} // Maneja el evento de clic para mostrar el modal
            sx={{
              bgcolor: "#fb6376",
              "&:hover": {
                bgcolor: "#d73754",
              },
            }}
            variant="contained"
            startIcon={<Add />}
          >
            Empresa
          </Button>
        </Box>
        {/* Barra de búsqueda */}
        <Box sx={{mt:2 }}>
          <SearchBar onSearch={onSearch} />
        </Box>
        {/* Componente de tabla para mostrar las empresas */}
        <TableComponent data={filteredData} columns={columns} onDelete={onDelete} onEdit={handleEdit} />

      {/* Modal de añadir empresa */}
      <ModalEmpresa getEmpresas={fetchEmpresas} />
      </Container>
    </Box>
  );
};

export default EmpresaComponent;
