import { resendClient, sender } from "../lib/resend.email.js";
import { createWelcomeEmail } from "./email.template.js";


export const sendWelcomeEmails = async(email,name,clientURL)=>{
const { data, error } = await resendClient.emails.send({
    from: `${sender.name} <${sender.email}>`,
    to:email,
    subject: 'Welcome to We-Chat',
    html: createWelcomeEmail(name,clientURL),
  });


  if(error){
    console.error("Error sending emails");
    throw new Error("failed to send an email");
  }

  console.log("Email sent successfully" , data); 

}