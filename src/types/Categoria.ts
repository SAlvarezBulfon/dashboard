interface Categoria extends DataModel<Categoria>{
    denominacion: string,
    articulos: [],
    subCategorias: Categoria[]
}

export default Categoria;