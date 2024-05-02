import React from 'react';
import { IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';

interface EditButtonProps {
  onClick: () => void;
}

const EditButton: React.FC<EditButtonProps> = ({ onClick }) => {
  return (
    <IconButton aria-label="editar" onClick={onClick}>
      <EditIcon />
    </IconButton>
  );
};

export default EditButton;
