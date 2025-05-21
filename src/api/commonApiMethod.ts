

export const handleRequestOtpAPI = async (requestOtp: any, email: string, errorHandling:(err:any)=>void) => {

        const userInput = {
            email: email,
        };

        try {
            const response = await requestOtp({ variables: { input: userInput } });
              console.error('handleRequestOtpAPI responce', response);
            return response
        } catch (err) {
         console.error('handleRequestOtpAPI responce', err);
            errorHandling(err?.message)
        }
}

export const handleRequestLoginOtpAPI = async (requestOtp: any, email: string, errorHandling:(err:any)=>void) => {

        const userInput = {
          // email: email,
          identifier: email
        };

        try {
            const response = await requestOtp({ variables: { input: userInput } });
              console.error('handleRequestLoginOtpAPI responce', response);
            return response
        } catch (err) {
         console.error('handleRequestLoginOtpAPI responce', err);
            errorHandling(err?.message)
        }
}

export const handleRequestSignupOtpAPI = async (requestOtp: any, email: string, errorHandling:(err:any)=>void) => {

  const userInput = {
            identifier: email
            // email: email,
        };

        try {
            const response = await requestOtp({ variables: { input: userInput } });
              console.error('handleRequestSignupOtpAPI responce', response);
            return response
        } catch (err) {
         console.error('handleRequestSignupOtpAPI responce', err);
            errorHandling(err?.message)
        }
}

export const handleOtpVerifyAPI = async (verifyOtp: any, otp:string,email: string, errorHandling: (errorMessage: any) => void) => {

        const userInput = {
          // email: email,
          identifier: email,
          otp: otp
        };


        try {
            const response = await verifyOtp({ variables: { input: userInput } });
              console.error('handleOtpVerifyAPI responce', response);
            return response
        } catch (err) {
         console.error('handleOtpVerifyAPI error', err);
            errorHandling(err?.message)
        }
}

export const handleUpdateProfileAPI = async(updateProfile:any,firstname:string,lastname:string, affiliation:number,speciality:number,title:number,customAffiliation:string,customSpeciality:string, customTitle:string,yearsOfPractice:number,errorHandling: (errorMessage: any) => void) => {

  const userInput = {

          affiliation: affiliation,
    first_name: firstname,
    last_name:lastname,
    speciality: speciality,
     title: title,
     custom_affiliation: customAffiliation,
     custom_speciality: customSpeciality,
    custom_title: customTitle,
    years_of_practice:Math.round(yearsOfPractice * 10) / 10
   };

   try {
            const response = await updateProfile({ variables: { input: userInput } });
              console.error('handleUpdateProfileAPI responce', response);
            return response
        } catch (err) {
         console.error('handleUpdateProfileAPI error', err);
            errorHandling(err?.message)
        }
}


// export const handleGetConfigAPI = async (getConfig:any) => {
//     try {
//         const response = await getConfig()
//       console.log('handleGetConfigAPIResponse', response);
//     } catch (err) {
//             console.error('handleGetConfigAPI Err:', err);
//      }

// }

export const handleGetUserDetailsAPI = async (requestUserDetails:any,userId:string) => {
    try {
      const response = await requestUserDetails({
        variables: { userId: userId }
      });
      console.log('handleGetUserDetailsAPIResponse', response);
       return response
    } catch (err) {
            console.error('handleGetUserDetailsAPI Err:', err);
     }

}