import React, { Component, Fragment, useState } from 'react'
import Table from '../../components/Table'
import ProjectDetails from './Details'
import { Button, Row, Col, Spinner, Modal, ModalHeader, ModalBody, ModalFooter, FormGroup, Label, Input } from 'reactstrap'
import store from '../../store'
import { urls } from '../../utils/routes'
import API from '../../utils/API'
import { 
     UPDATE_PROJECT_TABLE_ROWS, 
     UPDATE_PROJECTS,
     LOAD_SELECTED_PROJECT
 } from '../../action_types'
import { IoMdCreate, IoIosTrash, IoMdAdd, IoMdSave, IoIosArrowBack, IoIosClose } from "react-icons/io";


/**
 * Tabla que muestra los proyectos existentes
 * @param {*} param0 
 */
const ProjectsTable = ({ onDetails, onRemove, rows }) => {
     return (
          <Fragment>
               <Table
                    onDetails={onDetails}
                    onRemove={onRemove}
                    headers={["Título", "Descripción", "Inicio", "Tareas activas", ""]}
                    buttonLabels={[<IoMdCreate color="white" size="25" />, <IoIosTrash color="white" size="25" />]}
                    rows={rows}
               />
          </Fragment>
     )
}

/**
 * Ventana modal que muestra un formulario para crear un nuevo projecto
 * @param {*} param0 
 */
const ModalEdit = ({ toggleModal, modalIsOpen, onSave }) => {

     const [strTitle, setStrTitle] = useState("")
     const [strDescription, setStrDescription] = useState("")
     const [dtmStartDate, setDtmStartDate] = useState("")

     return (
          <div>
               <Modal isOpen={modalIsOpen} toggle={toggleModal}>
                    <ModalHeader toggle={toggleModal}>Detalles y edición</ModalHeader>
                    <ModalBody>
                         <Row>
                              <Col md="12">
                                   <FormGroup>
                                        <Label for="strTitle">Título del proyecto</Label>
                                        <Input type="text" name="strTitle" id="strTitle" value={strTitle} onChange={event => { setStrTitle(event.target.value) }} />
                                   </FormGroup>
                                   <FormGroup>
                                        <Label for="strDescription">Descripción</Label>
                                        <Input type="text" name="strDescription" id="strDescription" value={strDescription} onChange={event => { setStrDescription(event.target.value) }} />
                                   </FormGroup>
                                   <FormGroup>
                                        <Label for="dtmStartDate">Fecha de inicio</Label>
                                        <Input type="date" name="dtmStartDate" id="dtmStartDate" value={dtmStartDate} onChange={event => { setDtmStartDate(event.target.value) }} />
                                   </FormGroup>
                              </Col>
                              <Col md="12">
                                   <Button color="dark" onClick={() => {
                                        onSave(strTitle, strDescription, dtmStartDate)
                                   }}>Guardar cambios</Button>
                              </Col>
                         </Row>
                    </ModalBody>
                    <ModalFooter>
                         <Button color="secondary" onClick={toggleModal}>Cerrar</Button>
                    </ModalFooter>
               </Modal>
          </div>
     )
}

/**
 * Projects
 */
export default class MainView extends Component {
     constructor(props) {
          super(props)
          this.state = {
               showProjectDetails: false,
               loadingMsg: "",
               isLoading: true,
               projects: [],
               projectTableRows: [],
               selectedProject: {},
               modalIsOpen: false,
          }
          //store.subscribe(() => console.log('Look ma, Redux!!'))
          store.subscribe(() => {
               this.setState({
                    projects: store.getState().projects,
                    projectTableRows: store.getState().projectTableRows,
                    selectedProject: store.getState().selectedProject
               })
          })
     }

     /**
      * Permite ver los detalles
      * @param {*} dataSourceIndex El índice del data source
      */
     onDetails(dataSourceIndex) {
          let project = this.getProjectFromDataSource(dataSourceIndex)
          store.dispatch({
               type: LOAD_SELECTED_PROJECT,
               selectedProject: project
          })


          this.setState({
               showProjectDetails: true,
          })
          //alert("Ver detalles del dato con indice: " + dataSourceIndex)
     }

     /**
      * Permite eliminar el registro especificado
      * @param {*} dataSourceIndex El índice del data source
      */
     onRemove(dataSourceIndex) {
          this.removeProject(dataSourceIndex)
     }

     /**
      * Pone in mensaje y un spiner durante la carga
      * @param {*} msg Mensaje para poner bajo el spiner
      */
     handleIsLoading(msg) {
          this.setState({
               isLoading: true,
               loadingMsg: msg ? msg : "Cargando..."
          })
     }

     /**
      * Detiene el spiner
      */
     handleStopLoading() {
          this.setState({
               isLoading: false,
               loadingMsg: ""
          })
     }


     async componentDidMount() {
          this.handleIsLoading("Cargando...")
          await this.loadProjects()
          this.handleStopLoading()
     }

     /**
      * 
      */
     async loadProjects() {
          let projects = await this.getProjectsFromService()
          let projectTableRows = this.getProjectRows(projects)

          store.dispatch({
               type: UPDATE_PROJECTS,
               projects: projects
          })

          store.dispatch({
               type: UPDATE_PROJECT_TABLE_ROWS,
               projectTableRows: projectTableRows
          })
     }


     /**
      * Devuelve las filas en formato para la tabla en base a los datos de 
      * los proyectos recibidos del web service
      * @param {*} projects 
      */
     getProjectRows(projects) {
          try {
               let rows = projects.map((item, index) => {
                    return ({
                         str_title: item.str_title,
                         str_description: item.str_description,
                         dtm_start_date: item.dtm_start_date,
                         int_tasks: item.tasks.length
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
      * Obtiene los proyectos desde el API
      */
     async getProjectsFromService() {
          try {
               let projects = await API.get(urls.projects)
               if (projects.status === 200)
                    return projects.data.data
               else
                    return []
          }
          catch (err) {
               console.log(err)
               return []
          }
     }

     /**
      * Guarda un nuevo proyecto
      * @param {*} str_title 
      * @param {*} str_description 
      * @param {*} dtm_start_date 
      */
     async saveNewProject(str_title, str_description, dtm_start_date) {
          try {
               this.toggleModal()
               this.handleIsLoading("Intentando guardar")
               let newProject = await API.post(
                    urls.projects,
                    {
                         "str_title": str_title,
                         "str_description": str_description,
                         "dtm_start_date": dtm_start_date,
                    }
               )
               if (newProject.status === 201){
                    this.handleIsLoading("Actualizando datos...")
                    let projects = await this.getProjectsFromService()
                    let projectTableRows = this.getProjectRows(projects)
                    store.dispatch({
                         type: UPDATE_PROJECTS,
                         projects: projects
                    })
                    store.dispatch({
                         type: UPDATE_PROJECT_TABLE_ROWS,
                         projectTableRows: projectTableRows
                    })
                    this.handleStopLoading()
               }
               else
                    alert("No se pudo registrar el nuevo proyecto")
  
          }
          catch (err) {
               alert(err)
               console.log(err)
               this.toggleModal()
               return false
          }
     }

     /**
      * Devuelve el project según el indice
      * @param {*} index 
      */
     getProjectFromDataSource(index){
          let {projects} = this.state
          let project = projects[index]
          console.log(project)
          return project
     }

     /**
      * Desactiva un proyecto
      * @param {*} index 
      */
     async removeProject(index) {
          try {
               let project = this.getProjectFromDataSource(index)
               this.handleIsLoading("Intentando desactivar...")
               let result = await API.delete(
                    urls.projects + project.int_id
               )
               if (result.status === 202){
                    this.handleIsLoading("Actualizando datos...")
                    let projects = await this.getProjectsFromService()
                    let projectTableRows = this.getProjectRows(projects)
                    store.dispatch({
                         type: UPDATE_PROJECTS,
                         projects: projects
                    })
                    store.dispatch({
                         type: UPDATE_PROJECT_TABLE_ROWS,
                         projectTableRows: projectTableRows
                    })
                    this.handleStopLoading()
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
           * Muestra u oculta la ventana modal
           */
     toggleModal() {
          this.setState(prevState => ({
               modalIsOpen: !prevState.modalIsOpen
          }))
     }

     render() {
          return (
               <Fragment>
                    {
                         this.state.isLoading ?
                              (<Row>
                                   <Col style={{ textAlign: "center" }}>
                                        <Spinner color="primary" />
                                        <p>{this.state.loadingMsg}</p>
                                   </Col>
                              </Row>)
                              : null
                    }
                    {
                         !(this.state.showProjectDetails) ?
                              <Fragment>
                                   <Row style={{ marginBottom: "10pt" }}>
                                        <Col>
                                             <Button color="success"
                                                  onClick={this.toggleModal.bind(this)} >
                                                  <IoMdAdd color="white" size="25" />
                                                  Nuevo proyecto</Button>
                                        </Col>
                                   </Row>
                                   <ModalEdit
                                        toggleModal={this.toggleModal.bind(this)}
                                        modalIsOpen={this.state.modalIsOpen}
                                        onSave={
                                             this.saveNewProject.bind(this)
                                        }
                                   />
                              </Fragment> : null
                    }
                    {
                         (this.state.showProjectDetails) ?
                              <Row style={{ marginBottom: "10pt" }}>
                                   <Col>
                                        <Button color="dark"
                                             onClick={() => {
                                                  this.setState({
                                                       showProjectDetails: false
                                                  })
                                             }} >
                                             <IoIosArrowBack color="white" size="25" />
                                             Volver</Button>
                                   </Col>
                              </Row>
                              : null
                    }
                    {
                         !(this.state.showProjectDetails) ?
                              <ProjectsTable
                                   onDetails={this.onDetails.bind(this)}
                                   onRemove={this.onRemove.bind(this)}
                                   rows={this.state.projectTableRows}
                              />
                              : null
                    }
                    {
                         this.state.showProjectDetails ? <ProjectDetails parentContext={this} superContext={this}/> : null
                    }
               </Fragment>)
     }
}