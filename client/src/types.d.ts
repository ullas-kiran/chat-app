
// types.d.ts

// Define a type for the email state
export type EmailType = string;

// Define a type for the password state
export type PasswordType = string;

// Define a type for confirmPassword
export type ConfirmPasswordType = string;

export interface User {
    id?: string;
    email: string;
    profileSetup: boolean;
    firstName: string;
    lastName: string;
    image?: string | null; 
    color: string;
  }
  
