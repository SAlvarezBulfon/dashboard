import DataModel from "./DataModel";
import Sucursal from "./Sucursal";

export default interface Empresa extends DataModel<Empresa> {
    id: number;
    nombre: string;
    razonSocial: string;
    cuil: number;
    sucursales: Sucursal[];
  }