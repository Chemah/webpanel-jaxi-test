import React, { Component, Fragment } from 'react'
import Table from '../../components/Table'
import ProjectDetails from './Details'
import { Button, Row, Col, Spinner } from 'reactstrap'
import { IoMdCreate, IoIosTrash, IoMdAdd, IoMdSave, IoIosArrowBack } from "react-icons/io";
import store from '../../store'
import {urls}  from '../../utils/routes'
import API from '../../utils/API'
import {UPDATE_PROJECT_TABLE_ROWS, UPDATE_PROJECTS} from '../../action_types'

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
                    buttonLabels={[<IoMdCreate color="white" size="25"/>, <IoIosTrash color="white" size="25"/>]}
                    rows={rows}
               />
          </Fragment>
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
               selectedProject: {}
          }
          //store.subscribe(() => console.log('Look ma, Redux!!'))
          store.subscribe( () => {
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
          alert("Eliminar dato con indice: " + dataSourceIndex)
     }

     /**
      * Pone in mensaje y un spiner durante la carga
      * @param {*} msg Mensaje para poner bajo el spiner
      */
     handleIsLoading(msg){
          this.setState({
               isLoading: true,
               loadingMsg: msg ? msg : "Cargando..."
          })
     }

     /**
      * Detiene el spiner
      */
     handleStopLoading(){
          this.setState({
               isLoading: false,
               loadingMsg: ""
          })
     }


     async componentDidMount(){
          this.handleIsLoading("Cargando...")
          await this.loadProjects()
          this.handleStopLoading()
     }

     /**
      * 
      */
     async loadProjects(){
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
     getProjectRows(projects){
          try{
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
          catch(err){
               console.log(err)
               return []
          }
     }

     /**
      * Obtiene los proyectos desde el API
      */
     async getProjectsFromService(){
          try{
               let projects = await API.get(urls.projects)
               if(projects.status === 200)
                    return projects.data.data
               else
                    return []
          }
          catch(err){
               console.log(err)
               return []
          }
     }



     render() {
          return (
               <Fragment>
                    {
                         this.state.isLoading ?
                         (<Row>
                              <Col style={{textAlign: "center"}}>
                                   <Spinner color="primary" /> 
                                   <p>{this.state.loadingMsg}</p>
                              </Col>
                         </Row>)
                         : null
                    }
                    {
                         (this.state.showProjectDetails) ?
                         <Row style={{marginBottom: "10pt"}}>
                              <Col>
                                   <Button color="dark"
                                        onClick={() => {
                                             this.setState({
                                                  showProjectDetails: false
                                             })
                                        }} >
                                             <IoIosArrowBack color="white" size="25"/>
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
                         this.state.showProjectDetails ? <ProjectDetails /> : null
                    }
               </Fragment>)
     }
}