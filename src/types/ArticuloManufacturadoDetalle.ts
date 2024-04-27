import ArticuloInsumo from "./ArticuloInsumo";

interface IArticuloManufacturadoDetalle extends  DataModel<IArticuloManufacturadoDetalle> {
    cantidad: number;
    articuloInsumo: ArticuloInsumo;
}

export default IArticuloManufacturadoDetalle;