import { useLayoutEffect, useEffect, useRef, useState } from 'react'

export interface InterfaceUseAddOrRemoveDarkClassToHtml {
    colorScheme: TypeLightOrDarkLiteralString,
    updateColorScheme: (newScheme: TypeLightOrDarkLiteralString) => void,
    // toggleColorScheme: () => void,
}

export type TypeLightOrDarkLiteralString = "light" | "dark"
const useAddOrRemoveDarkClassToHtml = () : InterfaceUseAddOrRemoveDarkClassToHtml =>  {

    // const [colorScheme, setColorScheme] = useState<TypeLightOrDarkLiteralString>("dark");
    const [colorScheme, setColorScheme] = useState<TypeLightOrDarkLiteralString>(() => {
        const storedScheme = localStorage.getItem('color-scheme') as TypeLightOrDarkLiteralString;
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        //done to prevent FOUC
        if(prefersDark){
            document.documentElement.classList.add('dark');
        }
        if(storedScheme === "light"){
            document.documentElement.classList.remove('dark')
        }
        if(storedScheme === "dark"){
            document.documentElement.classList.add('dark');
        }
        return storedScheme || (prefersDark ? 'dark' : 'light');
    });



    // //this is done before the use layout effect to prevent FOUC
    // if ((localStorage.getItem('color-scheme') === 'dark' )|| (!('color-scheme' in localStorage) || window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    //     document.documentElement.classList.add('dark');
    //     localStorage.setItem('color-scheme', "dark");
    //     console.log('fired firasj')
    // } 
    // else {
    //     document.documentElement.classList.remove('dark')
    //     localStorage.setItem('color-scheme', "light");
    //     console.log('fired firasj 222')

    // }

    useLayoutEffect(() => {

        const addOrRemoveDarkClassToHtml = () => {
            try{
                if ((localStorage.getItem('color-scheme') === 'dark' )|| (!('color-scheme' in localStorage) || window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                    document.documentElement.classList.add('dark');
                    localStorage.setItem('color-scheme', "dark");
                    setColorScheme('dark');

                    return
                } 
                else {
                    document.documentElement.classList.remove('dark')
                    localStorage.setItem('color-scheme', "light");
                    setColorScheme('light');

                }
            }
            catch(error: any){
                console.error(error)
            }
        }
        addOrRemoveDarkClassToHtml()
    }, [colorScheme])



      // Update the color scheme and localStorage
    const updateColorScheme = (newScheme: TypeLightOrDarkLiteralString) => {
        setColorScheme(newScheme);
        // localStorage.setItem('color-scheme', newScheme);
    };
    

    return {
        // colorScheme: colorScheme.current
        colorScheme,
        updateColorScheme,
        // toggleColorScheme
    }
}

export default useAddOrRemoveDarkClassToHtml