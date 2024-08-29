import React from 'react'

{/* // 
<svg xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 50 50" width="250px" height="250px">     
*/}
const CancelSvg = ({className}: {
  className?:string
}) => {
  return (
    // <div>
    <svg  fill="currentColor"    className={`size-4 ${className}`}
    xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="240px" height="240px"><g><rect x="21.5" y="4.5" transform="matrix(0.7071 0.7071 -0.7071 0.7071 24 -9.9411)" fill="currentColor" width="5.001" height="39"/><rect x="21.5" y="4.5" transform="matrix(-0.7072 0.707 -0.707 -0.7072 57.9411 24.0047)" fill="currentColor" width="5" height="39.001"/></g>
    </svg>
  )
}

{/* </div> */}
export default CancelSvg