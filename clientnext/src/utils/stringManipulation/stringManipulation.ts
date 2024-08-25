export const getFirst5AndLast5Words = ({text}: {text:string}) :string => {
    try{
        const words = text.trim().split(/\s+/); // Split text by spaces
        
        if (words.length <= 10) {
        // If the text has 10 or fewer words, return the entire text
        return words.join(' ');
        }
    
        const firstFiveWords = words.slice(0, 5).join(' ');
        const lastFiveWords = words.slice(-5).join(' ');
        
        return `${firstFiveWords} ... ${lastFiveWords}`;
    }
    catch(error: any){
        console.error("an error occurred with parsing text", error)
        return text
    }
  }