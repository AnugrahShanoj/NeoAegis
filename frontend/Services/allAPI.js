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
   return await commonAPI('post',`${serverUrl}/login`,reqBody,"")
}

// 5 API call for adding a new emergency contact
export const addEmergencyContactAPI=async(reqBody,reqHeader)=>{
   return await commonAPI('post',`${serverUrl}/addEmergencyContact`,reqBody,reqHeader)
}

// 6 API call for get emergency contacts of the user
export const getEmergencyContactAPI=async(reqHeader)=>{
   return await commonAPI('get',`${serverUrl}/getEmergencyContact`,"",reqHeader)
}

// 7 API call for delete an emergency contact
export const deleteEmergencyContactAPI=async(contactId,reqHeader)=>{
   return await commonAPI('delete',`${serverUrl}/deleteEmergencyContact/${contactId}`,"",reqHeader)
}

// 8 API Call for edit an emergency contact
export const editEmergencyContactAPI= async(contactId,reqBody,reqHeader)=>{
   return await commonAPI('put',`${serverUrl}/editEmergencyContact/${contactId}`,reqBody,reqHeader)
}


// 9 API call for test alert to emergency contacts
export const testAlertAPI=async(reqBody,reqHeader)=>{
   return await commonAPI('post',`${serverUrl}/sms/request`,reqBody,reqHeader)
}