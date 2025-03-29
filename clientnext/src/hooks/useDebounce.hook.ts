import { useCallback, useEffect } from "react"

// debounce function (defaults wait to .2 seconds)
const debounce = ({func, wait = 0}: {
    func: Function,
    wait: number
}) : any => {
    let timeout: ReturnType<typeof setTimeout>; // for the setTimeout function and so it can be cleared
    function executedFunction(...args: any[]) { // the function returned from debounce
        const later = () => { // this is the delayed function
            clearTimeout(timeout); // clears the timeout when the function is called
            func(...args); // calls the function
        };
        clearTimeout(timeout); // this clears the timeout each time the function is run again preventing later from running until we stop calling the function
        timeout = setTimeout(later, wait); // this sets the time out to run after the wait period
    };
    executedFunction.cancel = function() { // so can be cancelled
        clearTimeout(timeout); // clears the timeout
    };
    return executedFunction;
};

// hook for using the debounce function
function useDebounce({callback, delay = 0, deps = []}:  {
    callback: Function,
    delay: number,
    deps: any[]
}): any {
    // debounce the callback
    const debouncedCallback = useCallback(
        debounce({
            func: callback,
            wait: delay
        }),
        [delay, ...deps]
    )
 // with the delay
    // clean up on unmount or dependency change
    useEffect(() => {
        return () => {
            debouncedCallback.cancel(); // cancel any pending calls
        }
    }, [delay, ...deps]);
    // return the debounce function so we can use it
    return debouncedCallback;
};

export default useDebounce;


// const debounceChanges = useDebounce(function(newChanges) {
//     setChanges(complexFunction(newChanges));
// }, 500, []); // every .5 seconds max

// const debounceSave = useDebounce(function() {
//     handleSave();
// }, 10 * 1000, [id]); // every 10 seconds max
