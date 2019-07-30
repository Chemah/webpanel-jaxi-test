import React, { Fragment } from 'react';
import {
     Table,
     Button,
} from 'reactstrap';

/**
 * Tabla de boostrap
 * @param {*} props { headers: array, rows: array of objects, onDetails: function, onRemove: function, buttonLabels: array }
 */
function CustomTable({ headers, rows, onDetails, onRemove, buttonLabels }) {
     /**
      * Devuelve las cabeceras de las columnas
      */
     const getColumns = () => {
          let ths = headers.map((item, index) => { return <th key={index.toString()}>{item}</th> })
          return (<tr>{ths}</tr>)
     }

     /**
      * Devuelve las filas de la tabla
      */
     const getRows = () => {
          let trs = []//filas de la tabla
          for (let i = 0; i < rows.length; i++) {//por cada objeto del array de objetos
               let currentRow = rows[i]
               let fields = []
               Object.keys(currentRow).forEach((key, index) => {//iterar sobre las propiedades del objeto
                    let field = (<td key={index.toString()}>{currentRow[key]}</td>)//extrar la propiedad del objeto para armar los campos
                    fields.push(field)
               })
               fields.push(<td key="buttons"> <Button color="dark" onClick={() => { onDetails(i) }} >{buttonLabels[0]}</Button> <Button color="danger" onClick={() => { onRemove(i) }}>{buttonLabels[1]}</Button> </td>)
               trs.push(<tr key={i.toString()}>{fields}</tr>)
          }
          return trs
     }

     return (
          <Fragment>
               <div style={
                    {
                         background: "linear-gradient(90deg, rgba(0,31,36,1) 0%, rgba(9,105,121,1) 35%, rgba(0,212,255,1) 100%)",
                         minHeight: "10pt",
                         borderRadius: "5pt 5pt 0pt 0pt"
                    }
               }></div>
               <Table style={
                    {
                         background: "rgba(255,255,255, 0.5)"
                    }
               }>
                    <thead>
                         {getColumns()}
                    </thead>
                    <tbody>
                         {getRows()}
                    </tbody>
               </Table>
          </Fragment>
     )
}

export default CustomTable