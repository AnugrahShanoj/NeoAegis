// import axios
import axios from 'axios'

// Configure the axios
export const commonAPI=async(httpMethod,url,reqBody,reqHeader)=>{
    const reqConfig={
        httpMethod:httpMethod,
        url:url,
        body:reqBody,
        headers:reqHeader?reqHeader:{
            'Content-Type':'application/json',
        }
    }
    return await axios(reqConfig).then(response=>{
        return response
    })
    .catch(error=>{
        return error
    })
}