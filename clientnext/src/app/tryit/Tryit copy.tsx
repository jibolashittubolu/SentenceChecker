"use client"
import { ChangeEvent, ReactNode, SyntheticEvent, useEffect, useRef, useState } from "react"
import useDebounce from "@/hooks/useDebounce.hook"
import { axiosFunctions } from "@/utils/axios"
import { AxiosResponse } from "axios"
import { copyTextToClipboard } from "@/utils/clipboard"
import { LinearIndeterminateProgressBar } from "@/components/progress"
import { reloadPage } from "@/utils/dom"
import { debounce } from "lodash"
import { CancelSvg, GithubSvg, LinkedInSvg, RedoSvg, SettingsSvg, UndoSvg, WebsiteLinkSvg } from "@/components/icons/svgs"
import { getFirst5AndLast5Words } from "@/utils/stringManipulation"
import { ConfirmationDialog } from "@/components/dialogs"
import { FadeInDialog } from "@/components/dialogs/FadeInDialog"
import { generateRandomString } from "@/utils/random/generateRandomString"

type TypeResSentenceChecker = {
    // data: {
        data: {
            correctedText: string;
            corrections: {
                incorrect: string;
                correction: string;
                start_index: number;
                end_index: number;
            }[];
            originalText: string;
        }
        message: string,
        status: number 
        [key: string]: any
    // },
    // [key: string]: any
}

type TypeReqBodySentenceChecker= {
    text: string,
    [key: string]: any
}


type TypeError = {
    message: string,
    [key: string]: any
}

type TypeSuccess = {
    message: string,
    [key: string]: any
}

type TypeInputOrOutputCopiedLiteral = "inputValueCopied" | "outputValueCopied"
type TypeInputOrOutputValueLiteral = "inputValue" | "outputValue"
type TypeTemporaryStateFieldLiteral = "autoSaveDelay" | "sentenceCheckerApiDelay"
type TypeDialogType = "ConfirmationDialog" | "FadeInDialog"

type TypeSavedHistoryEntry = {
    id: string,
    index: number,
    text: string,
    timestamp: number
}

type TypeInitialTryitState = {
    error: TypeError,
    success: TypeSuccess,
    inputValue: string,
    inputValueHistory: {
        currentIndex: number,
        savedHistory: TypeSavedHistoryEntry[],
        // lastSavedInputValue: string
    },
    outputValue: string,
    isCheckingSentence: boolean,
    isSavingSentence: boolean,
    textCopiedStatus: {
        outputValueCopied: boolean,
        inputValueCopied: boolean
    },
    sentenceCheckerApiDelay: number,
    autoSaveDelay: number,
    // dialog: {
    //     isOpen: boolean,
    //     isModal: boolean,
    //     children: ReactNode
    // },
    dialogs: {
        confirmationDialog: {
            id: number,
            isOpen: boolean,
            isModal: boolean,
            children: ReactNode
            // children: 
        },
        fadeInDialog:{
            id: number,
            isOpen: boolean,
            isModal: boolean,
            children: ReactNode
            // children: 
        } 
    },
    temporaryStates: {
        autoSaveDelay: number,
        sentenceCheckerApiDelay: number
    }
}

type TypeTryitComponentFunctions = {
    // setOutputValue: (args: {outputValue: string}) => void,
    setInputValue: (args: {inputValue: string}) => void,
    requestSentenceCheckRemote: (args: {inputValue: string}) => Promise<any>,
    // setErrorMessage: (args: {message: string}) => void ,
    // setErrorFull: (args: TypeError) =>void ,
    // setSuccessMessage: (args: {message: string}) => void ,
    clearSuccessAndError: () => void,
    handleTextChange: (args: {event:ChangeEvent<HTMLTextAreaElement> }) => void,
    handleCopyTextToClipboard : (args: {
        text: string, 
        shouldThrowErrorOnFail?:boolean,
        name: TypeInputOrOutputCopiedLiteral,
        nameStatus: boolean
    }) => Promise<void>,
    setCurrentIndexOfInputValueHistory: (args: {newCurrentIndex: number}) => void,
    // runSentenceCheck: () => void,
    handleUndo : () => void,
    handleRedo :  () => void,
    // clearAllOldEntriesIncludingCurrent: () =>void,
    openConfirmationDialogForClearingAllOldEntriesIncludingCurrent: () =>void,
    openConfirmationDialogForSettings: () =>void,
    // setSavedHistoryInputValueHistory: (args: {savedHistory: TypeSavedHistoryEntry[]}) => void
    fetchInputHistory: () => void,
    saveDataToSessionStorage: (args: {text: string}) => void,
    handleDialog: (args: {isOpen: boolean, isModal?:boolean, whichDialog: TypeDialogType}) => void,
    // handleFadeInDialog: (args: {isOpen: boolean, isModal?:boolean}) => void,
    // handleConfirmationDialog: (args: {isOpen: boolean, isModal?:boolean}) => void,
    clearInputValue: () => void
}
const MAX_HISTORY_LENGTH: number = 5
const MAX_AUTO_SAVE_DELAY: number = 86400 * 1000 //i.e 1 day
const MIN_AUTO_SAVE_DELAY: number = 1 * 1000 //i.e 1 second
const MAX_SENTENCE_CHECKER_DELAY: number = 86400 * 1000 // 1 day
const MIN_SENTENCE_CHECKER_DELAY: number = 1 * 1000 // 1 second
// const sentenceCheckerApiDelay:number = 1000; //provide a component that allows the user to modify this
// const autoSaveDelay:number = 1000; //provide a component that allows the user to modify this

// let a = false;

const Tryit = () => {

    const [componentStates, setComponentStates] = useState<TypeInitialTryitState>({
        error: {
            message: "",
            others: {}
        },
        success: {
            message: "",
            others: {}
        },
        inputValue: "",
        inputValueHistory: {
            currentIndex: -1,
            savedHistory: [],
            // lastSavedInputValue: ""
        },
        outputValue: "",
        // isCheckingSentence: false
        isCheckingSentence: false,
        isSavingSentence: false,
        textCopiedStatus: {
            inputValueCopied: false,
            outputValueCopied: false
        },
        sentenceCheckerApiDelay: 3000,
        autoSaveDelay: 5000,
        // dialog: {
        //     isOpen: false,
        //     isModal: true,
        //     children: "This dialog has no children yet"
        //     // children: 
        // },
        dialogs: {
            confirmationDialog: {
                id: 1,
                isOpen: false,
                isModal: true,
                children: "ConfirmationDialog" as TypeDialogType 
                // children: "This dialog has no children yet. " + generateRandomString({})
                //if we generate random string here we run into hydration problems but heck no for now
                // children: 
            },
            fadeInDialog:{
                id: 2,
                isOpen: false,
                isModal: true,
                children: "FadeInDialog" as TypeDialogType
                // children: "This dialog has no children yet. " + generateRandomString({})
                // children: 
            } 
        },
        temporaryStates: {
            autoSaveDelay: 3000,
            sentenceCheckerApiDelay: 3000
        }
    })
    // const [temporaryComponentStates, setTemporaryComponentStates] = use

    // console.log(componentStates.inputValue)
    // console.log(componentStates.outputValue)
    // console.log(componentStates.inputValue.trim() === "")
    const noRetyping = {
        isCheckingSentence : 
            componentStates?.isCheckingSentence as boolean,
        isOutputValuePresent: 
            componentStates?.outputValue?.trim()?.length > 0 as boolean,
        isOutputValueCopied: 
            componentStates?.textCopiedStatus?.outputValueCopied as boolean,
        isInputValuePresent: 
            componentStates?.inputValue?.trim()?.length > 0 as boolean,
        isInputValueCopied: 
            componentStates?.textCopiedStatus?.inputValueCopied as boolean,
        isOlderHistoryEntryExists : 
            (
                componentStates?.inputValueHistory?.currentIndex > 0 && 
                componentStates?.inputValueHistory?.savedHistory?.length > 1 
            ) as boolean,
        isNewerHistoryEntryExists: 
            (componentStates?.inputValueHistory?.currentIndex < (componentStates?.inputValueHistory?.savedHistory?.length - 1) ) && componentStates?.inputValueHistory?.savedHistory?.length > 1 as boolean,
        isAnySavedHistoryEntryExists:
            componentStates?.inputValueHistory?.savedHistory?.length > 0,
        isInputBoxEmpty: 
            componentStates?.inputValue?.trim()?.length < 1 as boolean,
        isSavingSentence: 
            componentStates?.isSavingSentence as boolean,
        currrentHistoryIndex : 
            componentStates?.inputValueHistory?.currentIndex,

        isFirstMatchForHistoryEntryFound: false as boolean,
        isConfirmationDialogOpen: 
            componentStates?.dialogs?.confirmationDialog.isOpen as boolean,
        lastSavedInputValue : 
            (componentStates?.inputValueHistory?.savedHistory[componentStates?.inputValueHistory?.savedHistory?.length - 1])?.text?.trim() || "" as string
    }
    // console.log(componentStates.inputValue)
    // console.log(noRetyping.lastSavedInputValue)
    // console.log(componentStates.inputValue)
    // console.log(componentStates.outputValue)
    // console.log(componentStates.dialog.isOpen, "LINE 177")

    // console.log("temporary", componentStates.temporaryStates)
    // console.log("permanent", {autoSaveDelay:componentStates.autoSaveDelay, sentence: componentStates.sentenceCheckerApiDelay})
    // console.log('older entry exists: ', noRetyping.isOlderHistoryEntryExists )
    // console.log('newer entry exists: ', noRetyping.isNewerHistoryEntryExists )
    // console.log(componentStates.inputValueHistory)


    
    const componentFunctions = () : TypeTryitComponentFunctions => {

        const _setOutputValue = ({outputValue}: {outputValue: string}) => {
            setComponentStates(prev => ({...prev, outputValue: outputValue}))
        }

        //this will later be used for undo and redo
        //but when we call undo or redo, we must not add the current value to the sessionStorage yet
        const setInputValue = ({inputValue}: {inputValue: string}) => {
            setComponentStates(prev => ({...prev, inputValue: inputValue}))
        }

        const _setErrorMessage = ({message}: {message: string}) => {
            setComponentStates(prev => ({
                ...prev, 
                error: {
                    message: message,
                    others: prev.error.others
                }  
            }))
        }

        const _setErrorFull = ({message, others}: TypeError) => {
            setComponentStates(prev => ({
                ...prev, 
                error: {
                    message: message,
                    others: others
                }  
            }))
        }

        const _setSuccessMessage = ({message}: {message: string}) => {
            setComponentStates(prev => ({
                ...prev, 
                success: {
                    message: message,
                    others: prev.success.others
                }  
            }))
        }


        const _clearErrorFull = () => {
            setComponentStates(prev => ({
                ...prev, 
                error: {
                    message: "",
                    others: {}
                }  
            }))
        }

        const _clearSuccessFull = () => {
            setComponentStates(prev => ({
                ...prev, 
                success: {
                    message: "",
                    others: {}
                }  
            }))
        }

        const clearSuccessAndError = () => {
            _clearErrorFull()
            _clearSuccessFull()
        }

        //private
        const _setIsCheckingSentence = ({status}:{status: boolean}) => {
            setComponentStates(prev => ({...prev, isCheckingSentence:status }))

        }

        const requestSentenceCheckRemote = async ({inputValue}: {inputValue: string}) : Promise<any> => {
            try{
                if(inputValue.trim() === ""){
                    // _setErrorMessage({message: "Please fill in the input box with your text/sentence"})
                    let message : string = "Please fill in the input box with your text/sentence"

                    let htmlMessage : ReactNode 
                    htmlMessage = <div>
                        <span className="text-red-700">Issue : </span>
                        <span>{message}</span>
                    </div>
                    handleDialog({whichDialog: "FadeInDialog", isOpen: true, children: htmlMessage})

                    return 
                }

                clearSuccessAndError()
                handleDialog({whichDialog:"FadeInDialog", isOpen:false})
                _setIsCheckingSentence({status: true})



                
                const res: AxiosResponse= await axiosFunctions.axiosPost({
                    // url: "http://localhost:8000/api/v1/sentenceChecker/checkSentence",
                    body: {
                        text: inputValue
                    } as TypeReqBodySentenceChecker,

                    url: process.env.NEXT_PUBLIC_API_SENTENCE_CHECKER_URL as string

                // url: "https://jsonplaceholder.typicode.com/posts"
                //     url: "http://localhost:5000/api/procurement/vendors/getAllVendors",
                })
                // console.log(res.data)

                // console.log(res.data.data)
    
                const data: TypeResSentenceChecker = res.data
                _setOutputValue({
                    outputValue: data.data.correctedText
                });
    

                let message : string = "Output is ready"

                let htmlMessage : ReactNode 
                htmlMessage = <div>
                    <div 
                    className="
                        flex flex-row flex-wrap gap-2 mt-0.5
                        md:hidden
                    ">
                        <button 
                        className="bg-black text-white px-2 py-1 rounded"
                        onClick={()=>{
                            outputTextAreaRef?.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                            outputTextAreaRef?.current?.focus();
                            handleDialog({whichDialog: "FadeInDialog", isOpen: false})
                        }}  
                        >Jump to output box</button>
                        <button 
                        className="bg-black text-white px-2 py-1 rounded"
                        onClick={()=>{
                            // console.log(componentStates.outputValue) //output value wont be available yet. bet ?
                            handleCopyTextToClipboard({
                                text: data.data.correctedText,
                                shouldThrowErrorOnFail: true,
                                name: "outputValueCopied",
                                nameStatus: true
                            })
                            handleDialog({whichDialog: "FadeInDialog", isOpen: false})
                        }}
                        >Copy output</button>
                    </div>
                    <div className="mt-2">
                        <span className="text-green-600 ">Success : </span>
                        <span>{message}</span>
                    </div>

                </div>
                handleDialog({whichDialog: "FadeInDialog", isOpen: true, children: htmlMessage})

                return res
            }
            catch(error: any){
                console.error(error)
                // console.log('An error occurred')
                // _openDialog({whichDialog: "FadeInDialog"})
                let message: string= "An error occurred while fetching the  correct sentence from the remote server"
                const addAndShowErrorDiv = (children: ReactNode) => { 
                    return <div className="text-red-700">{children || message}</div>
                }



                _setErrorFull({
                    message,
                    others: error
                })
                handleDialog({whichDialog: "FadeInDialog", isOpen: true, children:message })

                const networkError = error?.code === "ERR_NETWORK" && error?.name==="AxiosError" && error?.message==="Network Error"
                if(networkError){
                    message = "There is an issue with your internet connection. Please check your internet connection"
                    // _setErrorMessage({
                    //     message
                    // })

                    let htmlMessage : ReactNode 
                    htmlMessage = <div>
                        <span className="text-red-700">Issue : </span>
                        <span>{message}</span>
                    </div>
                    handleDialog({whichDialog: "FadeInDialog", isOpen: true, children: htmlMessage})

                }
                throw error
            }
            finally{
                _setIsCheckingSentence({status: false})
            }
        }

        const handleDialog = ({isOpen, whichDialog, isModal, children}:{
            isOpen: boolean,
            whichDialog: TypeDialogType,
            isModal?:boolean,
            children? : ReactNode
        }) => {

            try{
                if(whichDialog === "ConfirmationDialog"){
                    setComponentStates(prev => ({
                        ...prev,
                        dialogs: {
                            ...prev.dialogs,
                            confirmationDialog :{
                                ...prev.dialogs.confirmationDialog,
                                isOpen, 
                                isModal: isModal || prev.dialogs.confirmationDialog.isModal,
                                children: children || prev.dialogs.confirmationDialog.children
                            }
                        }
                    }))
                    return 
                }
                if(whichDialog === "FadeInDialog"){
                    setComponentStates(prev => ({
                        ...prev,
                        dialogs: {
                            ...prev.dialogs,
                            fadeInDialog :{
                                ...prev.dialogs.fadeInDialog,
                                isOpen,
                                isModal: isModal || prev.dialogs.fadeInDialog.isModal,
                                children: children || prev.dialogs.fadeInDialog.children

                            }
                        }
                    }))
                    return 
                }
                
            }
            catch(error){
                console.error(error)
            }
        }

        const _openDialog = ({ whichDialog}:{
            whichDialog: TypeDialogType
        }) => {
            // a = true
            // setA(true)
            // a.current = true

            // console.log('fired _openDialog')
            try{
                if(whichDialog === "ConfirmationDialog"){
                    setComponentStates(prev => ({
                        ...prev,
                        dialogs: {
                            ...prev.dialogs,
                            confirmationDialog :{
                                ...prev.dialogs.confirmationDialog,
                                isOpen: true, 
                            }
                        }
                    }))
                    return 
                }
                if(whichDialog === "FadeInDialog"){
                    setComponentStates(prev => ({
                        ...prev,
                        dialogs: {
                            ...prev.dialogs,
                            fadeInDialog :{
                                ...prev.dialogs.fadeInDialog,
                                isOpen: true, 
                            }
                        }
                    }))
                    return 
                }
                
            }
            catch(error){
                console.error(error)
            }
        }
        
        const _closeDialog = ({ whichDialog}:{
            whichDialog: TypeDialogType
        }) => {
            // a=false;
            // setA(false)
            // a.current = false

            try{
                if(whichDialog === "ConfirmationDialog"){
                    setComponentStates(prev => ({
                        ...prev,
                        dialogs: {
                            ...prev.dialogs,
                            confirmationDialog :{
                                ...prev.dialogs.confirmationDialog,
                                isOpen: false, 
                            }
                        }
                    }))
                    return 
                }
                if(whichDialog === "FadeInDialog"){
                    setComponentStates(prev => ({
                        ...prev,
                        dialogs: {
                            ...prev.dialogs,
                            fadeInDialog :{
                                ...prev.dialogs.fadeInDialog,
                                isOpen: false, 
                            }
                        }
                    }))
                    return 
                }
                
            }
            catch(error){
                console.error(error)
            }
        }

        const _setDialogChildren = ({children, whichDialog}:{
            // isOpen?: boolean,
            // isModal?:boolean,
            children: ReactNode,
            whichDialog: TypeDialogType
        }) => {
            
            try{
                if(whichDialog === "ConfirmationDialog"){
                    setComponentStates(prev => ({
                        ...prev,
                        dialogs: {
                            ...prev.dialogs,
                            confirmationDialog :{
                                ...prev.dialogs.confirmationDialog,
                                children: children
                            }
                        }
                    }))
                    return 
                }
                if(whichDialog === "FadeInDialog"){
                    setComponentStates(prev => ({
                        ...prev,
                        dialogs: {
                            ...prev.dialogs,
                            fadeInDialog :{
                                ...prev.dialogs.fadeInDialog,
                                children: children
                            }
                        }
                    }))
                    return 
                }
                
            }
            catch(error){
                console.error(error)
            }
        }


        // Function to clear old entries
        const _clearOldestEntries = () => {
            //we keep only 5 at a time
            try {
                const existingHistory = sessionStorage.getItem('saveHistory');
                if (existingHistory) {
                    const history = JSON.parse(existingHistory) as TypeSavedHistoryEntry[];
                    // Clear storage and save the latest MAX_HISTORY_SIZE entries
                    history.splice(0, history.length - MAX_HISTORY_LENGTH);
                    sessionStorage.setItem('saveHistory', JSON.stringify(history));
                    _setSavedHistoryOfInputValueHistory({
                        savedHistory: history
                    })
                    // setSaveHistory(history);
                }
            } 
            catch (error) {
                console.error('Error clearing old entries:', error);
            }
        };

        // Function to clear all saveHistory entries
        const _clearAllOldEntriesIncludingCurrent = () => {
            //we keep only 5 at a time
            try {
                //now we dont need to check if the modal is open because for us to get here, the button to click this was actually rendered
                console.log(noRetyping.isConfirmationDialogOpen)
                //check if the modal is open for it, we can add a name prop to the modal and attach the function signature or name to it so that we can keep track of if the modal has been called e.g using console.log(clearAllOldEntriesIncludingCurrent.name) we can attach it to the modal
                //but for now, since the modal doesnt allow outside clicks we can keep it simple

                const existingHistory = sessionStorage.getItem('saveHistory');
                if (existingHistory) {
                    // sessionStorage.setItem('saveHistory', JSON.stringify([]));
                    sessionStorage.removeItem('saveHistory')
                    _setSavedHistoryOfInputValueHistory({
                        savedHistory: []
                    })
                    // setSaveHistory(history);
                }
                console.log('history cleared successfully')
            } 
            catch (error) {
                console.error('Error clearing old entries:', error);
            }
            finally{
                _closeDialog({whichDialog: "ConfirmationDialog"})
            }
        };


        const openConfirmationDialogForClearingAllOldEntriesIncludingCurrent = () => {
            try {
                // console.log(noRetyping.isDialogOpen)

                const dialogChildren:ReactNode = 
                <div className="md: flex flex-col gap-4">
                    <div onClick={()=>_closeDialog({whichDialog: "ConfirmationDialog"})}>
                        <CancelSvg  className="md: text-red-500 w-8 h-8 cursor-pointer " />
                    </div>
                    <div className="md: text-sm">This will clear all entries... proceed?</div>
                    <div className="md: flex flex-row gap-8 text-sm mt-4">
                        <button className="md: px-6 py-1.5 rounded bg-black text-white" onClick={()=>{
                            _clearAllOldEntriesIncludingCurrent(); //why does this not work ???
                            // _clearAllOldEntriesIncludingCurrent(); //while this works
                            // _closeDialog({})
                            // clearAllOldEntriesIncludingCurrent()();
                            // clearAllOldEntriesIncludingCurrent
                        }}>Yes</button>
                        <button className="md: px-6 py-1.5 rounded bg-black text-white" onClick={()=>_closeDialog({whichDialog: "ConfirmationDialog"})}>No</button>
                    </div>
                </div>
                // console.log('fired xyz')
                // console.log('dialog open 2 is: ',componentStates.dialog.isOpen)

                //if it is not open, then open it
                _openDialog({whichDialog: "ConfirmationDialog"})
                _setDialogChildren({children: dialogChildren, whichDialog: "ConfirmationDialog"})
            } 
            catch (error) {
                 console.error(error)    
            }
        }


        const _setSentenceCheckerApiDelay = ({delayDuration}:{delayDuration: number}) => {
            try{
                setComponentStates(prev => ({
                    ...prev,
                    sentenceCheckerApiDelay: delayDuration
                }))
            }
            catch(error){
                console.error(error)
            }

        }

        const _setAutoSaveDelay = ({delayDuration}:{delayDuration: number}) => {
            //directly
            try{
                setComponentStates(prev => ({
                    ...prev,
                    autoSaveDelay:delayDuration
                }))
            }
            catch(error){
                console.error(error)
            }
        }

        const _setTemporarySentenceCheckerApiDelay = ({delayDuration}:{delayDuration: string | number}) => {
            try{
                let parsedDelayDuration 
                if(typeof delayDuration === "string"){
                    // if(delayDuration === ""){
                    //     parsedDelayDuration === MIN_SENTENCE_CHECKER_DELAY
                    // }
                   parsedDelayDuration = parseFloat(delayDuration) * 1000

                    if (isNaN(parsedDelayDuration)) {
                        // console.error("Invalid duration value.");
                        // return;
                        parsedDelayDuration = MIN_SENTENCE_CHECKER_DELAY
                    }
                }
                else{
                    parsedDelayDuration = delayDuration * 1000
                }
                if(parsedDelayDuration < MIN_SENTENCE_CHECKER_DELAY ){
                    parsedDelayDuration = MIN_SENTENCE_CHECKER_DELAY
                }
                if (parsedDelayDuration > MAX_SENTENCE_CHECKER_DELAY){
                    parsedDelayDuration = MAX_SENTENCE_CHECKER_DELAY
                }
                setComponentStates(prev => ({
                    ...prev,
                    temporaryStates: {
                        ...prev.temporaryStates,
                        sentenceCheckerApiDelay: parsedDelayDuration
                    }
                }))
            }
            catch(error){
                console.error(error)
            }

        }

        const _setTemporaryAutoSaveDelay = ({delayDuration}:{delayDuration: string | number}) => {
            try{
                // console.log(typeof(delayDuration))
                let parsedDelayDuration 
                if(typeof delayDuration === "string"){
                    // console.log('Hello')
                   parsedDelayDuration = parseFloat(delayDuration) * 1000
                //    console.log(parsedDelayDuration)
                   if (isNaN(parsedDelayDuration)) {
                    // console.error("Invalid duration value.");
                    // console.log("Invalid duration value.");
                    // return;
                        parsedDelayDuration = MIN_AUTO_SAVE_DELAY
                    }
                }
                else{
                    parsedDelayDuration = delayDuration * 1000
                }
                if(parsedDelayDuration < MIN_AUTO_SAVE_DELAY ){
                    parsedDelayDuration = MIN_AUTO_SAVE_DELAY
                }
                if (parsedDelayDuration > MAX_AUTO_SAVE_DELAY){
                    parsedDelayDuration = MAX_AUTO_SAVE_DELAY
                }

                setComponentStates(prev => ({
                    ...prev,
                    temporaryStates: {
                        ...prev.temporaryStates,
                        autoSaveDelay:parsedDelayDuration
                    }
                }))
            }
            catch(error){
                console.error(error)
            }
        }

        const _handleTemporaryStateChange = ({event}: {event:ChangeEvent<HTMLInputElement>}) => {
            const name = event.target.name as TypeTemporaryStateFieldLiteral
            const {
                value
            }: {value:string} = event.target
            // console.log(value, 'value')

            if(name==="autoSaveDelay"){
                _setTemporaryAutoSaveDelay({delayDuration: value})
                return
            }

            if(name==="sentenceCheckerApiDelay"){
                _setTemporarySentenceCheckerApiDelay({delayDuration: value})
                return
            }
            
            //below means name==="outputValue"
            setComponentStates(prev => ({
                ...prev,
                temporaryStates: {
                    ...prev.temporaryStates,
                    [name]: value
                } 
            }))
            // console.log(name, value)
        }

        const openConfirmationDialogForSettings = () => {
            try {
                console.log(noRetyping.isConfirmationDialogOpen)

                const dialogChildren:ReactNode = 
                <div className="md: flex flex-col gap-4">
                    <div onClick={()=>_closeDialog({whichDialog: "ConfirmationDialog"})}>
                        <CancelSvg  className="md: text-red-500 w-8 h-8 cursor-pointer " />
                    </div>
                    <div className="md: text-sm">This will set the interval for each of the below. click save to effect the change</div>

                    <div className="md:flex flex-col gap-6">
                        <div>
                            <label>auto save every(seconds)</label>
                            <div>
                                <input 
                                type="number" 
                                placeholder="auto save interval" 
                                defaultValue={componentStates.autoSaveDelay/1000}
                                // value={componentStates.autoSaveDelay/1000}
                                // value={componentStates.autoSaveDelay}
                                name={"autoSaveDelay" as TypeTemporaryStateFieldLiteral}
                                // value={componentStates.temporaryStates.autoSaveDelay}
                                onChange={(event)=>_handleTemporaryStateChange({event}) }
                                //use temporary states in the component states
                                min={MIN_AUTO_SAVE_DELAY/1000}
                                max={MAX_AUTO_SAVE_DELAY/1000}
                                className="border-b-4 pt-2"
                                />
                            </div>
                        </div>
                        <div>
                            <label>check sentence every(seconds)</label>
                            <div>
                            <input 
                                name={"sentenceCheckerApiDelay" as TypeTemporaryStateFieldLiteral}
                                type="number" 
                                placeholder="sentence check interval" 
                                defaultValue={componentStates.sentenceCheckerApiDelay/1000}
                                // value={componentStates.temporaryStates.sentenceCheckerApiDelay}
                                onChange={(event)=>_handleTemporaryStateChange({event}) }
                                min={MIN_SENTENCE_CHECKER_DELAY/1000}
                                max={MAX_SENTENCE_CHECKER_DELAY/1000}
                                className="md: border-b-4 pt-2"
                                />
                            </div>
                        </div>
                    </div>
                    <div className="md:flex flex-row gap-8 mt-8">
                        <button 
                        className="md: px-4 py-2 bg-black text-white text-sm rounded"
                        onClick={()=>{
                            _setAutoSaveAndSentenceCheckDelay()
                            // _closeDialog({})
                            // clearAllOldEntriesIncludingCurrent()();
                            // clearAllOldEntriesIncludingCurrent
                        }}>Save</button>
                        <button className="md: px-4 py-2 bg-black text-white text-sm rounded" onClick={()=>_closeDialog({whichDialog: "ConfirmationDialog"})}>Cancel</button>
                    </div>
                </div>
                // console.log('fired xyz')
                // console.log('dialog open 2 is: ',componentStates.dialog.isOpen)

                //if it is not open, then open it
                _openDialog({whichDialog: "ConfirmationDialog"})
                _setDialogChildren({children: dialogChildren, whichDialog: "ConfirmationDialog"})
            } 
            catch (error) {
                 console.error(error)    
            }
        }

        const _setAutoSaveAndSentenceCheckDelay = () => {
            try {
                const {autoSaveDelay, sentenceCheckerApiDelay} = componentStates.temporaryStates //these are useless because they will definitely be stale
                //this wont use the recent changes or values
                //react or js will use the values as at before the function was called and will always cache that value to memory
                // so instead of doing -
                // _setAutoSaveDelay({delayDuration: autoSaveDelay})
                // we set the state we are going to from inside the state value that we want
                setComponentStates(prev => {
                    _setAutoSaveDelay({delayDuration: prev.temporaryStates.autoSaveDelay})
                    _setSentenceCheckerApiDelay({delayDuration: prev.temporaryStates.sentenceCheckerApiDelay})

                    return prev
                })
                // _setSentenceCheckerApiDelay({delayDuration: sentenceCheckerApiDelay}) //dont do this or you will use asynchronous stale data
            } 
            catch (error) {
                console.error(error)    
            }
            finally{
                _closeDialog({whichDialog: "ConfirmationDialog"})
            }
        }


        //private
        const _setIsSavingSentence = ({status}:{status: boolean}) => {
            setComponentStates(prev => ({...prev, isSavingSentence: status }))
        }

        // Function to save the input value to sessionStorage
        const saveDataToSessionStorage = ({text}:{
            text: string
        }) : void => {
            // console.log('somethings happening here 2')
            try {
                // console.log('Text is :', text)
                _setIsSavingSentence({status: true})

                //to get the last element
                //note that this will not be available on first mount because no history entry.text
                const historyEntryExists = componentStates.inputValueHistory.savedHistory.length > 0
                if(historyEntryExists){
                    const lastSavedInputValue = (componentStates.inputValueHistory.savedHistory[componentStates.inputValueHistory.savedHistory.length - 1])?.text
                    
                    //if recent saved input and current input match
                    if (text.trim() === lastSavedInputValue.trim()) {
                        console.warn('past input and current input matches. No need to save')
                        return;
                    }
                }
                // if (text.trim() === componentStates.inputValue.trim()) {
                //     console.log('past input and current input matches. No need to save')
                //     return;
                // }
                if (text.trim() === "") {
                    console.log('empty input will not be saved')
                    return;
                }

                // console.log('HEYYYY')
                const timestamp = Date.now();
                const id = timestamp.toString();
                const index = componentStates.inputValueHistory.savedHistory.length //i.e if empty it would be index 0,
                let adjustedIndex = index; //we may modify this
                const newEntry: TypeSavedHistoryEntry = { id, index, text, timestamp };

                let history : TypeSavedHistoryEntry[] =  [];
                const existingHistory = sessionStorage.getItem('saveHistory');
                if (existingHistory) {
                    history = JSON.parse(existingHistory) as TypeSavedHistoryEntry[];
                }


                history.push(newEntry);
                
                if (history.length > MAX_HISTORY_LENGTH) {
                    history = history.slice(-MAX_HISTORY_LENGTH);

                    // //rearrange the index of previous entry since we deleted 
                    // history = history.map((entry) => (
                    //     entry.index - 1
                    // )) 

                    
                    //set the index field to be based on the lenght of the array. If length is 5, index of new element should be 4
                    history = history.map((entry) => {
                        return {...entry, index: entry.index -1}
                    })
                    //since it is one addition at a time, i.e also one subtraction or pop at a time //we can adjust the index when the max size is exceeded 
                    adjustedIndex = index - 1
                }



                sessionStorage.setItem('saveHistory', JSON.stringify(history));
                _setSavedHistoryOfInputValueHistory({
                    savedHistory: history
                })

                //if we dont mess with the adjustedIndex or no

                // _setLastSavedInputValue({text: text})
                // setCurrentIndexOfInputValueHistory({newCurrentIndex: })
                
                //to account for the deletion of the oldest. If we were deleting 2 old entries, we would have incremented by 2, if 3, by +3 and so on. this is why we execute the below
                // _incrementCurrentIndexOfInputValueHistory()
                setCurrentIndexOfInputValueHistory({newCurrentIndex: adjustedIndex})
            } 
            catch (error) {
                if (error instanceof DOMException && error.name === 'QuotaExceededError') {
                    try{
                        // Handle storage quota exceeded error
                        console.warn('Storage quota exceeded. Clearing old entries.');
                        _clearOldestEntries();
                        // Retry saving after clearing old entries
                        saveDataToSessionStorage({text:text});
                    }
                    catch(err){
                        //if another error occurs, clear all entries entirely
                        console.warn('Clearing all seession storage inputs', err)
                        console.error('Error saving data:', error);
                        _clearAllOldEntriesIncludingCurrent();
                        // _setIsSavingSentence({status: false})
                        setTimeout(() => {
                            _setIsSavingSentence({status: false})
                        }, 1000);
                        return 
                    }
                } 
                //if there is still an issue, clear the whole thing or track and incremetally delete
                else {
                    console.error('Error saving data:', error);
                }
            }
            finally{
                setTimeout(() => {
                    _setIsSavingSentence({status: false})
                }, 1000);
            }
            // console.log('somethings happening here 3')

        };

        const handleTextChange = ({event}: {event:ChangeEvent<HTMLTextAreaElement>}) => {
            const name = event.target.name as TypeInputOrOutputValueLiteral
            const {
                value
            } = event.target

            if(name === "inputValue"){
                // _setIsSavingSentence({status: true})

                setComponentStates(prev => ({...prev, [name]: value}))
                // _setIsSavingSentence({status: true})

                // debounce(()=> {
                //     // console.log("Something's happening")
                //     _saveDataToSessionStorage({text: value})
                //     _setIsSavingSentence({status: false})
                // }, componentStates.autoSaveDelay)();

                // debounce(()=> {
                //     // console.log("Something's happening")
                //     _saveDataToSessionStorage({text: value})
                //     _setIsSavingSentence({status: false})
                // }, 3000)();

                
                return 
            }
            //below means name==="outputValue"
            setComponentStates(prev => ({...prev, [name]: value}))
        }




        const _setTextCopiedStatus = ({name, nameStatus}:{
            name: TypeInputOrOutputCopiedLiteral,
            nameStatus: boolean
        }) => {
            setComponentStates(prev => ({...prev, textCopiedStatus: {...prev.textCopiedStatus, [name]: nameStatus  } }))
        }


        const _handleCopyText = async ({text, shouldThrowErrorOnFail=false}:{
            text: string, 
            shouldThrowErrorOnFail?:boolean
        }) => {
            try{
                await copyTextToClipboard({
                    text,
                    shouldThrowErrorOnFail
                })
            }
            catch(error: any){
                throw error

                // _setErrorMessage({
                //     message: error?.message || "Could not copy text to clipboard"
                // })
                // if(error?.name === "CustomError"){
                //     _setErrorMessage({
                //         message: error?.message || "Could not copy text to clipboard"
                //     })
                // }
                // // console.error(error)
            }
        }

        const handleCopyTextToClipboard = async ({text, shouldThrowErrorOnFail=false, name, nameStatus }:{
            text: string, 
            shouldThrowErrorOnFail?:boolean,
            name: TypeInputOrOutputCopiedLiteral,
            nameStatus: boolean
        }) => {
            try{
                // console.log('clicked')
                await _handleCopyText({
                    text,
                    shouldThrowErrorOnFail
                })
                //set it to the received status whether true or false
                _setTextCopiedStatus({
                    name,
                    nameStatus
                })
                //revert it back to false in 1.5 seconds
                setTimeout(() => {
                    _setTextCopiedStatus({
                        name,
                        nameStatus: false
                    })
                }, 2000);
            }
            catch(error: any){


                let message : string = error?.message || "Could not copy text to clipboard"

                let htmlMessage : ReactNode 
                htmlMessage = <div>
                    <span className="text-red-700">Issue : </span>
                    <span>{message}</span>
                </div>
                handleDialog({whichDialog: "FadeInDialog", isOpen: true, children: htmlMessage})

                // _setErrorMessage({
                //     message: error?.message || "Could not copy text to clipboard"
                // })
                // if(error?.name === "CustomError"){
                //     _setErrorMessage({
                //         message: error?.message || "Could not copy text to clipboard"
                //     })
                // }
                console.error(error)
            }
        }

        const setCurrentIndexOfInputValueHistory = ({newCurrentIndex}:{
            newCurrentIndex: number
        }) => {
            setComponentStates(prev => ({
                ...prev,
                inputValueHistory: {
                    ...prev.inputValueHistory, 
                    currentIndex: newCurrentIndex
                }
             }))
        }

        //to account for the deletion of the oldest. If we were deleting 2 old entries, we would have incremented by 2, if 3, by +3 and so on
        //or to account for the new addition of 
        const _incrementCurrentIndexOfInputValueHistory = () => {
            setComponentStates(prev => ({
                ...prev,
                inputValueHistory: {
                    ...prev.inputValueHistory, 
                    currentIndex: prev.inputValueHistory.currentIndex + 1
                }
             }))
        }


        const handleUndo = () => {
            const {currentIndex, savedHistory} = componentStates.inputValueHistory
            //risk of stale values here. Rather get your values from calling setComponent state
            // e.g 
            // if (currentIndex > 0) {
            //     setComponentStates(prev => {
            //         _setCurrentIndexOfInputValueHistory({
            //             newCurrentIndex: prev.inputValueHistory.currentIndex -1
            //         })
            //         setInputValue({
            //             inputValue: prev.inputValueHistory.savedHistory[prev.inputValueHistory.currentIndex -1].text
            //         });
            //         return prev
            //     })
            // }

            if (currentIndex > 0) {
              setCurrentIndexOfInputValueHistory({
                    newCurrentIndex: currentIndex - 1
                });
              setInputValue({
                inputValue: savedHistory[currentIndex - 1].text
                });
            }
          };
        
        const handleRedo = () => {
            const {currentIndex, savedHistory} = componentStates.inputValueHistory
            //risk of stale values here. Rather get your values from calling setComponent state
            //e.g //look at redo

            if (currentIndex < savedHistory.length - 1) {
                setCurrentIndexOfInputValueHistory({
                        newCurrentIndex: currentIndex + 1
                    });
                setInputValue({
                    inputValue: savedHistory[currentIndex + 1].text
                    });
                //since we are not 
                //only handle change has access to set session storage so this is good for now, directly set input value but dont add to the session in case we are doing multiple undo and redo so that it doesnt overwrite themselves and create a history mess
            }
        };

        const _setSavedHistoryOfInputValueHistory = ({savedHistory}:{
            savedHistory: TypeSavedHistoryEntry[]
        }) =>  {
            setComponentStates(prev => ({
                ...prev,
                inputValueHistory: {
                    ...prev.inputValueHistory,
                    savedHistory: savedHistory
                }
             }))
        }

        const fetchInputHistory = () => {
            try {
                const existingInputHistory = sessionStorage.getItem('saveHistory');
                if (existingInputHistory) {
                    const history = JSON.parse(existingInputHistory) as TypeSavedHistoryEntry[];
                    //should be an array
                    _setSavedHistoryOfInputValueHistory({
                        savedHistory: history
                    })
                    
                    if (history.length > 0) {
                        // setCurrentIndex(history.length - 1);
                        setCurrentIndexOfInputValueHistory({
                            newCurrentIndex: history.length -  1
                        });
                        setInputValue({
                            inputValue: history[history.length - 1].text
                        });
                    }
                }
            } 
            catch (error) {
                console.error('Error fetching history:', error);
            }
        };


        const clearInputValue = () => {
            setComponentStates(prev => ({
                ...prev,
                inputValue: ""
            }))
        }


        return {
            // setOutputValue,
            setInputValue,
            // setErrorMessage,
            // setErrorFull,
            // setSuccessMessage,
            clearSuccessAndError,
            requestSentenceCheckRemote,
            handleTextChange,
            handleCopyTextToClipboard,
            setCurrentIndexOfInputValueHistory,
            handleUndo,
            handleRedo,
            // clearAllOldEntriesIncludingCurrent,
            openConfirmationDialogForClearingAllOldEntriesIncludingCurrent,
            openConfirmationDialogForSettings,
            // setSavedHistoryOfInputValueHistory
            fetchInputHistory,
            saveDataToSessionStorage,
            handleDialog,
            // handleConfirmationDialog,
            // handleFadeInDialog,
            clearInputValue
        }
    }


    const debouncedSaveText = useDebounce({
        callback: async () => {
            try{
                // console.log(componentStates.inputValue)
                componentFunctions().saveDataToSessionStorage({text: componentStates.inputValue})
            }
            catch(err){

            }
        },
        delay: componentStates.autoSaveDelay,
        deps: [componentStates.inputValue]
    })
    const debouncedCallSentenceCheckerApi = useDebounce({
        callback: async function() {
            try{
                await componentFunctions().requestSentenceCheckRemote({
                    inputValue: componentStates.inputValue
                });
            }
            catch(err){
                // console.log('caught debounce func called error')
            }
        }, 
        delay: componentStates.sentenceCheckerApiDelay, 
        deps: [componentStates.inputValue]
    }); // every 1 seconds max

    // to call api on input change and to save also
    useEffect(() => {


        const {isInputValuePresent} = noRetyping
        if(isInputValuePresent){
            // debounceSave()
            debouncedCallSentenceCheckerApi()
            debouncedSaveText()
        }
        if(!isInputValuePresent){
            componentFunctions().clearSuccessAndError()
        }
        // runSentenceCheck()
        
    
      return () => {
      }
    }, [componentStates.inputValue])

    const inputTextAreaRef = useRef<HTMLTextAreaElement>(null)
    const outputTextAreaRef = useRef<HTMLTextAreaElement>(null) // for jumping to after result. Dont do this automatically though
    useEffect(() => {
        // Focus the input textarea when the component mounts
        if (inputTextAreaRef.current) {
        //   inputTextAreaRef.current.focus(); //enable this before production
        }
      }, []);

    // Fetch input history when the component mounts
    useEffect(() => {
        componentFunctions().fetchInputHistory();
    }, []);


    return (

        <div 
        className="min-h-screen w-[100%] border-gray-700 flex flex-col items-center"
        // className="min-h-screen min-w-[100vw] border-gray-700 flex flex-col items-center bg-cyan-400"
        >
            <div className="
                    w-11/12 flex flex-col py-4
                    md:w-11/12 ">

                <section 
                    className="
                    border-2 border-gray-800
                    md:border-4
                    ">
                    <header>
                        <h1 
                        className="
                        text-center my-3 cursor-pointer
                        md:text-3xl md:my-6
                        "
                        aria-label="Sentence Checker "
                        aria-describedby= "This web application can be used to fix and correct mistakes in your write-up"
                        aria-details="This web application can be used to fix and correct mistakes in your write-up"
                        onClick={()=>reloadPage()}
                        >Text/SentenceChecker</h1>
                    </header>
                </section>
                {/* <section className="md: min-h-8 flex flex-col my-4 border-4 border-gray-800" >
                    <div className="md: h-full flex flex-col gap-2">
                        <p className="md: text-center text-red-600 ">
                            {componentStates.error?.message && componentStates.error.message || ""}
                        </p>
                        <p className="md: text-center text-blue-600 ">
                            {!componentStates.success?.message && componentStates.success.message || ""}
                        </p>
                    </div>
                </section> */}
                <main 
                className="
                    min-w-full flex flex-col min-h-[120vh] mt-4
                    md:flex-row md:min-h-[50vh] md:gap-4 
                " >
                    {/* input value begins */}
                    <div
                    className="flex-1 flex flex-col border border-gray-700 rounded-lg p-2 py-6 pt-4 gap-2 bg-red-950">
                        <div 
                        className="
                        w-full flex flex-col flex-wrap gap-4
                        md:flex-row md:flex-wrap md:justify-between md:items-center
                        ">
                            <span                                 
                            // className="md:basis-5/6 "
                            className="
                                flex  w-full items-center justify-center
                                md:flex-grow-0 md:w-max
                            ">
                                <span
                                className="
                                w-full flex justify-center border border-gray-300 border-opacity-40 px-4 py-1 rounded text-sm text-gray-100 
                                md:text-base
                                "
                                >Input</span>
                            </span>
                            <span 
                            className="text-gray-300 text-sm flex flex-row flex-wrap items-center justify-between 
                            md:flex md:flex-grow
                            ">
                                <button
                                disabled={!noRetyping.isInputValuePresent}
                                className={`md: font-medium ${!noRetyping.isInputValuePresent ? "text-gray-500" : ""}`}
                                onClick={()=>componentFunctions().clearInputValue()}
                                >clear</button>
                                <button
                                className={`md: ${!noRetyping.isOlderHistoryEntryExists ? "text-gray-500" : ""}`}
                                onClick={() => {componentFunctions().handleUndo()}}>
                                    <UndoSvg />
                                </button>
                                <button
                                // disabled={!noRetyping.isNewerHistoryEntryExists}
                                className={`md: ${!noRetyping.isNewerHistoryEntryExists ? "text-gray-500" : ""}`}
                                onClick={() => {componentFunctions().handleRedo()}}>
                                    <RedoSvg />
                                </button> 
                                {
                                // <>
                                noRetyping.isSavingSentence ?
                                <span className="w-10 flex items-center">...saving</span> :
                                <button
                                disabled={componentStates.inputValue === noRetyping.lastSavedInputValue || componentStates.inputValue.trim()===""}
                                className={`md:w-10 ${((componentStates.inputValue === noRetyping.lastSavedInputValue) || componentStates.inputValue.trim()==="")  ? "text-gray-500" : ""}`}
                                onClick={() => {componentFunctions().saveDataToSessionStorage({text: componentStates.inputValue})}}>
                                    save
                                </button> 
                                // </>
                                }
                                <span
                                // className="basis-1/6 cursor-pointer"
                                className={`contents cursor-pointer w-12 ${!noRetyping.isInputValuePresent ? "invisible" : ""} md:flex`}
                                onClick={()=> componentFunctions().handleCopyTextToClipboard({
                                    text: componentStates.inputValue,
                                    shouldThrowErrorOnFail: true,
                                    name: "inputValueCopied",
                                    nameStatus: true
                                })}
                                >
                                    <button
                                    // className="md: float-right font-thin text-sm underline "
                                    disabled={noRetyping.isOutputValueCopied}
                                    className={`md: float-right text-sm  text-white ${!noRetyping.isOutputValuePresent ? "" : ""}`}
                                    >
                                        {
                                        noRetyping.isOutputValueCopied ? 
                                        "copied" : 
                                        "copy"
                                        }
                                    </button>
                                </span>
                            </span>

                        </div>
                        <div
                        className="
                            flex-grow flex flex-col
                        ">
                            <textarea
                            name="inputValue"
                            ref={inputTextAreaRef}
                            onChange={(event) => componentFunctions().handleTextChange({event})}
                            className="
                                flex-grow h-full w-full rounded-lg p-3 placeholder:text-xs
                            "
                            placeholder="...type or paste the text that you want to fix here"
                            // defaultValue={"...the writeup will be displayed here after it has been fixed"}
                            value={componentStates.inputValue}
                            />
                        </div>
                    </div>
                    <div 
                    className="h-4 my-2
                                md:hidden
                    ">
                            {
                            componentStates.isCheckingSentence &&
                            <LinearIndeterminateProgressBar />
                            }
                    </div>
                    {/* output value begins */}
                    <div
                    className="flex-1 flex flex-col border border-gray-700 rounded-lg p-2 py-6 pt-4 gap-2 bg-black">
                        <div 
                        className="
                        w-full flex flex-col flex-wrap gap-4
                        md:flex-row md:flex-wrap md:justify-between md:items-center
                        "
                        >
                            <span                                 
                            // className="md:basis-5/6 "
                            className="
                                flex  w-full items-center justify-center
                                md:flex-grow-0 md:w-max
                            ">
                                <span
                                className="
                                w-full flex justify-center border border-gray-300 border-opacity-40 px-4 py-1 rounded text-sm text-gray-100 
                                "
                                >Output</span>
                            </span>
                            <span 
                            className="text-gray-300 text-sm flex flex-row flex-wrap items-center justify-between 
                            md:flex md:flex-grow
                            ">
                                {/* <button
                                disabled={!noRetyping.isInputValuePresent}
                                className={`md: font-medium ${!noRetyping.isInputValuePresent ? "text-gray-500" : ""}`}
                                onClick={()=>componentFunctions().clearInputValue()}
                                >Clear</button> */}
                                <button
                                className={`md: ${!noRetyping.isOlderHistoryEntryExists ? "text-gray-500" : ""}`}
                                onClick={() => {componentFunctions().handleUndo()}}>
                                    <UndoSvg />
                                </button>
                                <button
                                // disabled={!noRetyping.isNewerHistoryEntryExists}
                                className={`md: ${!noRetyping.isNewerHistoryEntryExists ? "text-gray-500" : ""}`}
                                onClick={() => {componentFunctions().handleRedo()}}>
                                    <RedoSvg />
                                </button> 
                                {/* {
                                // <>
                                noRetyping.isSavingSentence ?
                                <span className="w-10 flex items-center">...saving</span> :
                                <button
                                disabled={componentStates.inputValue === noRetyping.lastSavedInputValue || componentStates.inputValue.trim()===""}
                                className={`md:w-10 ${((componentStates.inputValue === noRetyping.lastSavedInputValue) || componentStates.inputValue.trim()==="")  ? "text-gray-500" : ""}`}
                                onClick={() => {componentFunctions().saveDataToSessionStorage({text: componentStates.inputValue})}}>
                                    save
                                </button> 
                                // </>
                                } */}
                                <span
                                // className="basis-1/6 cursor-pointer"
                                className={`contents cursor-pointer w-12 ${!noRetyping.isOutputValuePresent ? "invisible" : ""} md:flex`}
                                onClick={()=> componentFunctions().handleCopyTextToClipboard({
                                    text: componentStates.outputValue,
                                    shouldThrowErrorOnFail: true,
                                    name: "outputValueCopied",
                                    nameStatus: true
                                })}
                                >
                                    <button
                                    // className="md: float-right font-thin text-sm underline "
                                    disabled={noRetyping.isOutputValueCopied}
                                    className={`md: float-right text-sm  text-white ${!noRetyping.isOutputValuePresent ? "" : ""}`}
                                    >
                                        {
                                        noRetyping.isOutputValueCopied ? 
                                        "copied" : 
                                        "copy"
                                        }
                                    </button>
                                </span>
                            </span>

                        </div>
                        <div
                        className="
                            flex-grow flex flex-col
                        ">
                            <textarea
                            name="outputValue"
                            ref={outputTextAreaRef}
                            onChange={(event) => componentFunctions().handleTextChange({event})}
                            className="
                                flex-grow h-full w-full rounded-lg p-3 placeholder:text-xs
                            "
                            placeholder="...output text will be displayed here and can be edited or copied"
                            // defaultValue={"...the writeup will be displayed here after it has been fixed"}
                            value={componentStates.outputValue}
                            />
                        </div>
                    </div>
                </main>
                <section 
                className="
                    flex flex-col gap-1 mt-4 text-xs
                    md:gap-2 
                ">
                    <div>{`Sentence checker runs every ${componentStates.sentenceCheckerApiDelay/1000} second(s)`}</div>
                    <div>{`Autosave runs every ${componentStates.autoSaveDelay/1000} second(s)`}</div>
                    <div 
                    className="md: flex flex-row items-center gap-4 cursor-pointer" 
                    onClick={()=>componentFunctions().openConfirmationDialogForSettings()}>
                        <button className="underline" >
                            Change Settings 
                        </button>
                        <SettingsSvg 
                        className="md: text-red-500 w-4 h-4 cursor-pointer "/>
                    </div>
                </section>
                <section className="mt-8">
                        <div className="h-4">
                            {
                            componentStates.isCheckingSentence &&
                            <LinearIndeterminateProgressBar />
                            }
                        </div>
                </section>
                <section 
                className="flex flex-col border border-opacity-10 py-1 px-2 border-gray-800 
                            md:gap-8 md:mt-8 md:px-0
                ">

                        {/* dont do this, just change the color of the button to a disabled shade or lighter color */}
                        {/* {!componentStates.isCheckingSentence && <button>Run</button>} */}
                        <div 
                        className="order-1 flex flex-col gap-4 
                                   md:gap-8 md:flex-row md:flex-wrap 
                        " >
                            <button 
                            disabled={noRetyping.isCheckingSentence}
                            className={`
                            w-[100%] text-sm
                            bg-black text-gray-100 py-1 px-4 rounded 
                            ${!noRetyping.isInputValuePresent ? "bg-gray-400" : "md:hover:bg-blue-600 focus:bg-blue-600"}
                            md:w-28 md:text-base
                            `}
                            onClick={async()=>{
                                try{
                                    await componentFunctions().requestSentenceCheckRemote({
                                        inputValue: componentStates.inputValue
                                    })
                                }
                                catch(err){
                                    //do anything
                                }
                            }}>
                                {noRetyping.isCheckingSentence ? "...running" : "Run"}
                            </button>

                            <span 
                            className="  
                            order-3 text-sm flex flex-row flex-wrap items-center gap-8 justify-center 
                            md:order-2 md:text-sm md:flex md:flex-row md:items-center
                            ">
                                <button
                                disabled={!noRetyping.isInputValuePresent}
                                className={`md: font-medium ${!noRetyping.isInputValuePresent ? "text-gray-300" : ""}`}
                                onClick={()=>componentFunctions().clearInputValue()}
                                >clear</button>
                                <button
                                className={`md: ${!noRetyping.isOlderHistoryEntryExists ? "text-gray-300" : ""}`}
                                onClick={() => {componentFunctions().handleUndo()}}>
                                    <UndoSvg />
                                </button>
                                <button
                                // disabled={!noRetyping.isNewerHistoryEntryExists}
                                className={`md: ${!noRetyping.isNewerHistoryEntryExists ? "text-gray-300" : ""}`}
                                onClick={() => {componentFunctions().handleRedo()}}>
                                    <RedoSvg />
                                </button> 
                                {
                                noRetyping.isSavingSentence ?
                                <span className="w-10">...saving</span> :
                                <button
                                disabled={componentStates.inputValue === noRetyping.lastSavedInputValue || componentStates.inputValue.trim()===""}
                                className={`w-10 ${((componentStates.inputValue === noRetyping.lastSavedInputValue) || componentStates.inputValue.trim()==="")  ? "text-gray-300" : ""}`}
                                onClick={() => {componentFunctions().saveDataToSessionStorage({text: componentStates.inputValue})}}>
                                    save
                                </button> 
                                }
                            </span>
                            <span 
                            className="order-2 w-[100%] overflow-hidden text-sm
                                        md:order-3 md:w-max md:text-base
                            ">
                                <button 
                                className={`w-full bg-blue-500 text-gray-100 py-1 px-8 rounded ${!noRetyping.isOutputValuePresent ? "invisible" : ""}`}
                                disabled={noRetyping.isOutputValueCopied}
                                onClick={()=> componentFunctions().handleCopyTextToClipboard({
                                    text: componentStates.outputValue,
                                    shouldThrowErrorOnFail: true,
                                    name: "outputValueCopied",
                                    nameStatus: true
                                })}>
                                    {
                                    noRetyping.isOutputValueCopied ?
                                    "copied" : "Copy output"
                                    }
                                </button>
                            </span>

                            
                        </div>
                </section>
                <section 
                className="flex flex-col gap-8 mt-16 border border-opacity-50 border-gray-800 py-4
                md:mt-16
                ">
                        <div className="md: pl-5">HISTORY</div>
                </section>
                <section className="md:border md:border-opacity-50 border-gray-800 mb-4">
                    <div className="flex flex-col gap-4 py-4">
                        <div className="md:pl-5">
                            {
                            noRetyping.isAnySavedHistoryEntryExists &&
                            <div className="md: flex gap-8">
                                {/* <button 
                                className="bg-black text-gray-100 py-1 px-4 rounded" 
                                onClick={() => {componentFunctions().handleUndo()}}>
                                    Undo
                                </button>
                                <button 
                                className="bg-black text-gray-100 py-1 px-4 rounded"
                                onClick={() => {componentFunctions().handleRedo()}} >
                                    Redo
                                </button> */}
                                <button 
                                className="bg-black text-gray-100 py-1 px-4 rounded"
                                onClick={() => {componentFunctions().openConfirmationDialogForClearingAllOldEntriesIncludingCurrent()}} >
                                    Clear History
                                </button>
                            </div>
                            }   
                        </div>
                        {noRetyping.isAnySavedHistoryEntryExists ? '' : 
                        <div className="md: pl-5">No history entry exists at the moment</div>
                        }

                        {componentStates.inputValueHistory.savedHistory.reverse().map((entry:TypeSavedHistoryEntry, mapIndex) => {

                            // Check if this entry matches the condition
                            const isMatch = componentStates.inputValue === entry.text;
                            // console.log('is match', isMatch)
                            // Determine if this is the first match
                            const isFirstMatch = isMatch && !noRetyping.isFirstMatchForHistoryEntryFound;

                            // console.log("is first match",isFirstMatch)

                            // Update the matchFound flag if this entry is the first match
                            if (isFirstMatch) {
                                noRetyping.isFirstMatchForHistoryEntryFound = true;
                            }

                            // Apply the Tailwind classes conditionally
                            const additionalClassNamesForArrow = `${isFirstMatch ? "relative before:content-['\\2192'] before:absolute before:left-0 before:text-blue-500" : ""}`;
                            const additionalClassNamesForButton = `${isFirstMatch ? "relative before:content-['\\2192'] before:absolute before:left-0 before:text-blue-500" : ""}`;

                            return (
                            <div 
                            key={entry.id} 
                            className={`md:flex flex-col gap-2 list-item border border-gray-300 pl-5 ${componentStates.inputValue === entry.text ? "relative before:content-['\\2192'] before:absolute before:left-0 before:text-blue-500" : ""}`}>
                                <div className="flex gap-2 flex-wrap items-center 
                                                md:gap-4
                                ">
                                    <span 
                                    className="md: text-xs w-36 " >
                                        {new Date(entry.timestamp).toLocaleString()}
                                    </span>
                                    <span >
                                        <button 
                                        disabled={componentStates.inputValue === entry.text}
                                        className={`md: w-20 text-xs px-4 py-[2px] border-opacity-30
                                        ${ componentStates.inputValue === entry.text ? "bg-black text-white border border-gray-700 rounded" : 
                                        "bg-white text-black border border-gray-700 rounded md:hover:bg-blue-200 focus:bg-blue-200" } `}
                                        onClick={()=>{
                                            componentFunctions().setInputValue({inputValue: entry.text});
                                            componentFunctions().setCurrentIndexOfInputValueHistory({newCurrentIndex: mapIndex})
                                            inputTextAreaRef?.current?.focus()
                                            inputTextAreaRef?.current?.scrollIntoView({behavior: "smooth"})

                                            // console.log(mapIndex)
                                        }}
                                        >
                                            {componentStates.inputValue === entry.text ? "in use" : "select"}
                                        </button>
                                    </span>
                                    {/* <span>index:  {entry.index}</span> */}
                                </div>
                                <div className="my-2">
                                    <p >
                                        { getFirst5AndLast5Words({text: entry.text})}
                                    </p>
                                </div>
                            </div>
                            )
                        })}
                    </div>
                </section>
                <section>
                    <ConfirmationDialog 
                    key={String(componentStates.dialogs.confirmationDialog.id)+String(componentStates.dialogs.confirmationDialog.isOpen)}
                    // key={generateRandomString({})}
                    // key={String(componentStates.dialogs.confirmationDialog)}
                    // key={String(componentStates.dialogs.confirmationDialog.isOpen)+String(componentStates.dialogs.confirmationDialog.children)}
                    // key={"abc"}
                    isOpen={componentStates.dialogs.confirmationDialog.isOpen}
                    onClose={() => componentFunctions().handleDialog({isOpen: false, whichDialog: "ConfirmationDialog"})} 
                    showDefaultCloserButton={false}
                    // children={<p>Hello</p>}
                    >
                        {componentStates.dialogs.confirmationDialog.children}
                        {/* <p>This is a custom dialog content!</p> */}
                    </ConfirmationDialog>
                    <FadeInDialog
                    key={String(componentStates.dialogs.fadeInDialog.id)+String(componentStates.dialogs.fadeInDialog.isOpen)}
                    autoCloseAfterSeconds={60}
                    showCloseTimeSeconds={true}
                    // key={generateRandomString({})}
                    // key={Math.random()}
                    // key={String(componentStates.dialogs.fadeInDialog.isOpen)+String(componentStates.dialogs.fadeInDialog.children)}
                    isOpen={componentStates.dialogs.fadeInDialog.isOpen}
                    onClose={() => componentFunctions().handleDialog({isOpen: false, whichDialog: "FadeInDialog"})} 
                    // showDefaultCloserButton={false}
                    >
                        {componentStates.dialogs.fadeInDialog.children}
                    </FadeInDialog>
                </section>

                <footer className=" border-black border-opacity-30 py-4 text-xs
                                    md:text-sm
                ">
                    <div className="container mx-auto text-center">
                        <nav aria-label="Footer Navigation" className="mb-4">
                        <ul className="flex justify-center items-center space-x-4 gap-4 opacity-50">
                            <li>
                            <a href="https://jiboladev.com" className="hover:text-gray-400" target="_blank" rel="noopener noreferrer">
                                <WebsiteLinkSvg className="size-[1.3rem] md:size-6" />
                            </a>
                            </li>
                            <li>
                            <a href="https://www.linkedin.com/in/jibolashittubolu" className="hover:text-gray-400" target="_blank" rel="noopener noreferrer">
                                <LinkedInSvg className="size-[1.5rem] md:size-6" />
                            </a>
                            </li>
                            <li>
                            <a href="https://github.com/jibolashittubolu" className="hover:text-gray-400" target="_blank" rel="noopener noreferrer">
                                <GithubSvg className="size-5 md:size-5"/>
                            </a>
                            </li>
                        </ul>
                        </nav>
                        <p className="opacity-60" >&copy; 2024 Jibola-Shittu Moboluwarin</p>
                        <p className="opacity-60">All rights reserved.</p>
                    </div>
                </footer>



            </div>
            
        </div>
          
        
    )
}

export {Tryit}