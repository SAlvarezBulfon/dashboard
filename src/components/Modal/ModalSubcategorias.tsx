import React, { useState, useEffect } from "react";
import { Button, Modal, Form } from "react-bootstrap";
import { Formik, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Categoria from "../../types/Categoria";
import CategoriaService from "../../services/CategoriaService";
import Swal from "sweetalert2";

const ModalSubcategoria: React.FC<{
  getSubcategorias: () => void;
  categoriaPadre: Categoria | null;
  setCategoria: React.Dispatch<React.SetStateAction<Categoria[]>>;
  onClose: () => void;
}> = ({ getSubcategorias, categoriaPadre, setCategoria, onClose }) => {
  const [categoriasDisponibles, setCategoriasDisponibles] = useState<Categoria[]>([]);
  const categoriaService = new CategoriaService();
  const url = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchCategoriasDisponibles = async () => {
      try {
        const categorias = await categoriaService.getAll(url + "categorias");
        setCategoriasDisponibles(categorias.filter(cat => cat.id !== categoriaPadre?.id));
      } catch (error) {
        console.error("Error al obtener las categorias:", error);
      }
    };
    fetchCategoriasDisponibles();
  }, [categoriaPadre?.id, categoriaService, url]);

  const initialValues: Categoria = {
    id: 0,
    denominacion: "",
    articulos: [],
    subCategorias: [],
  };

  const handleSubmit = async (values: Categoria) => {
    console.log(url + "categorias/" + categoriaPadre?.id + "/subcategorias")
    try {
      // Agregar la subcategoría a través de la API
      const response = await categoriaService.post(
        url + "categorias/" + categoriaPadre?.id + "/subcategorias",
        values
      );

      // Verificar si la subcategoría tiene una denominación definida
      if (!response.data.denominacion) {
        throw new Error("La subcategoría no tiene una denominación definida.");
      }

      // Actualizar la lista de categorías global con la subcategoría agregada
      setCategoria(prevCategorias => {
        const updatedCategorias = prevCategorias.map(c => {
          if (c.id === categoriaPadre?.id) {
            return {
              ...c,
              subCategorias: [...c.subCategorias, response.data]
            };
          }
          return c;
        });
        return updatedCategorias;
      });

      // Actualizar la categoría en la API para reflejar los cambios
      await categoriaService.put(
        url + "categorias",
        String(categoriaPadre?.id),
        {
          ...categoriaPadre!,
          subCategorias: [...categoriaPadre!.subCategorias, response.data]
        }
      );

      // Cerrar el modal y mostrar un mensaje de éxito
      onClose();
      Swal.fire({
        icon: "success",
        title: "¡Éxito!",
        text: "Se ha agregado la subcategoría correctamente.",
      });
    } catch (error) {
      console.error("Error al realizar la operación:", error);
    }
  };


  return (
    <>
      <Modal
        id={"modalSubcategoria"}
        show={!!categoriaPadre}
        onHide={onClose}
        size={"lg"}
        backdrop="static"
        keyboard={false}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {"Añadir subcategoría a: " + (categoriaPadre ? categoriaPadre.denominacion : "")}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Formik
            validationSchema={Yup.object({
              denominacion: Yup.string().required("Campo requerido"),
              categoriaId: Yup.number().required("Selecciona una categoría"),
            })}
            initialValues={{ ...initialValues, categoriaId: 0 }}
            onSubmit={handleSubmit}
          >
            {({ setFieldValue }) => (
              <Form autoComplete="off" className="form-obraAlta">
                <div className="mb-4">
                  <label htmlFor="categoriaId">Categoría:</label>
                  <Field
                    as="select"
                    name="categoriaId"
                    className="form-control mt-2"
                    onChange={(e: any) => setFieldValue("categoriaId", parseInt(e.target.value))}
                  >
                    <option value={0}>Selecciona una categoría</option>
                    {categoriasDisponibles.map((categoria) => (
                      <option key={categoria.id} value={categoria.id}>
                        {categoria.denominacion}
                      </option>
                    ))}
                  </Field>
                  <ErrorMessage
                    name="categoriaId"
                    className="error-message"
                    component="div"
                  />
                </div>
                <div className="d-flex justify-content-end">
                  <Button
                    variant="outline-success"
                    type="button" // Cambia el tipo a "button" para evitar el envío automático del formulario
                    className="custom-button"
                    onClick={(e) => {
                      e.preventDefault(); // Evita el comportamiento predeterminado del botón
                      handleSubmit(initialValues); // Pasa los valores iniciales del formulario
                    }}
                  >
                    Enviar
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default ModalSubcategoria;
