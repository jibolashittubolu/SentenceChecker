import { CustomError } from "../errorHandling";

// const copyTextToClipboard = async ({text, shouldThrowErrorOnFail=false}: {
//     text: string,
//     shouldThrowErrorOnFail: boolean
// }) => {

//     try {
//         // navigator.permissions.query({ name: "write-on-clipboard" }).then((result) => {
//         navigator.permissions.query("write-on-clipboard").then((result) => {
//             const canCopy = result.state == "granted" || result.state == "prompt"
//             if (!canCopy) {
//                 throw new CustomError({
//                     message: "Failed to copy. This site was unable to get sufficient permissions from your browser/system",
//                 })
//             }
//         });
        
//         await navigator.clipboard.writeText(text);
//         console.log('Content copied to clipboard');
//       } 
//     catch (err: any) {
//         console.error('Failed to copy: ', err);
//         if(shouldThrowErrorOnFail){
//             // throw new CustomError({
//             //     message: "Failed to copy",
//             //     others: err
//             // })
//             throw err
//         }
//     }

// }

const copyTextToClipboard = async ({text, shouldThrowErrorOnFail=false}:{
    text: string, 
    shouldThrowErrorOnFail?:boolean
}): Promise<void> => {
    try {
        // throw new Error(
        //     "Failed to copy. This site was unable to get sufficient permissions from your browser/system",
        // )
                //         throw new CustomError({
                //     message: "Failed to copy. This site was unable to get sufficient permissions from your browser/system",
                // })
        if (navigator.clipboard) {
            // Modern way using the Clipboard API
            await navigator.clipboard.writeText(text);
            // console.log("Text copied to clipboard successfully!");
        } 
        else {
            // Fallback for older browsers
            const textArea = document.createElement("textarea");
            textArea.value = text;

            // Make the textarea invisible and non-interactive
            textArea.style.opacity = "0";
            textArea.style.pointerEvents = "none";
            textArea.style.width = "0";
            textArea.style.height = "0";
            textArea.style.position = "absolute"; // Ensures it's out of normal layout flow

            document.body.appendChild(textArea);

            textArea.select();
            document.execCommand("copy");
            // console.log("Text copied to clipboard successfully!");

            document.body.removeChild(textArea);
        }
    } catch (err) {
        console.error("An error occurred while copying text to clipboard:", err);
        // console.error(JSON.stringify(err))
        // console.error(JSON.parse(err as string))
        throw err

        if(shouldThrowErrorOnFail){
            // throw new CustomError({
            //     message: "Failed to copy",
            //     others: err
            // })
            throw err
        }
        
    }
}



export {copyTextToClipboard}
