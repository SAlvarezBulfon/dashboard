import React, { useState, useEffect } from "react";
import { Button, Modal, Form } from "react-bootstrap";
import { Formik, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import IArticuloInsumo from "../../types/ArticuloInsumo";
import IUnidadMedida from "../../types/UnidadMedida";
import InsumoService from "../../services/InsumoService";
import UnidadMedidaService from "../../services/UnidadesMedidasService";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { setUnidadMedida } from "../../redux/slices/unidadesMedidas";
import './Modal.css'

interface ModalCrearArticuloInsumoProps {
    show: boolean;
    onClose: () => void;
}

const ModalCrearArticuloInsumo: React.FC<ModalCrearArticuloInsumoProps> = ({
    show,
    onClose
}) => {
    const dispatch = useAppDispatch();
    const globalUnidadesMedida = useAppSelector((state) => state.unidadMedida.unidadMedida);
    const [successMessage, setSuccessMessage] = useState<string>("");
    const [unidadesMedida, setUnidadesMedida] = useState<IUnidadMedida[]>([]);
    const insumoService = new InsumoService();
    const unidadMedidaService = new UnidadMedidaService();
    const url = import.meta.env.VITE_API_URL;

    useEffect(() => {
        const fetchUnidadesMedida = async () => {
            try {
                const unidades = await unidadMedidaService.getAll(url + "unidadesMedidas");
                setUnidadesMedida(unidades);
                dispatch(setUnidadMedida(unidades));
            } catch (error) {
                console.error("Error al obtener las unidades de medida:", error);
            }
        };
        fetchUnidadesMedida();
    }, [dispatch]);

    // Función para manejar el envío del formulario
    const handleSubmit = async (values: IArticuloInsumo, { setSubmitting }: any) => {
        try {
            await insumoService.post(url + "/articulosInsumos", values);
            setSuccessMessage("Artículo insumo creado correctamente.");
        } catch (error) {
            console.error("Error al crear el artículo insumo:", error);
        } finally {
            setSubmitting(false);
        }
    };

    // Esquema de validación para el formulario
    const validationSchema = Yup.object({
        denominacion: Yup.string().required("Campo requerido"),
        precioVenta: Yup.number().required("Campo requerido").positive("Debe ser un número positivo"),
        unidadMedida: Yup.object().shape({
            id: Yup.number().required(),
            denominacion: Yup.string().required()
        }).required("Campo requerido"),
        precioCompra: Yup.number().required("Campo requerido").positive("Debe ser un número positivo"),
        stockActual: Yup.number().required("Campo requerido").integer("Debe ser un número entero").min(0, "Debe ser mayor o igual a 0"),
        stockMaximo: Yup.number().required("Campo requerido").integer("Debe ser un número entero").min(0, "Debe ser mayor o igual a 0"),
        stockMinimo: Yup.number().required("Campo requerido").integer("Debe ser un número entero").min(0, "Debe ser mayor o igual a 0"),
        urlImagen: Yup.string().url("Debe ser una URL válida").required("Campo requerido"),
        esParaElaborar: Yup.boolean().required("Campo requerido")
    });

    // Valores iniciales del formulario
    const initialValues: IArticuloInsumo = {
        id: 0,
        denominacion: "",
        precioVenta: 0,
        imagenes: [],
        unidadMedida: globalUnidadesMedida[0] || { id: 0, denominacion: "" }, // Unidad de medida por defecto
        precioCompra: 0,
        stockActual: 0,
        stockMaximo: 0,
        stockMinimo: 0,
        urlImagen: "",
        esParaElaborar: false
    };

    return (
        <Modal show={show} onHide={onClose}>
            <Modal.Header closeButton>
                <Modal.Title>Crear Artículo Insumo</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                >
                    {({ isSubmitting }) => (
                        <Form>
                            <div className="mb-3">
                                <label htmlFor="denominacion">Denominación:</label>
                                <Field name="denominacion" type="text" className="form-control" />
                                <ErrorMessage name="denominacion" component="div" className="text-danger" />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="precioVenta">Precio de Venta:</label>
                                <Field name="precioVenta" type="number" className="form-control" />
                                <ErrorMessage name="precioVenta" component="div" className="text-danger" />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="unidadMedida">Unidad de Medida:</label>
                                <Field as="select" name="unidadMedida" className="form-control">
                                    {unidadesMedida.map((unidad) => (
                                        <option key={unidad.id} value={unidad.id}>
                                            {unidad.denominacion}
                                        </option>
                                    ))}
                                </Field>

                                <ErrorMessage name="unidadMedida.id" component="div" className="text-danger" />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="precioCompra">Precio de Compra:</label>
                                <Field name="precioCompra" type="number" className="form-control" />
                                <ErrorMessage name="precioCompra" component="div" className="text-danger" />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="stockActual">Stock Actual:</label>
                                <Field name="stockActual" type="number" className="form-control" />
                                <ErrorMessage name="stockActual" component="div" className="text-danger" />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="stockMaximo">Stock Máximo:</label>
                                <Field name="stockMaximo" type="number" className="form-control" />
                                <ErrorMessage name="stockMaximo" component="div" className="text-danger" />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="stockMinimo">Stock Mínimo:</label>
                                <Field name="stockMinimo" type="number" className="form-control" />
                                <ErrorMessage name="stockMinimo" component="div" className="text-danger" />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="urlImagen">URL Imagen:</label>
                                <Field name="urlImagen" type="text" className="form-control" />
                                <ErrorMessage name="urlImagen" component="div" className="text-danger" />
                            </div>
                            <div className="mb-3 form-check">
                                <Field name="esParaElaborar" type="checkbox" className="form-check-input" />
                                <label className="form-check-label" htmlFor="esParaElaborar">¿Es para elaborar?</label>
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

export default ModalCrearArticuloInsumo;
