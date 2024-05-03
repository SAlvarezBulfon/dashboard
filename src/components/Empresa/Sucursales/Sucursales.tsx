import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, Container } from '@mui/material';
import { Add } from '@mui/icons-material';
import { useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../hooks/redux';
import SearchBar from '../../common/SearchBar';
import TableComponent from '../../Table/Table';
import Column from '../../../types/Column';
import SucursalService from '../../../services/SucursalService';
import Sucursal from '../../../types/Sucursal';
import EmpresaService from '../../../services/EmpresaService'; // Importa el servicio de la empresa
import { setSucursal } from '../../../redux/slices/sucursal';
import { handleDelete, handleSearch } from '../../../utils/utilities';

const SucursalesEmpresa: React.FC = () => {
  const { empresaId } = useParams<{ empresaId: string }>();
  const [filteredData, setFilteredData] = useState<Sucursal[]>([]);
  const [nombreEmpresa, setNombreEmpresa] = useState<string>(''); // Estado para almacenar el nombre de la empresa
  const dispatch = useAppDispatch();
  const sucursalService = new SucursalService();
  const empresaService = new EmpresaService(); // Instancia del servicio de la empresa
  const url = import.meta.env.VITE_API_URL;

  const globalSucursales = useAppSelector(
    (state) => state.sucursal.sucursal
  );

  const fetchSucursales = async () => {
    try {
      const sucursalesData = await sucursalService.getAll(`${url}empresas/${empresaId}/sucursales`);
      dispatch(setSucursal(sucursalesData));
      setFilteredData(sucursalesData);
    } catch (error) {
      console.error('Error al obtener las sucursales:', error);
    }
  };

  useEffect(() => {
    const fetchEmpresa = async () => {
      try {
        // Verifica que empresaId no sea undefined antes de hacer la llamada
        if (empresaId) {
          const empresa = await empresaService.get(url + 'empresas', empresaId);
          if (empresa) {
            setNombreEmpresa(empresa.nombre);
          } else {
            setNombreEmpresa('');
          }
        }
      } catch (error) {
        console.error('Error al obtener la empresa:', error);
      }
    };
  
    fetchSucursales();
    fetchEmpresa();
  }, [empresaId, url, dispatch]);
  
  

  // Llama a la función handleSearch cuando se realiza una búsqueda
  const onSearch = (query: string) => {
    handleSearch(query, globalSucursales, 'nombre', setFilteredData);
  };

  const onDelete = async (index: number) => {
    handleDelete(
      index,
      sucursalService,
      filteredData,
      fetchSucursales,
      '¿Estás seguro de eliminar esta sucursal?',
      'Sucursal eliminada correctamente.',
      'Hubo un problema al eliminar la sucursal.',
      url + 'sucursales'
    );
  };

  const handleEdit = (index: number) => {
    const sucursalId = filteredData[index].id;
    console.log('Editar sucursal con ID:', sucursalId);
  };

  const columns: Column[] = [
    { id: 'nombre', label: 'Nombre', renderCell: (sucursal) => <>{sucursal.nombre}</> },
    { id: 'calle', label: 'Calle', renderCell: (sucursal) => <>{sucursal.domicilio.calle}</> },
    { id: 'numero', label: 'Número', renderCell: (sucursal) => <>{sucursal.domicilio.numero}</> },
    { id: 'localidad', label: 'Localidad', renderCell: (sucursal) => <>{sucursal.domicilio.localidad.nombre}</> },
    { id: 'provincia', label: 'Provincia', renderCell: (sucursal) => <>{sucursal.domicilio.localidad.provincia.nombre}</> },
    { id: 'pais', label: 'País', renderCell: (sucursal) => <>{sucursal.domicilio.localidad.provincia.pais.nombre}</> },
  ];

  return (
    <Box component="main" sx={{ flexGrow: 1, my: 2}}>
      <Container>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", my: 1 }}>
          <Typography variant="h5" gutterBottom>
           Sucursales de {nombreEmpresa}
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
            Sucursales
          </Button>
        </Box>
        <Box sx={{mt:2 }}>
          <SearchBar onSearch={onSearch} />
        </Box>
        <TableComponent data={filteredData} columns={columns} onDelete={onDelete} onEdit={handleEdit} />
      </Container>
    </Box>
  );
};

export default SucursalesEmpresa;
