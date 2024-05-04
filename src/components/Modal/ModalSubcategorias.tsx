import React from "react";
import { Button, Modal, Form } from "react-bootstrap";
import { Formik, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Categoria from "../../types/Categoria";
import CategoriaService from "../../services/CategoriaService";
import Swal from "sweetalert2";

interface ModalSubcategoriaProps {
  categoriaPadre: Categoria;
  onClose: () => void;
}

const ModalSubcategoria: React.FC<ModalSubcategoriaProps> = ({
  categoriaPadre,
  onClose
}) => {
  const categoriaService = new CategoriaService();
  const url = import.meta.env.VITE_API_URL;

  const handleSubmit = async (values: Categoria, { setSubmitting }: any) => {
    try {
      if (categoriaPadre) {
        // Lógica para agregar la subcategoría a la categoría padre
        const subcategoriaResponse = await categoriaService.post(url + "categorias", values);

        if (!subcategoriaResponse.data.denominacion) {
          throw new Error("La subcategoría no tiene una denominación definida.");
        }

        // Actualiza la categoría padre con la nueva subcategoría añadida
        const updatedCategoriaPadre = {
          ...categoriaPadre,
          subCategorias: [...categoriaPadre.subCategorias, subcategoriaResponse.data]
        };

        const categoriaPadreResponse = await categoriaService.put(
          url + "categorias",  categoriaPadre.id.toString(), // Convertir a cadena
          updatedCategoriaPadre
        );

        if (!categoriaPadreResponse.data) {
          throw new Error("No se pudo actualizar la categoría padre.");
        }

        setSubmitting(false); // Detiene la animación de carga del botón
        onClose(); // Cierra el modal después de agregar la subcategoría

        Swal.fire({
          icon: "success",
          title: "¡Éxito!",
          text: "Se ha agregado la subcategoría correctamente.",
        });
      } else {
        throw new Error("La categoría padre no está definida.");
      }
    } catch (error) {
      console.error("Error al realizar la operación:", error);
    }
  };

  const initialValues: Categoria = {
    id: 0,
    denominacion: "",
    articulos: [],
    subCategorias: [],
  };

  return (
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
          })}
          initialValues={initialValues}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form autoComplete="off" className="form-obraAlta">
              <div className="mb-4">
                <label htmlFor="denominacion">Denominación:</label>
                <Field
                  name="denominacion"
                  type="text"
                  placeholder="Denominación"
                  className="form-control mt-2"
                />
                <ErrorMessage
                  name="denominacion"
                  className="error-message"
                  component="div"
                />
              </div>
              <div className="d-flex justify-content-end">
                <Button
                  variant="outline-success"
                  type="submit"
                  className="custom-button"
                  disabled={isSubmitting} // Desactiva el botón mientras se envía la solicitud
                >
                  {isSubmitting ? "Enviando..." : "Enviar"}
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </Modal.Body>
    </Modal>
  );
};

export default ModalSubcategoria;
