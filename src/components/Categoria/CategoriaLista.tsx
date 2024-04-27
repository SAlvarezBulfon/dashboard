import * as React from 'react';
import ListSubheader from '@mui/material/ListSubheader';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import { IconButton, Menu, MenuItem } from '@mui/material';
import { ExpandLess as ExpandLessIcon, ExpandMore as ExpandMoreIcon, MoreVert as MoreVertIcon } from '@mui/icons-material';
import Categoria from '../../types/Categoria';

interface CategoriaListaProps {
  categorias: Categoria[];
}

const CategoriaLista: React.FC<CategoriaListaProps> = ({ categorias }) => {
  const [openMap, setOpenMap] = React.useState<{ [key: number]: boolean }>({});
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);
  const [selectedCategoria, setSelectedCategoria] = React.useState<Categoria | null>(null);

  const handleClick = (id: number) => {
    setOpenMap((prevOpenMap) => ({
      ...prevOpenMap,
      [id]: !prevOpenMap[id],
    }));
  };

  const handleEdit = () => {
    // Aquí maneja la lógica para editar la categoría seleccionada
    handleMenuClose();
  };

  const handleDelete = () => {
    // Aquí maneja la lógica para eliminar la categoría seleccionada
    handleMenuClose();
  };

  const handleDetail = () => {
    // Aquí maneja la lógica para ver los detalles de la categoría seleccionada
    handleMenuClose();
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedCategoria(null);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>, categoria: Categoria) => {
    setAnchorEl(event.currentTarget);
    setSelectedCategoria(categoria);
  };

  const renderCategoria = (categoria: Categoria) => {
    const isOpen = openMap[categoria.id] || false;
    const tieneSubcategorias = categoria.subCategorias && categoria.subCategorias.length > 0;

    return (
      <React.Fragment key={categoria.id}>
        <ListItemButton onClick={() => handleClick(categoria.id)}>
          <ListItemText primary={categoria.denominacion} />
          <IconButton
            aria-label="more"
            aria-controls="categoria-menu"
            aria-haspopup="true"
            onClick={(event) => handleMenuOpen(event, categoria)}
          >
            <MoreVertIcon />
          </IconButton>
          {tieneSubcategorias && (isOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />)}
        </ListItemButton>
        <Menu
          id="categoria-menu"
          anchorEl={anchorEl}
          open={Boolean(anchorEl && selectedCategoria?.id === categoria.id)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={handleEdit}>Editar</MenuItem>
          <MenuItem onClick={handleDelete}>Eliminar</MenuItem>
          <MenuItem onClick={handleDetail}>Ver Detalle</MenuItem>
        </Menu>
        {tieneSubcategorias && (
          <Collapse in={isOpen} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {categoria.subCategorias.map((subcategoria) => (
                <React.Fragment key={subcategoria.id}>
                  <ListItemButton sx={{ pl: 4 }}>
                    <ListItemText primary={subcategoria.denominacion} />
                    <IconButton
                      aria-label="more"
                      aria-controls="categoria-menu"
                      aria-haspopup="true"
                      onClick={(event) => handleMenuOpen(event, subcategoria)}
                    >
                      <MoreVertIcon />
                    </IconButton>
                  </ListItemButton>
                  <Menu
                    id="categoria-menu"
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl && selectedCategoria?.id === subcategoria.id)}
                    onClose={handleMenuClose}
                  >
                    <MenuItem onClick={handleEdit}>Editar</MenuItem>
                    <MenuItem onClick={handleDelete}>Eliminar</MenuItem>
                    <MenuItem onClick={handleDetail}>Ver Detalle</MenuItem>
                  </Menu>
                </React.Fragment>
              ))}
            </List>
          </Collapse>
        )}
      </React.Fragment>
    );
  };

  const categoriasPrincipales = categorias.filter(categoria => !categorias.some(cat => cat.subCategorias?.some(sub => sub.id === categoria.id)));

  return (
    <List
      sx={{ width: '100%', bgcolor: 'background.paper' }}
      component="nav"
      aria-labelledby="nested-list-subheader"
      subheader={
        <ListSubheader component="div" id="nested-list-subheader">
          Categorías
        </ListSubheader>
      }
    >
      {categoriasPrincipales.map((categoria) => renderCategoria(categoria))}
    </List>
  );
};

export default CategoriaLista;
