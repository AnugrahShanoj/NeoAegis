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
// export const smsAPI=async(reqBody,reqHeader)=>{
//    return await commonAPI('post',`${serverUrl}/sms/request`,reqBody,reqHeader)
// }

// 10 API call for add a safety check-in
export const addSafetyCheckinAPI=async(reqBody,reqHeader)=>{
   return await commonAPI('post',`${serverUrl}/addSafetyCheckin`,reqBody,reqHeader)
}

// 11 API call for get all safety checkins
export const getSafetyCheckins=async(reqHeader)=>{
   return await commonAPI('get',`${serverUrl}/getSafetyCheckins`,"",reqHeader)
}

// 12 API call for edit a safety checkin 
export const editSafetyCheckinAPI= async(checkinId,reqBody,reqHeader)=>{
   return await commonAPI('put',`${serverUrl}/editSafetyCheckin/${checkinId}`,reqBody,reqHeader)
}

// 13 API call for check now
export const checkNowAPI=async(checkinId,reqHeader)=>{
   return await commonAPI('patch',`${serverUrl}/checkNow/${checkinId}`,"",reqHeader)
}

// 14 Route for handling delete of a safety checkin
export const deleteSafetyCheckinAPI=async(checkinId,reqHeader)=>{
   return await commonAPI('delete',`${serverUrl}/deleteSafetyCheckin/${checkinId}`,"",reqHeader)
}

// 15 Route for handling a new SOS Alert
export const createSOSAlertAPI= async(reqBody,reqHeader)=>{
   return await commonAPI('post',`${serverUrl}/SOSAlert`,reqBody,reqHeader)
}


// 16 Route for handling get SOS Alerts
export const getSOSAlertsAPI= async(reqHeader)=>{
   return await commonAPI('get',`${serverUrl}/getSOSAlerts`,"",reqHeader)
}

// 17 Route for handling update User Profile
export const updateProfileAPI= async(reqBody,reqHeader)=>{
   return await commonAPI('put',`${serverUrl}/editUserProfile`,reqBody,reqHeader)
}

// 18 Route for handling get user details
export const getUserDetailsAPI= async(reqHeader)=>{
   return await commonAPI('get',`${serverUrl}/getUserDetails`,"",reqHeader)
}

// 19 Route for handling email breach check
export const emailBreachAPI= async(emailAddress, reqHeader)=>{
   return await commonAPI('get', `${serverUrl}/emailBreach?email=${emailAddress}`,"",reqHeader)
}

// 20 API call for resolving active SOS alert
export const resolveSOSAlertAPI = async (reqHeader) => {
  return await commonAPI('patch', `${serverUrl}/resolveSOSAlert`, "", reqHeader)
}

// 21 Send test alert email to selected emergency contacts
export const sendTestAlertAPI = async (reqBody, reqHeader) => {
  return await commonAPI('post', `${serverUrl}/sendTestAlert`, reqBody, reqHeader);
};