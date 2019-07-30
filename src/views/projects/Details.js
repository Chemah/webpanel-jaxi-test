import React, { Component, Fragment, useState } from 'react'
import { InputGroup, InputGroupAddon, Button, Input, Label, FormGroup, UncontrolledTooltip, Row, Col, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import Table from '../../components/Table'
import { IoMdCreate, IoIosTrash, IoMdAdd, IoMdSave, IoIosArrowBack, IoIosClose } from "react-icons/io"
import store from '../../store'
import { urls } from '../../utils/routes'
import API from '../../utils/API'
import { 
     UPDATE_PROJECT_TABLE_ROWS, 
     UPDATE_PROJECTS,
     LOAD_SELECTED_PROJECT,
     UPDATE_PROJECT_TASKS_TABLE_ROWS
 } from '../../action_types'

/**
 * Tabla que muestra los usuarios relacionado al proyecto
 * @param {*} param0 
 */
const ProjectUsersTable = ({ onDetails, onRemove, rows }) => {
     return (
          <Fragment>
               <Table
                    onDetails={onDetails}
                    onRemove={onRemove}
                    buttonLabels={[<IoMdCreate color="white" size="22" />, <IoIosClose color="white" size="22" />]}
                    headers={["Nombre completo", "Tareas asignadas"]}
                    rows={ rows }
               />
          </Fragment>
     )
}

/**
 * Tabla que muestra las tareas relacionadas al proyecto
 * @param {*} param0 
 */
const ProjectTasksTable = ({ onDetails, onRemove, rows }) => {
     return (
          <Fragment>
               <Table
                    onDetails={onDetails}
                    onRemove={onRemove}
                    buttonLabels={[<IoMdCreate color="white" size="22" />, <IoIosClose color="white" size="22" />]}
                    headers={["Titulo", "Prioridad"]}
                    rows={rows}
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
                         <Label for="dtmStartDate">Fecha de inicio</Label>
                         <Input type="date" name="dtmStartDate" id="dtmStartDate" value={dtmStartDate} onChange={event => { setDtmStartDate(event.target.value) }}/>
                    </FormGroup>
               </Col>
               <Col md="12">
               <Button color="dark" onClick={() => {
                    onSave(strTitle, strDescription, strPriority, dtmStartDate)
               }}>Guardar </Button>
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
                    <ModalHeader toggle={toggleModal}> {toEdit === "createTask" ? "Nueva tarea" : "Detalles y edición"} </ModalHeader>
                    <ModalBody>
                         { toEdit === "user" ? <FormEditUser  onSave={onSave}/> : null}
                         { toEdit === "task" ? <FormEditTask onSave={onSave}/> : null}
                         { toEdit === "createTask" ? <FormEditTask onSave={onSave}/> : null}
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
               whatToEdit: "",
               selectedProject: {
                    tasks: []
               },
               projectTasksRows: []
          }

          store.subscribe(() => {
               this.setState({
                    selectedProject: store.getState().selectedProject,
                    projectTasksRows: store.getState().projectTasksRows,
               })
          })

          this.toggleModal = this.toggleModal.bind(this)
     }

     componentDidMount(){
          let selectedProject = store.getState().selectedProject
          let projectTasksRows = this.getTasksRows(selectedProject.tasks)

          store.dispatch({
               type: LOAD_SELECTED_PROJECT,
               selectedProject: selectedProject
          })

          store.dispatch({
               type: UPDATE_PROJECT_TASKS_TABLE_ROWS,
               projectTasksRows: projectTasksRows
          })
     }

     /**
      * Devuelve las filas en formato para la tabla en base a los datos de 
      * los usuarios dentro de projects
      * @param {*} tasks 
      */
     getTasksRows(tasks) {
          try {
               let rows = tasks.map((item, index) => {
                    return ({
                         str_name: item.str_title,
                         int_priority: item.int_priority
                    })
               })
               return rows
          }
          catch (err) {
               console.log(err)
               return []
          }
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
      * MOdal para crear task
      */
     handleShowModalTask (){
          this.setState({ whatToEdit: "createTask" })
          this.toggleModal()
     }
     
     /**
      * Elimina la tarea
      * @param {*} dataSourceIndex 
      */
     handleTaskRemove(dataSourceIndex) {
          this.removeTask(dataSourceIndex)
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
     async updateProjectData(){
          try{
               let data = {
                    int_id: this.state.selectedProject.int_id,
                    str_title: this.state.selectedProject.str_title,
                    str_description: this.state.selectedProject.str_description,
                    dtm_start_date: this.state.selectedProject.dtm_start_date,
                    dtm_end_date: this.state.selectedProject.dtm_end_date,
               }

               let newProject = await API.put(
                    urls.projects,
                    data
               )
               if (newProject.status === 202){
                    this.props.parentContext.handleIsLoading("Actualizando datos...")
                    let projects = await this.props.parentContext.getProjectsFromService()
                    let projectTableRows = this.props.parentContext.getProjectRows(projects)
                    store.dispatch({
                         type: UPDATE_PROJECTS,
                         projects: projects
                    })
                    store.dispatch({
                         type: UPDATE_PROJECT_TABLE_ROWS,
                         projectTableRows: projectTableRows
                    })
                    this.props.parentContext.handleStopLoading()
               }
               else
                    alert("No se pudo registrar el nuevo proyecto")
          }
          catch(err){
               alert("Ha ocurrido un error")
               console.log(err)
          }
     }

     /**
      * Crea una nueva tarea
      */
     async createNewtask(strTitle, strDescription, intPriority, dtmStartDate) {
          try{
               let data = {
                    project_int_id: this.state.selectedProject.int_id,
                    str_title: strTitle,
                    str_description: strDescription,
                    int_priority: intPriority,
                    dtm_start_date: dtmStartDate,
               }

               let newTask = await API.post(
                    urls.tasks,
                    data
               )

               this.toggleModal()

               if (newTask.status === 201){
                    
                    this.props.parentContext.handleIsLoading("Actualizando datos...")
                    let projects = await this.props.parentContext.getProjectsFromService()
                    let projectTableRows = this.props.parentContext.getProjectRows(projects)
                    let selectedProject =  this.getProjectFromDataSource(projects, this.state.selectedProject.int_id)
                    let projectTasksRows = this.getTasksRows(selectedProject.tasks)


                    store.dispatch({
                         type: UPDATE_PROJECTS,
                         projects: projects
                    })
                    store.dispatch({
                         type: UPDATE_PROJECT_TABLE_ROWS,
                         projectTableRows: projectTableRows
                    })
                    store.dispatch({
                         type: LOAD_SELECTED_PROJECT,
                         selectedProject: selectedProject
                    })

                    store.dispatch({
                         type: UPDATE_PROJECT_TASKS_TABLE_ROWS,
                         projectTasksRows: projectTasksRows
                    })
                    this.props.parentContext.handleStopLoading()
               }
               else
                    alert("No se pudo registrar la tarea")
          }
          catch(err){
               alert("Ocurrio un error")
               console.log(err)
               return []
          }
     }

     /**
      * Devuelve el project según el indice
      * @param {*} index 
      */
     getProjectFromDataSource(projects, int_id){
          let project = {}
          for(let i = 0; i < projects.length; i++){
               if(projects[i].int_id === int_id)
                    return projects[i]
          }
          return project
     }

     /**
      * Devuelve el task según el indice
      * @param {*} index 
      */
     getTaskFromDataSource(index){
          let {selectedProject} = this.state

          let task = selectedProject.tasks[index]
          console.log(task)
          return task
     }

     /**
      * Desactiva una task
      * @param {*} index 
      */
     async removeTask(index) {
          try {
               let task = this.getTaskFromDataSource(index)
               this.props.parentContext.handleIsLoading("Intentando desactivar...")
               let result = await API.delete(
                    urls.tasks + task.int_id
               )
               if (result.status === 202){
                    console.log(result)
                    this.props.parentContext.handleIsLoading("Actualizando datos...")
                    let projects = await this.props.parentContext.getProjectsFromService()
                    let projectTableRows = this.props.parentContext.getProjectRows(projects)
                    let selectedProject =  this.getProjectFromDataSource(projects, this.state.selectedProject.int_id)
                    let projectTasksRows = this.getTasksRows(selectedProject.tasks)

                    store.dispatch({
                         type: UPDATE_PROJECTS,
                         projects: projects
                    })
                    store.dispatch({
                         type: UPDATE_PROJECT_TABLE_ROWS,
                         projectTableRows: projectTableRows
                    })
                    store.dispatch({
                         type: LOAD_SELECTED_PROJECT,
                         selectedProject: selectedProject
                    })

                    store.dispatch({
                         type: UPDATE_PROJECT_TASKS_TABLE_ROWS,
                         projectTasksRows: projectTasksRows
                    })
                    this.props.parentContext.handleStopLoading()
               }
               else
                    alert("No se pudo registrar el nuevo proyecto")
  
          }
          catch (err) {
               alert(err)
               console.log(err)
               return false
          }
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
                         (this.updateUserData.bind(this)) : 
                         (
                         this.state.whatToEdit === "task" ?
                              (this.updateTaskData.bind(this)) :
                              (this.createNewtask.bind(this))
                         )
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
                              <Input placeholder="Dale un buen título" value={this.state.selectedProject.str_title ? this.state.selectedProject.str_title : ""}  onChange={event => {
                                             let {selectedProject} = this.state
                                             selectedProject.str_title = event.target.value
                                             this.setState({
                                                  selectedProject: selectedProject
                                             })
                                        }}/>
                         </InputGroup>
                         <br />
                         <FormGroup>
                              <Label for="description">Descripción</Label>
                              <Input type="textarea" name="description" id="description" value={this.state.selectedProject.str_description ? this.state.selectedProject.str_description : ""}  onChange={event => {
                                             let {selectedProject} = this.state
                                             selectedProject.str_description = event.target.value
                                             this.setState({
                                                  selectedProject: selectedProject
                                             })
                                        }}/>
                              <UncontrolledTooltip placement="left" target="description" value={this.state.selectedProject.str_description}> Descríbelo adecuadamente </UncontrolledTooltip>
                         </FormGroup>
                         <br />
                         <Row>
                              <Col md="6">
                                   <InputGroup>
                                        <InputGroupAddon addonType="prepend">Fecha de inicio</InputGroupAddon>
                                        <Input type="date" placeholder="Fecha de inicio" value={this.state.selectedProject.dtm_start_date ? this.state.selectedProject.dtm_start_date : ""} onChange={event => {
                                             let {selectedProject} = this.state
                                             selectedProject.dtm_start_date = event.target.value
                                             this.setState({
                                                  selectedProject: selectedProject
                                             })
                                        }}/>
                                   </InputGroup>
                              </Col>
                              <Col md="6">
                                   <InputGroup>
                                        <InputGroupAddon addonType="prepend">Fecha límite</InputGroupAddon>
                                        <Input type="date" placeholder="Fecha límite" value={this.state.selectedProject.dtm_end_date ? this.state.selectedProject.dtm_end_date : ""} onChange={(event) => { 
                                             let {selectedProject} = this.state
                                             selectedProject.dtm_end_date = event.target.value
                                             this.setState({
                                                  selectedProject: selectedProject
                                             })
                                         }}/>
                                   </InputGroup>
                              </Col>
                         </Row>
                         <Row style={{ marginTop: "10pt" }}>
                              <Col>
                                   <Button color="secondary" style={{ minWidth: "100%" }} onClick={event => { this.updateProjectData() }}>Guardar cambios</Button>
                              </Col>
                         </Row>
                    </div>
                    <Row>
                         <Col md="6">
                         <Row style={{ marginBottom: "10pt", marginTop: "10pt" }}>
                                        <Col>
                                             <Button color="success"
                                                  onClick={this.toggleModal.bind(this)} >
                                                  <IoMdAdd color="white" size="25" />
                                                  Asignar usuario</Button>
                                        </Col>
                                   </Row>
                              <ProjectUsersTable
                                   rows={[]}
                                   onDetails={this.handleUserDetails.bind(this)}
                                   onRemove={this.handleUserRemove.bind(this)}
                              />
                         </Col>
                         <Col md="6">
                              <Row style={{ marginBottom: "10pt", marginTop: "10pt" }}>
                                        <Col>
                                             <Button color="success"
                                                  onClick={this.handleShowModalTask.bind(this)} >
                                                  <IoMdAdd color="white" size="25" />
                                                  Nueva tarea</Button>
                                        </Col>
                                   </Row>
                              <ProjectTasksTable
                                   rows={this.state.projectTasksRows}
                                   onDetails={this.handleTaskDetails.bind(this)}
                                   onRemove={this.handleTaskRemove.bind(this)}
                              />
                         </Col>
                    </Row>
               </Fragment>)
     }
}