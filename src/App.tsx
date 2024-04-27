import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import BasicSidebar from './components/common/BasicSidebar';
import Empresa from './components/Empresa/Empresa';
import Inicio from './components/Inicio/Inicio';
import Producto from './components/Producto/Producto';
import Perfil from './components/Perfil/Perfil';
import Insumo from './components/Insumo/Insumo';
import Categoria from './components/Categoria/Categoria';
import Empleado from './components/Empleado/Empleado';
import Rol from './components/Rol/Rol';
import BaseNavbar from './components/common/BaseNavbar';
import Promocion from './components/Promocion/Promocion';

const App: React.FC = () => {
  return (
    <Router>
      <div style={{ width: '100%' }}>
        <BaseNavbar />
      </div>
      <div className='d-flex'>
      <BasicSidebar />

            <Routes>
              <Route path="/" element={<Inicio />} />
              <Route path="/empresas" element={<Empresa />} />
              <Route path="/productos" element={<Producto />} />
              <Route path="/perfil" element={<Perfil />} />
              <Route path="/insumos" element={<Insumo />} />
              <Route path="/categorias" element={<Categoria />} />
              <Route path="/empleados" element={<Empleado />} />
              <Route path="/roles" element={<Rol />} />
              <Route path="/promociones" element={<Promocion />} />
              {/* Otras rutas */}
            </Routes>
            </div>
    </Router>
  );
}

export default App;
