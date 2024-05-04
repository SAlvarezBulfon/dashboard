import React, { useState, useEffect } from "react";
import { Button, Modal } from "react-bootstrap";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import IArticuloInsumo from "../../types/ArticuloInsumo";
import ArticuloInsumoService from "../../services/InsumoService";
import Swal from "sweetalert2";

interface Props {
    show: boolean;
    onClose: () => void;
    getArticulosInsumo: () => void;
    selectedArticle: IArticuloInsumo | null;
}

const ModalEditarArticuloInsumo: React.FC<Props> = ({ show, onClose, getArticulosInsumo, selectedArticle }) => {
    const [successMessage, setSuccessMessage] = useState<string>("");
    const [initialValues, setInitialValues] = useState<IArticuloInsumo>({
        id: 0,
        denominacion: "",
        precioVenta: 0,
        precioCompra: 0,
        imagenes: [],
        unidadMedida: {
            id: 0,
            denominacion: "",
        },
        stockActual: 0,
        stockMaximo: 0,
        stockMinimo: 0,
        esParaElaborar: false,
    });
    const articuloInsumoService = new ArticuloInsumoService();
    const url = import.meta.env.VITE_API_URL;

    useEffect(() => {
        if (selectedArticle) {
            setInitialValues(selectedArticle);
        }
    }, [selectedArticle]);

    return (
        <Modal
            show={show}
            onHide={onClose}
            size="lg"
            backdrop="static"
            keyboard={false}
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title>
                    Editar artículo insumo:
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Formik
                    validationSchema={Yup.object({
                        denominacion: Yup.string().required("Campo requerido"),
                        precioVenta: Yup.number().required("Campo requerido"),
                        precioCompra: Yup.number().required("Campo requerido"),
                        stockActual: Yup.number()
                            .required("Campo requerido")
                            .min(Yup.ref("stockMinimo"), "No puede ser menor que el stock mínimo")
                            .max(Yup.ref("stockMaximo"), "No puede ser mayor que el stock máximo"),
                        stockMaximo: Yup.number().required("Campo requerido"),
                        stockMinimo: Yup.number().required("Campo requerido"),
                    })}
                    initialValues={initialValues}
                    enableReinitialize={true}
                    onSubmit={async (values: IArticuloInsumo, { setSubmitting }) => {
                        try {
                            await articuloInsumoService.put(url + "articulosInsumos", values.id.toString(), values);
                            setSuccessMessage("Se ha actualizado correctamente.");
                            getArticulosInsumo();
                            setTimeout(() => {
                                setSuccessMessage("");
                                onClose();
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
                        <Form autoComplete="off" className="form-articulo-insumo">
                            <div className="mb-4">
                                <label htmlFor="denominacion">Denominación:</label>
                                <Field
                                    name="denominacion"
                                    type="text"
                                    placeholder="Denominación"
                                    className="form-control my-2"
                                />
                                <ErrorMessage name="denominacion" className="error-message" component="div" />

                                <label htmlFor="precioVenta">Precio de Venta:</label>
                                <Field
                                    name="precioVenta"
                                    type="number"
                                    placeholder="Precio de Venta"
                                    className="form-control my-2"
                                />
                                <ErrorMessage name="precioVenta" className="error-message" component="div" />

                                <label htmlFor="precioCompra">Precio de Compra:</label>
                                <Field
                                    name="precioCompra"
                                    type="number"
                                    placeholder="Precio de Compra"
                                    className="form-control my-2"
                                />
                                <ErrorMessage name="precioCompra" className="error-message" component="div" />

                                <label htmlFor="imagenes">Imagen:</label>
                                <Field
                                    name="imagenes[0].url"
                                    type="text"
                                    placeholder="URL de la imagen"
                                    className="form-control my-2"
                                />
                                <ErrorMessage name="imagenes[0].url" className="error-message" component="div" />

                                <label htmlFor="stockActual">Stock Actual:</label>
                                <Field
                                    name="stockActual"
                                    type="number"
                                    placeholder="Stock Actual"
                                    className="form-control my-2"
                                />
                                <ErrorMessage name="stockActual" className="error-message" component="div" />

                                <label htmlFor="stockMaximo">Stock Máximo:</label>
                                <Field
                                    name="stockMaximo"
                                    type="number"
                                    placeholder="Stock Máximo"
                                    className="form-control my-2"
                                />
                                <ErrorMessage name="stockMaximo" className="error-message" component="div" />

                                <label htmlFor="stockMinimo">Stock Mínimo:</label>
                                <Field
                                    name="stockMinimo"
                                    type="number"
                                    placeholder="Stock Mínimo"
                                    className="form-control my-2"
                                />
                                <ErrorMessage name="stockMinimo" className="error-message" component="div" />
                            </div>
                            <div className="form-check my-2">
                                <Field
                                    type="checkbox"
                                    name="esParaElaborar"
                                    id="esParaElaborar"
                                    className="form-check-input"
                                />
                                <label htmlFor="esParaElaborar" className="form-check-label">
                                    ¿Es para elaborar?
                                </label>
                            </div>
                            <div className="d-flex justify-content-end">
                                <Button variant="outline-success" type="submit" className="custom-button">
                                    Enviar
                                </Button>
                            </div>
                        </Form>
                    )}
                </Formik>
            </Modal.Body>
        </Modal>
    );
};

export default ModalEditarArticuloInsumo;
