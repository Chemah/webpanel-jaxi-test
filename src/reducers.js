import { 
     UPDATE_PROJECTS,
     UPDATE_PROJECT_TABLE_ROWS,
     LOAD_SELECTED_PROJECT,
     UPDATE_PROJECT_TASKS_TABLE_ROWS,
 } from "./action_types";
/**
 * 
 */
const initialState = {
     projects: [],
     projectTableRows: [],
     selectedProject: {}
}

/**
 * 
 * @param {*} state 
 * @param {*} action 
 */
function rootReducer(state = initialState, action) {
     if (action.type === UPDATE_PROJECTS) {
          return  {
               ...state, 
               projects: action.projects
               }
     }
     if (action.type === UPDATE_PROJECT_TABLE_ROWS) {
          return  {
               ...state, 
               projectTableRows: action.projectTableRows
               }
     }
     if (action.type === LOAD_SELECTED_PROJECT) {
          return  {
               ...state, 
               selectedProject: action.selectedProject
               }
     }
     if (action.type === UPDATE_PROJECT_TASKS_TABLE_ROWS) {
          return  {
               ...state, 
               projectTasksRows: action.projectTasksRows
               }
     }
     return state;
}

export default rootReducer;