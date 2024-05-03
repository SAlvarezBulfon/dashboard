import { Dispatch, SetStateAction } from "react";
  
import Swal from 'sweetalert2';
import BackendClient from '../services/BackendClient';

// Función para manejar la eliminación genérica
export const handleDelete = async <T>(
  index: number,
  backendService: BackendClient<T>,
  filteredData: any[],
  fetchItems: () => void,
  confirmationMessage: string = '¿Estás seguro de eliminar este elemento?',
  successMessage: string = 'Elemento eliminado correctamente.',
  errorMessage: string = 'Hubo un problema al eliminar el elemento.',
  url: string
) => {
  const itemToDelete = filteredData[index];
  const itemId = itemToDelete.id.toString(); // Convertimos el ID a string

  const result = await Swal.fire({
    title: '¿Estás seguro?',
    text: confirmationMessage,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar'
  });

  if (result.isConfirmed) {
    try {
      await backendService.delete(url,itemId);
      fetchItems(); // Vuelve a obtener los elementos después de la eliminación
      Swal.fire(
        '¡Eliminado!',
        successMessage,
        'success'
      );
    } catch (error) {
      console.error("Error al eliminar el elemento:", error);
      Swal.fire(
        'Error',
        errorMessage,
        'error'
      );
    }
  }
};

  export const handleSearch = (
    query: string,
    data: any[],
    nombre: string, // Cambiado a string en lugar de any
    setData: Dispatch<SetStateAction<any[]>>
  ) => {
    const filtered = data.filter((item) =>
      item[nombre].toLowerCase().includes(query.toLowerCase())
    );
    setData(filtered);
  };
  
