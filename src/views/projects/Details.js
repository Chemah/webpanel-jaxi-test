import React, { Component, Fragment, useState } from 'react'
import { InputGroup, InputGroupAddon, Button, Input, Label, FormGroup, UncontrolledTooltip, Row, Col, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import Table from '../../components/Table'
import { IoMdCreate, IoIosTrash, IoMdAdd, IoMdSave, IoIosArrowBack, IoIosClose } from "react-icons/io";

/**
 * Tabla que muestra los usuarios relacionado al proyecto
 * @param {*} param0 
 */
const ProjectUsersTable = ({ onDetails, onRemove }) => {
     return (
          <Fragment>
               <Table
                    onDetails={onDetails}
                    onRemove={onRemove}
                    buttonLabels={[<IoMdCreate color="white" size="22" />, <IoIosClose color="white" size="22" />]}
                    headers={["Nombre completo", "Tareas asignadas"]}
                    rows={
                         [
                              { nombreCompleto: "José María Chico López", tareas: 3 },
                              { nombreCompleto: "José María Chico López", tareas: 3 },
                              { nombreCompleto: "José María Chico López", tareas: 3 },
                              { nombreCompleto: "José María Chico López", tareas: 3 },
                         ]
                    }
               />
          </Fragment>
     )
}

/**
 * Tabla que muestra las tareas relacionadas al proyecto
 * @param {*} param0 
 */
const ProjectTasksTable = ({ onDetails, onRemove }) => {
     return (
          <Fragment>
               <Table
                    onDetails={onDetails}
                    onRemove={onRemove}
                    buttonLabels={[<IoMdCreate color="white" size="22" />, <IoIosClose color="white" size="22" />]}
                    headers={["Titulo", "Prioridad"]}
                    rows={
                         [
                              { titulo: "Maquetar la cosa esta", prioridad: 10, },
                              { titulo: "Maquetar la cosa esta", prioridad: 10, },
                              { titulo: "Maquetar la cosa esta", prioridad: 10, }
                         ]
                    }
               />
          </Fragment>
     )
}

/**
 * Formulario que permite editar los datos de un usuario
 * @param {*} param0 
 */
const FormEditUser = ({onSave}) => {
     const [strName, setStrName] = useState("")
     const [strUser, setStrUser] = useState("")
     const [strPassword, setStrPassword] = useState("")

     return (
          <Row>
               <Col md="12">
                    <FormGroup>
                         <Label for="strName">Nombre completo</Label>
                         <Input type="text" name="strName" id="strName" value={strName} onChange={event => { setStrName(event.target.value) }}/>
                    </FormGroup>
                    <FormGroup>
                         <Label for="strUser">Usuario</Label>
                         <Input type="text" name="strUser" id="strName" value={strUser} onChange={event => { setStrUser(event.target.value) }}/>
                    </FormGroup>
                    <FormGroup>
                         <Label for="strPassword">Contraseña</Label>
                         <Input type="password" name="strPassword" id="strPassword" value={strPassword} onChange={event => { setStrPassword(event.target.value) }}/>
                    </FormGroup>
               </Col>
               <Col md="12">
               <Button color="dark" onClick={() => {
                    onSave(strName, strUser, strPassword)
               }}>Guardar cambios</Button>
               </Col>
          </Row>
     )
}

/**
 * Formulario que permite editar los datos de una tarea
 * @param {*} param0 
 */
const FormEditTask = ({onSave}) => {
     const [strTitle, setStrTitle] = useState("")
     const [strDescription, setStrDescription] = useState("")
     const [strPriority, setStrPriority] = useState(0)
     const [dtmStartDate, setDtmStartDate] = useState("07-01-2019")

     return (
          <Row>
               <Col md="12">
                    <FormGroup>
                         <Label for="strName">Título</Label>
                         <Input type="text" name="strName" id="strName" value={strTitle} onChange={event => { setStrTitle(event.target.value) }}/>
                    </FormGroup>
                    <FormGroup>
                         <Label for="strDescription">Descripción</Label>
                         <Input type="text" name="strDescription" id="strDescription" value={strDescription} onChange={event => { setStrDescription(event.target.value) }}/>
                    </FormGroup>
                    <FormGroup>
                         <Label for="strDescription">Prioridad</Label>
                         <Input type="number" name="strPriority" id="strPriority" value={strPriority} onChange={event => { setStrPriority(event.target.value) }}/>
                    </FormGroup>
                    <FormGroup>
                         <Label for="dtmStartDate">Contraseña</Label>
                         <Input type="date" name="dtmStartDate" id="dtmStartDate" value={dtmStartDate} onChange={event => { setDtmStartDate(event.target.value) }}/>
                    </FormGroup>
               </Col>
               <Col md="12">
               <Button color="dark" onClick={() => {
                    onSave(strTitle, strDescription, strPriority, dtmStartDate)
               }}>Guardar cambios</Button>
               </Col>
          </Row>
     )
}

/**
 * Ventana modal que muestra un formulario de edición para usuarios o tareas
 * @param {*} param0 
 */
const ModalEdit = ({toEdit, toggleModal, modalIsOpen, onSave}) => {

     return (
          <div>
               <Modal isOpen={modalIsOpen} toggle={toggleModal}>
                    <ModalHeader toggle={toggleModal}>Detalles y edición</ModalHeader>
                    <ModalBody>
                         { toEdit === "user" ? <FormEditUser  onSave={onSave}/> : null}
                         { toEdit === "task" ? <FormEditTask onSave={onSave}/> : null}
                    </ModalBody>
                    <ModalFooter>
                         <Button color="secondary" onClick={toggleModal}>Cerrar</Button>
                    </ModalFooter>
               </Modal>
          </div>
     )
}

/**
 * Detalles del item seleccionado
 */
export default class Details extends Component {
     constructor(props) {
          super(props)
          this.state = {
               modalIsOpen: false,
               whatToEdit: ""
          }

          this.toggleModal = this.toggleModal.bind(this)
     }

     /**
      * Permite ver los detalles del usuario
      * @param {*} dataSourceIndex 
      */
     handleUserDetails(dataSourceIndex) {
          this.setState({ whatToEdit: "user" })
          this.toggleModal()
     }

     /**
      * Elimina la relación entre proyecto y usuario
      * @param {*} dataSourceIndex 
      */
     handleUserRemove(dataSourceIndex) {
          alert("Desvincular el usuario de inmediato")
     }

     /**
      * Permite ver los detalles de una tarea
      * @param {*} dataSourceIndex 
      */
     handleTaskDetails(dataSourceIndex) {
          this.setState({ whatToEdit: "task" })
          this.toggleModal()
     }
     
     /**
      * Elimina la tarea
      * @param {*} dataSourceIndex 
      */
     handleTaskRemove(dataSourceIndex) {
          alert("Eliminar la tarea de inmediato")
     }

     /**
      * Muestra u oculta la ventana modal
      */
     toggleModal() {
          this.setState(prevState => ({
               modalIsOpen: !prevState.modalIsOpen
          }))
     }

     /**
      * Actualiza los datos del usuario
      * @param {*} strName 
      * @param {*} strUser 
      * @param {*} strPassword 
      */
     updateUserData(strName, strUser, strPassword){
          alert("Se va a actualizar el usuario con " + strName + strUser + strPassword)
     }

     /**
      * Actualiza los datos de una tarea
      * @param {*} strTitle 
      * @param {*} strDescription 
      * @param {*} strPriority 
      * @param {*} dtmStartDate 
      */
     updateTaskData(strTitle, strDescription, strPriority, dtmStartDate){
          alert("Se va a actualizar la task con " + strTitle + strDescription + strPriority + dtmStartDate)
     }

     /**
      * 
      */
     render() {
          return (
               <Fragment>
                    <ModalEdit 
                    toggleModal={this.toggleModal.bind(this)} 
                    modalIsOpen={this.state.modalIsOpen} 
                    toEdit={this.state.whatToEdit}
                    onSave={ 
                         this.state.whatToEdit === "user" ? 
                         (this.updateUserData.bind(this)) : (this.updateTaskData.bind(this))
                    }
                    />
                    <div style={
                         {
                              background: "linear-gradient(41deg, rgba(15,214,222,1) 0%, rgba(223,10,107,1) 100%)",
                              minHeight: "20pt",
                              borderRadius: "10pt 10pt 0pt 0pt"
                         }
                    }></div>
                    <div style={
                         {
                              background: "rgba(255,255,255, 0.5)",
                              padding: "15pt"
                         }
                    } >
                         <InputGroup id="title">
                              <InputGroupAddon addonType="prepend">Título</InputGroupAddon>
                              <Input placeholder="Dale un buen título" />
                         </InputGroup>
                         <br />
                         <FormGroup>
                              <Label for="description">Descripción</Label>
                              <Input type="textarea" name="description" id="description" />
                              <UncontrolledTooltip placement="left" target="description"> Descríbelo adecuadamente </UncontrolledTooltip>
                         </FormGroup>
                         <br />
                         <Row>
                              <Col md="6">
                                   <InputGroup>
                                        <InputGroupAddon addonType="prepend">Fecha de inicio</InputGroupAddon>
                                        <Input type="date" placeholder="Fecha de inicio" />
                                   </InputGroup>
                              </Col>
                              <Col md="6">
                                   <InputGroup>
                                        <InputGroupAddon addonType="prepend">Fecha límite</InputGroupAddon>
                                        <Input type="date" placeholder="Fecha límite" />
                                   </InputGroup>
                              </Col>
                         </Row>
                         <Row style={{ marginTop: "10pt" }}>
                              <Col>
                                   <Button color="secondary" style={{ minWidth: "100%" }}>Guardar cambios</Button>
                              </Col>
                         </Row>
                    </div>
                    <Row>
                         <Col md="6">
                              <ProjectUsersTable
                                   onDetails={this.handleUserDetails.bind(this)}
                                   onRemove={this.handleUserRemove.bind(this)}
                              />
                         </Col>
                         <Col md="6">
                              <ProjectTasksTable
                                   onDetails={this.handleTaskDetails.bind(this)}
                                   onRemove={this.handleTaskRemove.bind(this)}
                              />
                         </Col>
                    </Row>
               </Fragment>)
     }
}