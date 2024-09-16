export interface EmailRequest {
    toEmails: string[]; 
    subject: string;    
    body: string;       
  }
  
  export interface EmailLog {
    id: number;           
    recipients: string;   
    subject: string;     
    body: string;         
    sentAt: string;     
  }
  