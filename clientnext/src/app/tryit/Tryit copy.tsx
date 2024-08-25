"use client"
import { ChangeEvent, SyntheticEvent, useEffect, useRef, useState } from "react"
import useDebounce from "@/hooks/useDebounce.hook"
import { axiosFunctions } from "@/utils/axios"
import { AxiosResponse } from "axios"
import { copyTextToClipboard } from "@/utils/clipboard"
import { LinearIndeterminateProgressBar } from "@/components/progress"
import { reloadPage } from "@/utils/dom"
import { debounce } from "lodash"

type TypeResSentenceChecker = {
    data: {
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
    },
    [key: string]: any
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

type TypeSavedHistoryEntry = {
    id: string,
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
        lastSavedInputValue: string
    },
    outputValue: string,
    isCheckingSentence: boolean,
    textCopiedStatus: {
        outputValueCopied: boolean,
        inputValueCopied: boolean
    },
    sentenceCheckerApiDelay: number,
    autoSaveDelay: number
}

type TypeTryitComponentFunctions = {
    // setOutputValue: (args: {outputValue: string}) => void,
    // setInputValue: (args: {inputValue: string}) => void,
    requestSentenceCheckRemote: (args: {inputValue: string}) => Promise<any>,
    // setErrorMessage: (args: {message: string}) => void ,
    // setErrorFull: (args: TypeError) =>void ,
    // setSuccessMessage: (args: {message: string}) => void ,
    clearSuccessAndError: () => void,
    handleTextChange: (args: {event:ChangeEvent<HTMLTextAreaElement> }) => void
    handleCopyTextToClipboard : (args: {
        text: string, 
        shouldThrowErrorOnFail?:boolean,
        name: TypeInputOrOutputCopiedLiteral,
        nameStatus: boolean
    }) => Promise<void>,
    // runSentenceCheck: () => void,
    handleUndo : () => void,
    handleRedo :  () => void,
    // setSavedHistoryInputValueHistory: (args: {savedHistory: TypeSavedHistoryEntry[]}) => void
    fetchInputHistory: () => void

}
const MAX_HISTORY_LENGTH: number = 5
// const sentenceCheckerApiDelay:number = 1000; //provide a component that allows the user to modify this
// const autoSaveDelay:number = 1000; //provide a component that allows the user to modify this

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
            lastSavedInputValue: ""
        },
        outputValue: "",
        // isCheckingSentence: false
        isCheckingSentence: false,
        textCopiedStatus: {
            inputValueCopied: false,
            outputValueCopied: false
        },
        sentenceCheckerApiDelay: 3000,
        autoSaveDelay: 3000

    })
    console.log(componentStates.inputValue)
    console.log(componentStates.outputValue)


    const componentFunctions = () : TypeTryitComponentFunctions => {

        const _setOutputValue = ({outputValue}: {outputValue: string}) => {
            setComponentStates(prev => ({...prev, outputValue: outputValue}))
        }

        //this will later be used for undo and redo
        //but when we call undo or redo, we must not add the current value to the sessionStorage yet
        const _setInputValue = ({inputValue}: {inputValue: string}) => {
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
                clearSuccessAndError()
                _setIsCheckingSentence({status: true})

                const res: AxiosResponse = await axiosFunctions.axiosPost({
                    // url: "http://localhost:8000/api/v1/sentenceChecker/checkSentence",
                    body: {
                        text: componentStates.inputValue
                    } as TypeReqBodySentenceChecker,

                    url: process.env.NEXT_PUBLIC_API_SENTENCE_CHECKER_URL as string

                // url: "https://jsonplaceholder.typicode.com/posts"
                //     url: "http://localhost:5000/api/procurement/vendors/getAllVendors",
                })
                // console.log(res.data)

                console.log(res)
    
                _setOutputValue({
                    outputValue: res.data.correctedText
                });
    

                return res
            }
            catch(error: any){
                console.error(error)
                // console.log('An error occurred')

                _setErrorFull({
                    message: "An error occurred while fetching the  correct sentence from the remote server",
                    others: error
                })
                const networkError = error?.code === "ERR_NETWORK" && error?.name==="AxiosError" && error?.message==="Network Error"
                if(networkError){
                    _setErrorMessage({
                        message: "There is an issue with your internet connection. Kindly refresh the page or refresh your internet connection"
                    })
                }
                throw error
            }
            finally{
                _setIsCheckingSentence({status: false})
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
                const existingHistory = sessionStorage.getItem('saveHistory');
                if (existingHistory) {
                    sessionStorage.setItem('saveHistory', JSON.stringify([]));
                    
                    _setSavedHistoryOfInputValueHistory({
                        savedHistory: []
                    })
                    // setSaveHistory(history);
                }
            } 
            catch (error) {
                console.error('Error clearing old entries:', error);
            }
        };

        const _setLastSavedInputValue = ({text}:{
            text: string
        }) => {
            setComponentStates(prev => ({
                ...prev,
                inputValueHistory: {
                    ...prev.inputValueHistory,
                    lastSavedInputValue: text
                }
                }))
        }

        // Function to save the input value to sessionStorage
        const _saveDataToSessionStorage = ({text}:{
            text: string
        }) => {
            try {
                //if recent saved input and current input match
                if (text === componentStates.inputValueHistory.lastSavedInputValue) {
                    console.log('past input and current input matches. No need to save')
                    return;
                }
                if (text.trim() === "") {
                    console.log('empty input will not be saved')
                    return;
                }

                const timestamp = Date.now();
                const id = timestamp.toString();
                const newEntry: TypeSavedHistoryEntry = { id, text, timestamp };

                let history : TypeSavedHistoryEntry[] =  [];
                const existingHistory = sessionStorage.getItem('saveHistory');
                if (existingHistory) {
                    history = JSON.parse(existingHistory) as TypeSavedHistoryEntry[];
                }

                history.push(newEntry);
                
                if (history.length > MAX_HISTORY_LENGTH) {
                    history = history.slice(-MAX_HISTORY_LENGTH);
                }

                sessionStorage.setItem('saveHistory', JSON.stringify(history));
                _setSavedHistoryOfInputValueHistory({
                    savedHistory: history
                })
                _setLastSavedInputValue({text: text})
            } 
            catch (error) {
                if (error instanceof DOMException && error.name === 'QuotaExceededError') {
                    try{
                        // Handle storage quota exceeded error
                        console.warn('Storage quota exceeded. Clearing old entries.');
                        _clearOldestEntries();
                        // Retry saving after clearing old entries
                        _saveDataToSessionStorage({text:text});
                    }
                    catch(err){
                        //if another error occurs, clear all entries entirely
                        console.warn('Clearing all seession storage inputs', err)
                        console.error('Error saving data:', error);
                        _clearAllOldEntriesIncludingCurrent();
                        return ''
                    }
                } 
                //if there is still an issue, clear the whole thing or track and incremetally delete
                else {
                    console.error('Error saving data:', error);
                }
            }
        };

        //save the data to Session after 1000 seconds
        // const _debouncedSave = debounce(_saveDataToSessionStorage, 1000);
                
        const handleTextChange = ({event}: {event:ChangeEvent<HTMLTextAreaElement>}) => {
            const name = event.target.name as TypeInputOrOutputValueLiteral
            const {
                value
            } = event.target

            if(name === "inputValue"){
                setComponentStates(prev => ({...prev, [name]: value}))

                // _saveDataToSessionStorage({text: value})

                // debounce(()=> {
                //     _saveDataToSessionStorage({text: value})
                // }, componentStates.autoSaveDelay); 

                debounce(()=> {
                    _saveDataToSessionStorage({text: value})
                }, 1000);
                
                // setTimeout(()=>{
                // //     _saveDataToSessionStorage({text: value})
                // }, 5000)

                return ''
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
                _setErrorMessage({
                    message: error?.message || "Could not copy text to clipboard"
                })
                if(error?.name === "CustomError"){
                    _setErrorMessage({
                        message: error?.message || "Could not copy text to clipboard"
                    })
                }
                // console.error(error)
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
                }, 1500);
            }
            catch(error: any){
                _setErrorMessage({
                    message: error?.message || "Could not copy text to clipboard"
                })
                if(error?.name === "CustomError"){
                    _setErrorMessage({
                        message: error?.message || "Could not copy text to clipboard"
                    })
                }
                // console.error(error)
            }
        }

        const _setCurrentIndexInputValueHistory = ({newCurrentIndex}:{
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


        const handleUndo = () => {
            const {currentIndex, savedHistory} = componentStates.inputValueHistory

            if (currentIndex > 0) {
              _setCurrentIndexInputValueHistory({
                    newCurrentIndex: currentIndex - 1
                });
              _setInputValue({
                inputValue: savedHistory[currentIndex - 1].text
                });
            }
          };
        
        const handleRedo = () => {
            const {currentIndex, savedHistory} = componentStates.inputValueHistory

            if (currentIndex < savedHistory.length - 1) {
                _setCurrentIndexInputValueHistory({
                        newCurrentIndex: currentIndex + 1
                    });
                _setInputValue({
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
                        _setCurrentIndexInputValueHistory({
                            newCurrentIndex: history.length -  1
                        });
                        _setInputValue({
                            inputValue: history[history.length - 1].text
                        });
                    }
                }
            } 
            catch (error) {
                console.error('Error fetching history:', error);
            }
        };









        return {
            // setOutputValue,
            // setInputValue,
            // setErrorMessage,
            // setErrorFull,
            // setSuccessMessage,
            clearSuccessAndError,
            requestSentenceCheckRemote,
            handleTextChange,
            handleCopyTextToClipboard,
            handleUndo,
            handleRedo,
            // _setSavedHistoryOfInputValueHistory
            fetchInputHistory
        }
    }


    
    const debounceSave = useDebounce({
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

    // to call api on input change
    useEffect(() => {

        const callSentenceCheckerApi = async () => {
            try{
                await componentFunctions().requestSentenceCheckRemote({
                    inputValue: componentStates.inputValue
                });
            }
            catch(err){
                // console.log('caught debounce func called error')
            }
        }
        const debouncedCallSentenceCheckerApi = debounce(callSentenceCheckerApi, componentStates.sentenceCheckerApiDelay)

        const isInputBoxEmpty = componentStates.inputValue.trim().length < 1 
        if(!isInputBoxEmpty){
            // debounceSave()
            debouncedCallSentenceCheckerApi()
        }
        if(isInputBoxEmpty){
            componentFunctions().clearSuccessAndError()
        }
        // runSentenceCheck()
        
    
      return () => {
      }
    }, [componentStates.inputValue])

    // Focus the textarea when the component mounts
    const inputTextAreaRef = useRef<HTMLTextAreaElement>(null)
    useEffect(() => {
        if (inputTextAreaRef.current) {
          inputTextAreaRef.current.focus();
        }
      }, []);

    useEffect(() => {
        componentFunctions().fetchInputHistory();
    }, []);


    const noRetyping = {
        isCheckingSentence : componentStates.isCheckingSentence as boolean,
        outputValuePresent: componentStates.outputValue.trim().length > 0 as boolean,
        outputValueCopied: componentStates.textCopiedStatus.outputValueCopied as boolean,
        inputValuePresent: componentStates.inputValue.trim().length > 0 as boolean,
        inputValueCopied: componentStates.textCopiedStatus.inputValueCopied as boolean,
        olderHistoryEntryExists : (componentStates.inputValueHistory.currentIndex > 0 ) as boolean,
        newerHistoryEntryExists: (componentStates.inputValueHistory.currentIndex < (componentStates.inputValueHistory.savedHistory.length - 1) ) as boolean,

    }





    return (

        <div className="md:min-w-full min-h-screen border-4 border-gray-700  flex flex-col items-center">
            <div className="md:w-11/12 ">

                <section>
                    <header>
                        <h1 
                        aria-label="Sentence Checker "
                        aria-describedby= "This web application can be used to fix and correct mistakes in your write-up"
                        aria-details="This web application can be used to fix and correct mistakes in your write-up"
                        className="md:text-center my-6 text-4xl cursor-pointer"
                        onClick={()=>reloadPage()}
                        >SentenceChecker</h1>
                    </header>
                </section>
                <section className="md: min-h-8 flex flex-col my-4" >
                    <div className="md: h-full flex flex-col gap-2">
                        <p className="md: text-center text-red-600 ">
                            {componentStates.error?.message && componentStates.error.message || "aim"}
                        </p>
                        <p className="md: text-center text-blue-600 ">
                            {!componentStates.success?.message && componentStates.success.message || "abe"}
                        </p>
                    </div>
                </section>
                <main className="md:min-w-full gap-4 flex flex-row min-h-[50vh]" >
                    <div
                    className="md: basis-2/4 flex flex-col border border-gray-700 rounded-lg p-2 py-6 gap-2">
                        <div 
                        className="md: w-full flex flex-row justify-between h-auto ">
                            <span                                 
                            className="md:basis-5/6 "
                            >
                                <span
                                className="md: border border-blue-400 px-4 py-1 rounded text-sm"
                                >Output</span>
                            </span>
                            <span
                            className="basis-1/6 cursor-pointer"
                            onClick={()=> componentFunctions().handleCopyTextToClipboard({
                                text: componentStates.outputValue,
                                shouldThrowErrorOnFail: true,
                                name: "outputValueCopied",
                                nameStatus: true
                            })}
                            >
                                <button
                                // className="md: float-right font-thin text-sm underline "
                                disabled={componentStates.textCopiedStatus.outputValueCopied}
                                className={`md: float-right font-thin text-sm underline ${!noRetyping.outputValuePresent ? "hidden" : ""}`}
                                >
                                    {
                                    noRetyping.outputValueCopied ? 
                                    "copied" : 
                                    "copy"
                                    }
                                </button>
                            </span>
                        </div>
                        <div
                        className="md: h-max grow">
                            <textarea
                            ref={inputTextAreaRef}
                            name="inputValue"
                            onChange={(event) => componentFunctions().handleTextChange({event})}
                            className="md: h-full w-full rounded-lg p-3"
                            // defaultValue={"...the writeup will be displayed here after it has been fixed"}
                            value={componentStates.inputValue}
                            />
                        </div>
                    </div>
                    <div
                    className="md: basis-2/4 flex flex-col border border-gray-700 rounded-lg p-2 py-6 pt-4 gap-2 bg-black">
                        <div 
                        className="md: w-full flex flex-row justify-between h-auto ">
                            <span                                 
                            className="md:basis-5/6 "
                            >
                                <span
                                className="md: border border-gray-300 px-4 py-1 rounded text-sm text-gray-100"
                                >Output</span>
                            </span>
                            <span
                            className="basis-1/6 cursor-pointer"
                            onClick={()=> componentFunctions().handleCopyTextToClipboard({
                                text: componentStates.outputValue,
                                shouldThrowErrorOnFail: true,
                                name: "outputValueCopied",
                                nameStatus: true
                            })}
                            >
                                <button
                                // className="md: float-right font-thin text-sm underline "
                                disabled={componentStates.textCopiedStatus.outputValueCopied}
                                className={`md: float-right font-thin text-sm  text-gray-100 ${!noRetyping.outputValuePresent ? "hidden" : ""}`}
                                >
                                    {
                                    noRetyping.outputValueCopied ? 
                                    "copied" : 
                                    "copy"
                                    }
                                </button>
                            </span>
                        </div>
                        <div
                        className="md: h-max grow">
                            <textarea
                            name="outputValue"
                            onChange={(event) => componentFunctions().handleTextChange({event})}
                            className="md: h-full w-full rounded-lg p-3 placeholder:text-sm"
                            placeholder="...output text will be displayed here and can be edited or copied"
                            // defaultValue={"...the writeup will be displayed here after it has been fixed"}
                            value={componentStates.outputValue}
                            />
                        </div>
                    </div>
                </main>
                <aside
                    // className="md: basis-1/5 border"
                    className="md: border flex flex-col gap-8 mt-16"
                    >
                        <div className="md: h-4">
                            {
                            componentStates.isCheckingSentence &&
                            <LinearIndeterminateProgressBar />
                            }
                        </div>

                        {/* dont do this, just change the color of the button to a disabled shade or lighter color */}
                        {/* {!componentStates.isCheckingSentence && <button>Run</button>} */}
                        <div className="md: flex gap-8">
                            <button className="bg-black text-gray-100 py-1 px-4 rounded" >
                                Run again
                            </button>
                            <button className="bg-black text-gray-100 py-1 px-4 rounded" >
                                Copy output
                            </button>
                        </div>
                </aside>
                <aside
                    // className="md: basis-1/5 border"
                    className="md: border flex flex-col gap-8 mt-16"
                    >

                        {/* dont do this, just change the color of the button to a disabled shade or lighter color */}
                        {/* {!componentStates.isCheckingSentence && <button>Run</button>} */}
                        <div className="md: flex gap-8">
                            <button 
                            className="bg-black text-gray-100 py-1 px-4 rounded" 
                            onClick={() => {componentFunctions().handleUndo()}}>
                                Undo
                            </button>
                            <button 
                            className="bg-black text-gray-100 py-1 px-4 rounded"
                            onClick={() => {componentFunctions().handleRedo()}} >
                                Redo
                            </button>
                        </div>
                </aside>
                <section>
                    <ul>
                    {componentStates.inputValueHistory.savedHistory.map(entry => (
                        <li key={entry.id}>
                            {new Date(entry.timestamp).toLocaleString()}: {entry.text}
                        </li>
                    ))}
                    </ul>
                </section>

            </div>
            
        </div>
          
        
    )
}

export {Tryit}