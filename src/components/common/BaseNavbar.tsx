import React, { useState } from 'react';
import { CContainer, CDropdown, CDropdownDivider, CDropdownItem, CDropdownMenu, CDropdownToggle, CNavbar, CNavbarBrand, CNavbarNav, CNavItem, CNavLink } from '@coreui/react';
import { cilUser, cilSettings } from '@coreui/icons';
import CIcon from "@coreui/icons-react";
import '@coreui/coreui/dist/css/coreui.min.css';

const BaseNavbar: React.FC = () => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [brandText, setBrandText] = useState("Inicio");

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    // Función para actualizar el texto del brand según la página actual
    const updateBrandText = (newText: string) => {
        setBrandText(newText);
    };

    return (
        <CNavbar expand="lg" style={{ backgroundColor: '#FB6376' }}>
            <CContainer fluid className="justify-content-between">
                <CNavbarBrand href="#" className='text-white'>{brandText}</CNavbarBrand>
                <CNavbarNav>
                </CNavbarNav>
                <CDropdown  isOpen={dropdownOpen} toggle={toggleDropdown}>
                    <CDropdownToggle  style={{ backgroundColor: '#AD2831', color: 'white' }} caret>
                        <CIcon icon={cilUser} />
                    </CDropdownToggle>
                    <CDropdownMenu right={true}>
                        <CDropdownItem>
                            <CIcon icon={cilUser} /> Perfil
                        </CDropdownItem>
                        <CDropdownItem>
                            <CIcon icon={cilSettings} /> Ajustes
                        </CDropdownItem>
                        <CDropdownDivider />
                        <CDropdownItem>
                            Cerrar sesión
                        </CDropdownItem>
                    </CDropdownMenu>
                </CDropdown>
            </CContainer>
        </CNavbar>
    );
}

export default BaseNavbar;
