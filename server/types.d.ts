export interface AuthBody {
    email: string;
    password: string;
  }
  
export interface TokenPayload {
    email: string;
    userId: string;
  }  

export  interface SignupResponse {
  user: {
      id: string;
      email: string;
      firstName?: string | null;
      lastName?: string | null;
      image?: string | null;
      profileSetup?: boolean | null;
      color?:number|null;
  };
}

export interface LoginResponse extends SignupResponse {
  // Add any extra properties specific to LoginResponse if needed
}

