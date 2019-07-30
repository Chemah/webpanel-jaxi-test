import axios from "axios"
import {baseServiceURL} from './routes'

export default axios.create({
  baseURL: baseServiceURL,
  responseType: "json"
});