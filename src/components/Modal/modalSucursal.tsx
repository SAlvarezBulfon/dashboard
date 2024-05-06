import React, { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Sucursal from "../../types/Sucursal"; // Importa la interfaz Sucusal
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { toggleModal } from "../../redux/slices/modal";
import SucursalService from "../../services/SucursalService"; // Importa el servicio de sucursal
import Swal from "sweetalert2"; // Importa SweetAlert2

const ModalSucursal: React.FC<{ getSucursales: () => void }> = ({
    getSucursales,
}) => {
    const [successMessage, setSuccessMessage] = useState<string>("");
    const sucursalService = new SucursalService(); // Instancia SucursalService
    const url = import.meta.env.VITE_API_URL;

    const initialValues: Sucursal = {
        id: 0,
        nombre: "",
        horarioApertura: "",
        horarioCierre: "",
        categorias: [],
        promociones: [],
        domicilio: undefined
    };

    const modal = useAppSelector((state) => state.modal.modal);
    const elementActive = useAppSelector((state) => state.tabla.elementActive);
    const dispatch = useAppDispatch();

    const handleClose = () => {
        dispatch(toggleModal({ modalName: "modal" }));
    };

    return (
        <Modal
            id={"modalSucursal"}
            show={modal}
            onHide={handleClose}
            size={"lg"}
            backdrop="static"
            keyboard={false}
            centered // Centra el modal en la pantalla
        >
            <Modal.Header closeButton>
                <Modal.Title>
                    {elementActive ? "Editar Sucursal:" : "Añadir Sucursal:"}
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
                    onSubmit={async (values: Sucursal) => {
                        try {
                            if (elementActive) {
                                // Lógica para editar una sucursal existente
                                await sucursalService.put(url + "Sucursales", values.id.toString(), values);
                                setSuccessMessage("Se ha actualizado correctamente.");
                            } else {
                                // Lógica para agregar una nueva sucursal
                                await sucursalService.post(url + "sucursales", values);
                                setSuccessMessage("Se ha agregado correctamente.");
                            }
                            getSucursales(); // Actualiza las sucursales
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
                            <Form autoComplete="off" className="form-sucursal">
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

                                    <label htmlFor="horarioApertura">Horario de Apertura:</label>
                                    <Field
                                        name="horarioApertura"
                                        type="time"
                                        placeholder="horario Apertura"
                                        className="form-control my-2"
                                    />
                                    <ErrorMessage
                                        name="horarioApertura"
                                        className="error-message"
                                        component="div"
                                    />

                                    <label htmlFor="horarioCierre">horario de Cierre:</label>
                                    <Field
                                        name="horarioCierre"
                                        type="time"
                                        placeholder="horario Cierre"
                                        className="form-control my-2"
                                    />
                                    <ErrorMessage
                                        name="horarioCierre"
                                        className="error-message"
                                        component="div"
                                    />
                                    {/* Agrega otros campos necesarios para la sucursal */}
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

export default ModalSucursal;
