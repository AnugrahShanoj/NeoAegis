// Import serverUrl, commonAPI
import { serverUrl } from "./serverURL";
import { commonAPI } from "./commonAPI";


// 1 API call for register 
export const registerAPI= async(reqBody)=>{
   return await commonAPI('post',`${serverUrl}/register`,reqBody,"")
}
// 2 API call for payment initiate
export const createPaymentAPI= async(reqBody)=>{
   return await commonAPI('post',`${serverUrl}/payment/createOrder`,reqBody,"")
}
// 3 API call for payment verification
export const verifyPaymentAPI= async(reqBody)=>{
   return await commonAPI('post',`${serverUrl}/payment/verifyPayment`,reqBody,"")
}
// 4 API call for login
export const loginAPI=async(reqBody)=>{
   return await commonAPI('post',`${serverUrl}/register`,reqBody,"")
}