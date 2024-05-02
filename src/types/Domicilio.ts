import DataModel from "./DataModel";
import Localidad from "./Localidad";

export default interface Domicilio  extends DataModel<Domicilio>{
    id: number;
    calle: string;
    numero: number;
    cp: number;
    piso?: number | null;
    nroDpto?: number | null;
    localidad: Localidad;
  }