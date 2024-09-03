import React, { useEffect, useState } from 'react'
import useAddOrRemoveDarkClassToHtml, {InterfaceUseAddOrRemoveDarkClassToHtml, TypeLightOrDarkLiteralString} from '../../hooks/useAddOrRemoveDarkClassToHtml.hook'
import { CrescentMoonSvg, SunSvg } from '../icons/svgs';


const DarkModeToggler = () => {
    const {colorScheme, updateColorScheme } = useAddOrRemoveDarkClassToHtml() as  InterfaceUseAddOrRemoveDarkClassToHtml
    // const {colorScheme } = useAddOrRemoveDarkClassToHtml() as  InterfaceUseAddOrRemoveDarkClassToHtml
    // const [currentColorScheme, setCurrentColorScheme] = useState<TypeLightOrDarkLiteralString>(colorScheme) //just for state so the icons change

    // console.log("from hook", colorScheme)
    // console.log("current color scheme", currentColorScheme)

    const toggleColorSchemePlusLocalStoragePlusHtml = () => {
        try{
            // if set via local storage previously
            if (localStorage.getItem('color-scheme')) {
                const localStorageColorScheme = localStorage.getItem('color-scheme') as TypeLightOrDarkLiteralString 

                if (localStorageColorScheme === 'light') {
                    // add dark
                    document.documentElement.classList.add('dark');
                    localStorage.setItem('color-scheme', 'dark');
                    updateColorScheme("dark")

                } 
                else {
                    //if it is dark //remove the dark. We dont need to add light
                    document.documentElement.classList.remove('dark');
                    localStorage.setItem('color-scheme', 'light');
                    updateColorScheme("light")

                }

            // if NOT set via local storage previously
            } 
            else {
                if (document.documentElement.classList.contains('dark')) {
                    //if it is dark //remove the dark. We dont need to add light
                    document.documentElement.classList.remove('dark');
                    localStorage.setItem('color-scheme', 'light');
                    updateColorScheme("light")

                } 
                else {
                    //you know we dont usually set light so if we dont find dark, add dark
                    document.documentElement.classList.add('dark');
                    localStorage.setItem('color-scheme', 'dark');
                    updateColorScheme("dark")

                }
            }
        }
        catch(error){
            console.error(error)
        }
            
    }
// console.log(colorScheme)
    const toggleColorScheme = () => {
        try{
            // return
            // if set via local storage previously
            if (localStorage.getItem('color-scheme')) {
                const localStorageColorScheme = localStorage.getItem('color-scheme') as TypeLightOrDarkLiteralString 

                if (localStorageColorScheme === 'light') {
                    // add dark
                    // document.documentElement.classList.add('dark');
                    // localStorage.setItem('color-scheme', 'dark');
                    updateColorScheme("dark")

                } 
                else {
                    //if it is dark //remove the dark. We dont need to add light
                    // document.documentElement.classList.remove('dark');
                    // localStorage.setItem('color-scheme', 'light');
                    updateColorScheme("light")

                }

            // if NOT set via local storage previously
            } 
            //i.e if we dont have it in ls
            else{
                if (document.documentElement.classList.contains('dark')) {
                    //if it is dark //remove the dark. We dont need to add light
                    // document.documentElement.classList.remove('dark');
                    // localStorage.setItem('color-scheme', 'light');
                    updateColorScheme("light")
                    return

                } 
                else {
                    //you know we dont usually set light so if we dont find dark, add dark
                    // document.documentElement.classList.add('dark');
                    // localStorage.setItem('color-scheme', 'dark');
                    updateColorScheme("dark")
                    return

                }
            }
        }
        catch(error){
            console.error(error)
        }
            
    }

  return (

    // <button onClick={toggleColorSchemePlusLocalStoragePlusHtml}>
    <button onClick={toggleColorScheme}>
        { 
        // currentColorScheme === "light" ?
        colorScheme === "light" ?
        <CrescentMoonSvg className="size-[1.1rem] md:size-[2rem] text-gray-900"/> :
        <SunSvg className="size-[1.1rem] md:size-[2rem] text-gray-200"/>
        }
    </button>
  )
}

export default DarkModeToggler

