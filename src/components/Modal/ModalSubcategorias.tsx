import React, { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Categoria from "../../types/Categoria";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { toggleModal } from "../../redux/slices/modal";
import "./Modal.css";
import CategoriaService from "../../services/CategoriaService";
import Swal from "sweetalert2";

const ModalSubcategoria: React.FC<{ categoriaPadre: Categoria, getSubcategorias: () => void }> = ({
  categoriaPadre,
  getSubcategorias
}) => {
  const [successMessage, setSuccessMessage] = useState<string>("");
  const categoriaService = new CategoriaService();
  const url = import.meta.env.VITE_API_URL;

  const initialValues: Categoria = {
    id: 0,
    denominacion: "",
    articulos: [],
    subCategorias: [],
  };

  const modal = useAppSelector((state) => state.modal.modal);
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
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>
          {"Añadir subcategoría a: " + categoriaPadre.denominacion}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Formik
          validationSchema={Yup.object({
            denominacion: Yup.string().required("Campo requerido"),
          })}
          initialValues={initialValues}
          enableReinitialize={true}
          onSubmit={async (values: Categoria) => {
            try {
              // Lógica para agregar una nueva subcategoría
              await categoriaService.post(url + "categorias/" + categoriaPadre.id + "/subcategorias", values);
              setSuccessMessage("Se ha agregado la subcategoría correctamente.");
              getSubcategorias(); // Actualiza las subcategorías
              setTimeout(() => {
                setSuccessMessage("");
                handleClose();
                Swal.fire({
                  icon: "success",
                  title: "¡Éxito!",
                  text: successMessage,
                });
              }, 3000);
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

export default ModalSubcategoria;
