import axios, { AxiosRequestConfig } from "axios"


class AxiosFunctions {
    public axiosPost = async ({url, body, options}: {
        url: string,
        body: any,
        options?: AxiosRequestConfig
    }) => {
        try {
            const res = await axios.post(url, body, options)
            return res
        } 
        catch (error) {
            // console.error(error); 
            throw error;
        }
    }


    public axiosGet = async ({url, options}: {
        url: string, 
        options?:any
    }) => {
        try{
          const res = await axios.get(url);
          return res;
        }
        catch(error){
            // console.error(error);
            throw error;
        }
    };

}

export const axiosFunctions = new AxiosFunctions()
// const axiosFunctions = new AxiosFunctions()
// export default axiosFunctions
