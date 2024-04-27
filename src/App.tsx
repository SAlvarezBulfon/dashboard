import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import BasicSidebar from './components/common/BasicSidebar';
import Empresa from './components/Empresa/Empresa';

function App() {
  return (
    <Router>
      <BasicSidebar />
      <Routes>
        {/* Definir las rutas aquí */}
        {/* <Route path="/inicio" Component={Inicio} /> */}
        <Route path="/empresa" Component={Empresa} />
        {/* <Route path="/productos" Component={Productos} /> */}
        {/* <Route path="/empleados" Component={Empleados} /> */}
        {/* <Route path="/insumos" Component={Insumos} /> */}
      </Routes>
    </Router>
  );
}

export default App;
