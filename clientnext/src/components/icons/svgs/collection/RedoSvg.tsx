import React from 'react'

{/* // 
<svg xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 50 50" width="250px" height="250px">     
*/}
const RedoSvg = ({className}: {
  className?:string

}) => {
  return (
    <svg fill="currentColor"  className={`size-4 ${className}`}
    viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
    <path d="M16,6,10,0V3.6S-1.08,2.86,1.59,13.78a.27.27,0,0,0,.53,0c.35-2,1.9-6,7.88-5.77v4Z"/>
    </svg>
  )
}

{/* </div> */}
export default RedoSvg