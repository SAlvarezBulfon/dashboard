import { useState, useEffect } from "react";
import { Box, Typography, Button, Container } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import TableComponent from "../Table/Table";
import SearchBar from "../common/SearchBar";
import { Add } from "@mui/icons-material";
import BackendClient from "../../services/BackendClient";
import IArticuloInsumo from "../../types/ArticuloInsumo";
import { setArticuloInsumo } from "../../redux/slices/articuloInsumo";

interface Row {
  [key: string]: any;
}

interface Column {
  id: keyof Row;
  label: string;
  renderCell: (rowData: Row) => JSX.Element;
}

const Insumo = () => {
  const dispatch = useAppDispatch();
  const globalArticulosInsumos = useAppSelector((state) => state.articuloInsumo.articuloInsumo);

  const [filteredData, setFilteredData] = useState<Row[]>([]);

  useEffect(() => {
    const fetchArticulosManufacturados = async () => {
      try {
        const articuloInsumoClient = new BackendClient<IArticuloInsumo>('http://localhost:3000/articulosInsumos');

        // Get all articuloInsumo
        const articulosInsumos = await articuloInsumoClient.getAll();
        dispatch(setArticuloInsumo(articulosInsumos)); 
        setFilteredData(articulosInsumos); 
      } catch (error) {
        console.error("Error al obtener los artículos manufacturados:", error);
      }
    };

    fetchArticulosManufacturados();
  }, [dispatch]); 

  const handleSearch = (query: string) => {
    const filtered = globalArticulosInsumos.filter((item) =>
      item.denominacion.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredData(filtered);
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
