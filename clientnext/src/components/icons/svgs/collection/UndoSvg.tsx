import React from 'react'

{/* // 
<svg xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 50 50" width="250px" height="250px">     
*/}
const UndoSvg = ({className}: {
  className?:string

}) => {
  return (
    <svg  fill="currentColor" className={`w-4 h-4 ${className}`} viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
    <path  d="M6,3.6V0L0,6l6,6V8c6-.27,7.53,3.76,7.88,5.77a.27.27,0,0,0,.53,0C17.08,2.86,6,3.6,6,3.6Z"/>
    </svg>
  )
}

{/* </div> */}
export default UndoSvg