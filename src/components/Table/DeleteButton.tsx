import React from 'react';
import { IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

interface DeleteButtonProps {
  onClick: () => void;
}

const DeleteButton: React.FC<DeleteButtonProps> = ({ onClick }) => {
  return (
    <IconButton aria-label="eliminar" onClick={onClick}>
      <DeleteIcon />
    </IconButton>
  );
};

export default DeleteButton;
