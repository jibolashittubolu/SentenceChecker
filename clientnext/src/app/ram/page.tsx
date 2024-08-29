"use client"
import { ConfirmationDialog } from "@/components/dialogs"
import { useState, useCallback, ReactNode } from "react"

const Blank = () => {

  const [available, setAvailable] = useState<boolean>(false)
  const [dialogOpen, setDialogOpen] = useState<boolean>(false)
  const [dialogChildren, setDialogChildren] = useState<ReactNode>("Base dialog")
  const [ram, setRam] = useState<boolean>(false)
  // const [available, setAvailable] = useState<boolean>(false)
  // const [available, setAvailable] = useState<boolean>(false)

  // const cs = useCallback(() => {
  const cs = () => {

    const changeDisplay = () => {
      try{
          if(!available){
            console.log(available)
            setAvailable(true)
            return
          }

          console.log("got here, is true")
          setAvailable(false)

      }
      catch(err: any){
        console.error(err)
      }
    }



    // const setDialogChild = (children: ReactNode) =>{
    //   setDialogChildren
    // }

    return {
      changeDisplay,
      // handleDialog,
      // handleAdvancedDialog
    }
  }
  // }, [available])

  const runShii = (currentStatus: boolean) => {
    // console.log(dialogOpen)
    console.log(currentStatus)


  }



  const handleCheckStatus = () => {
    // Ensure dialogOpen is updated before calling runShii
    setDialogOpen(prevState => {
      runShii(prevState); // This will log the state before the update
      return prevState; // Return the previous state, or modify if needed
    });
  };

  const dialogChildr:ReactNode =  
  <div>
      <div>This will clear all entries... Proceed?</div>
      <button className="px-3 bg-gray-600" 
      // onClick={()=>{ setTimeout(runShii, 1000) }} 
      // onClick={()=>runShii(dialogOpen)}
      // onClick={handleCheckStatus}
      onClick={()=>handleCheckStatus()}
      // onClick={()=>handleAdvancedDialog()} 
      > Yes</button>
      <button className="px-3 bg-gray-600" onClick={()=>setDialogOpen(false)}>No</button>
  </div>

  const handleAdvancedDialog = () => {
    if(true){
      console.log(dialogOpen)

      setDialogChildren(dialogChildr)
      setDialogOpen(true)
    }

  }

  // console.log(dialogOpen)
  
  return (
    <div>
        <p>{available ? "i am available" : "unavailable"}</p>
        <button onClick={()=>cs().changeDisplay()}>Check Availability</button>
        {
          available &&
          <button onClick={()=>cs().changeDisplay()}>Yes</button>
        }
        <section>
          <button 
          onClick={()=>setDialogOpen(true)}
          className="border border-gray-600 px-3">Open dialog</button>
                    <button 
          onClick={()=>handleAdvancedDialog()}
          // onClick={()=>cs().handleAdvancedDialog()}
          className="border border-gray-600 px-3">Open Advanced</button>
        </section>
        <section>
            <ConfirmationDialog
            key={"constant"}
            isOpen={dialogOpen}
            onClose={() => setDialogOpen(false)} 
            showDefaultCloserButton={true}
            // children={<p>Hello</p>}
            >
                {dialogChildren}
                {/* <p>This is a custom dialog content!</p> */}
            </ConfirmationDialog>
        </section>


    </div>
  )
}

export default Blank