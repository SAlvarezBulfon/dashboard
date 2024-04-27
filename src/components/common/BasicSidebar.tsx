import React from 'react';
import { Link } from 'react-router-dom';
import { cilBarChart, cilBuilding, cilCart, cilFastfood, cilPeople } from "@coreui/icons";
import CIcon from "@coreui/icons-react";
import { CNavGroup, CNavItem, CNavTitle, CSidebar, CSidebarBrand, CSidebarHeader, CSidebarNav } from "@coreui/react";
import BaseNavbar from './BaseNavbar';
import '@coreui/coreui/dist/css/coreui.min.css';

const BasicSidebar: React.FC = () => {
    return (
        <div className="d-flex">
            <CSidebar className="border-end d-flex flex-column" style={{ height: '100vh' }}>
                <CSidebarHeader className="border-bottom">
                    <CSidebarBrand>Buen Sabor</CSidebarBrand>
                </CSidebarHeader>
                <CSidebarNav>
                    <CNavTitle>
                        Dashboard
                    </CNavTitle>
                    <CNavItem>
                        <Link to="/" className="nav-link">
                            <CIcon customClassName="nav-icon" icon={cilBarChart} />
                            Inicio
                        </Link>
                    </CNavItem>
                    <CNavItem>
                        <Link to="/empresa" className="nav-link">
                            <CIcon customClassName="nav-icon" icon={cilBuilding} />
                            Empresa
                        </Link>
                    </CNavItem>
                    <CNavGroup
                        toggler={
                            <>
                                <CIcon customClassName="nav-icon" icon={cilFastfood} />
                                Productos
                            </>
                        }
                    >
                        <CNavItem>
                            <Link to="/productos" className="nav-link">
                                <span className="nav-icon"><span className="nav-icon-bullet"></span></span>
                                Lista de Productos
                            </Link>
                        </CNavItem>
                        <CNavItem>
                            <Link to="/categorias" className="nav-link">
                                <span className="nav-icon"><span className="nav-icon-bullet"></span></span>
                                Categorías
                            </Link>
                        </CNavItem>
                    </CNavGroup>
                    <CNavGroup
                        toggler={
                            <>
                                <CIcon customClassName="nav-icon" icon={cilPeople} />
                                Empleados
                            </>
                        }
                    >
                        <CNavItem>
                            <Link to="/empleados" className="nav-link">
                                <span className="nav-icon"><span className="nav-icon-bullet"></span></span>
                                Lista de Empleados
                            </Link>
                        </CNavItem>
                        <CNavItem>
                            <Link to="/roles" className="nav-link">
                                <span className="nav-icon"><span className="nav-icon-bullet"></span></span>
                                Roles
                            </Link>
                        </CNavItem>
                    </CNavGroup>
                    <CNavItem>
                        <Link to="/insumos" className="nav-link">
                            <CIcon customClassName="nav-icon" icon={cilCart} />
                            Insumos
                        </Link>
                    </CNavItem>
                </CSidebarNav>
            </CSidebar>
            <div className='flex-column' style={{ width: '100%' }}>
                <BaseNavbar />
            </div>
        </div>
    );
}

export default BasicSidebar;
