import { 
     UPDATE_PROJECTS,
     UPDATE_PROJECT_TABLE_ROWS,
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
               projecs: action.projects
               }
     }
     if (action.type === UPDATE_PROJECT_TABLE_ROWS) {
          return  {
               ...state, 
               projectTableRows: action.projectTableRows
               }
     }
     return state;
}

export default rootReducer;