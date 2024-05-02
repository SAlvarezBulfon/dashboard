import React, { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Categoria from "../../types/Categoria";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { toggleModal } from "../../redux/slices/modal";
import "./Modal.css";
import CategoriaService from "../../services/CategoriaService"; // Importa CategoriaService
import Swal from "sweetalert2"; // Importa SweetAlert2

const ModalCategoria: React.FC<{ getCategorias: () => void }> = ({
  getCategorias,
}) => {
  const [successMessage, setSuccessMessage] = useState<string>("");
  const categoriaService = new CategoriaService(); // Instancia CategoriaService
  const url = import.meta.env.VITE_API_URL;

  const initialValues: Categoria = {
    id: 0,
    denominacion: "",
    articulos: [],
    subCategorias: [],
  };

  const modal = useAppSelector((state) => state.modal.modal);
  const elementActive = useAppSelector((state) => state.tabla.elementActive);
  const dispatch = useAppDispatch();

  const handleClose = () => {
    dispatch(toggleModal({ modalName: "modal" }));
  };

  return (
    <Modal
      id={"modal"}
      show={modal}
      onHide={handleClose}
      size={"lg"}
      backdrop="static"
      keyboard={false}
      centered // Centra el modal en la pantalla
    >
      <Modal.Header closeButton>
        <Modal.Title>
          {elementActive ? "Editar categoría:" : "Añadir categoría:"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Formik
          validationSchema={Yup.object({
            denominacion: Yup.string().required("Campo requerido"),
          })}
          initialValues={elementActive ? elementActive : initialValues}
          enableReinitialize={true}
          onSubmit={async (values: Categoria) => {
            try {
              if (elementActive) {
                // Lógica para editar una categoría existente
                await categoriaService.put(url + "categorias", values.id.toString(), values);
                setSuccessMessage("Se ha actualizado correctamente.");
              } else {
                // Lógica para agregar una nueva categoría
                await categoriaService.post(url + "categorias", values);
                setSuccessMessage("Se ha agregado correctamente.");
              }
              getCategorias(); // Actualiza las categorías
              setTimeout(() => {
                setSuccessMessage(""); // Limpiar el mensaje después de cierto tiempo
                handleClose(); // Cierra el modal
                Swal.fire({
                  icon: "success",
                  title: "¡Éxito!",
                  text: successMessage,
                });
              }, 3000); // Ocultar el mensaje después de 3 segundos
            } catch (error) {
              console.error("Error al realizar la operación:", error);
            }
          }}
        >
          {() => (
            <>
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
                  {/* Añade otros campos necesarios para la categoría */}
                </div>
                <div className="d-flex justify-content-end">
                  <Button
                    variant="outline-success"
                    type="submit"
                    className="custom-button"
                  >
                    Enviar
                  </Button>
                </div>
              </Form>
            </>
          )}
        </Formik>
      </Modal.Body>
    </Modal>
  );
};

export default ModalCategoria;
