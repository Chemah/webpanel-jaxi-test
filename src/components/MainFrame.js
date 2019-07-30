import React, { useState } from 'react';
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  Container,
  Row,
  Col,
  Jumbotron,
  UncontrolledTooltip,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from 'reactstrap';
import Projects from '../views/projects/MainView'

function MainFrame () {
  
  const [navCollpased, collapseNav] = useState(false)
  const [selectedSection, changeSection] = useState("Proyectos")

    return (
      <div>
        <Navbar color="dark" dark expand="md">
          <NavbarBrand href="/">Jaxi Tank </NavbarBrand>
          <NavbarToggler onClick={() => { collapseNav(!navCollpased) }} />
          
          <Collapse isOpen={navCollpased} navbar>
            <Nav className="" navbar>              
              <UncontrolledDropdown nav inNavbar>
                <DropdownToggle nav caret id="selectionOptions">
                  { selectedSection }
                </DropdownToggle>
                <UncontrolledTooltip placement="bottom" target="selectionOptions">
                    Selecciona una opción
                  </UncontrolledTooltip>
                <DropdownMenu right>
                  <DropdownItem onClick={ () =>{ 
                    changeSection("Proyectos")
                   } }>
                    Proyectos
                  </DropdownItem>
                  <DropdownItem divider />
                  <DropdownItem onClick={ () =>{ 
                    changeSection("Usuarios")
                   } }>
                    Usuarios
                  </DropdownItem>
                  <DropdownItem divider />
                  <DropdownItem onClick={ () =>{ 
                    changeSection("Tareas")
                   } }>
                    Todas las tareas
                  </DropdownItem>
                </DropdownMenu>
              </UncontrolledDropdown>
              <NavItem>
                <NavLink
                id="githubLink"
                href="https://github.com/Chemah/webpanel-jaxi-test">
                  GitHub
                </NavLink>
                <UncontrolledTooltip 
                placement="bottom" 
                target="githubLink">
                    Checa el código fuente!
                  </UncontrolledTooltip>
              </NavItem>
            </Nav>
          </Collapse>
        </Navbar>
        <Jumbotron>
          <Container>
            <Row>
              <Col>
                   { selectedSection === "Proyectos" ? <Projects/> : null }
                   { selectedSection === "Usuarios" ? null : null }
                   { selectedSection === "Tareas" ? null : null }
              </Col>
            </Row>
          </Container>
        </Jumbotron>
      </div>
    )
}

export default MainFrame 