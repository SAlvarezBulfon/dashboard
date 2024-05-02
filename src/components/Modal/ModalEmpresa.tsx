import React, { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Empresa from "../../types/Empresa"; // Importa la interfaz Empresa
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { toggleModal } from "../../redux/slices/modal";
import EmpresaService from "../../services/EmpresaService"; // Importa el servicio de empresa
import Swal from "sweetalert2"; // Importa SweetAlert2

const ModalEmpresa: React.FC<{ getEmpresas: () => void }> = ({
    getEmpresas,
}) => {
    const [successMessage, setSuccessMessage] = useState<string>("");
    const empresaService = new EmpresaService(); // Instancia EmpresaService
    const url = import.meta.env.VITE_API_URL;

    const initialValues: Empresa = {
        id: 0,
        nombre: "",
        razonSocial: "",
        cuil: 0,
        sucursales: [],
    };

    const modal = useAppSelector((state) => state.modal.modal);
    const elementActive = useAppSelector((state) => state.tabla.elementActive);
    const dispatch = useAppDispatch();

    const handleClose = () => {
        dispatch(toggleModal({ modalName: "modal" }));
    };

    return (
        <Modal
            id={"modalEmpresa"}
            show={modal}
            onHide={handleClose}
            size={"lg"}
            backdrop="static"
            keyboard={false}
            centered // Centra el modal en la pantalla
        >
            <Modal.Header closeButton>
                <Modal.Title>
                    {elementActive ? "Editar empresa:" : "Añadir empresa:"}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Formik
                    validationSchema={Yup.object({
                        nombre: Yup.string().required("Campo requerido"),
                        razonSocial: Yup.string().required("Campo requerido"),
                        cuil: Yup.number().required("Campo requerido"),
                        // Agrega validaciones para otros campos si es necesario
                    })}
                    initialValues={elementActive ? elementActive : initialValues}
                    enableReinitialize={true}
                    onSubmit={async (values: Empresa) => {
                        try {
                            if (elementActive) {
                                // Lógica para editar una empresa existente
                                await empresaService.put(url + "empresas", values.id.toString(), values);
                                setSuccessMessage("Se ha actualizado correctamente.");
                            } else {
                                // Lógica para agregar una nueva empresa
                                await empresaService.post(url + "empresas", values);
                                setSuccessMessage("Se ha agregado correctamente.");
                            }
                            getEmpresas(); // Actualiza las empresas
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
                            <Form autoComplete="off" className="form-empresa">
                                <div className="mb-4">
                                    <label htmlFor="nombre">Nombre:</label>
                                    <Field
                                        name="nombre"
                                        type="text"
                                        placeholder="Nombre"
                                        className="form-control my-2"
                                    />
                                    <ErrorMessage
                                        name="nombre"
                                        className="error-message"
                                        component="div"
                                    />

                                    <label htmlFor="razonSocial">Razon Social:</label>
                                    <Field
                                        name="razonSocial"
                                        type="text"
                                        placeholder="Razon Social"
                                        className="form-control my-2"
                                    />
                                    <ErrorMessage
                                        name="razonSocial"
                                        className="error-message"
                                        component="div"
                                    />

                                    <label htmlFor="cuil">CUIL:</label>
                                    <Field
                                        name="cuil"
                                        type="number"
                                        placeholder="CUIL"
                                        className="form-control my-2"
                                    />
                                    <ErrorMessage
                                        name="cuil"
                                        className="error-message"
                                        component="div"
                                    />
                                    {/* Agrega otros campos necesarios para la empresa */}
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

export default ModalEmpresa;
