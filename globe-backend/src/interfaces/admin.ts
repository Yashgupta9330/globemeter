export interface InfoData {
    country: string;
    city: string;
    clues: string[];
    fun_fact: string[];
    trivia: string[];
  }
  
  export interface InfoResult {
    country: {
      id: number;
      name: string;
    };
    city: {
      id: number;
      name: string;
    };
    info: {
      id: number;
      clues: string[];
      fun_fact: string[];
      trivia: string[];
    };
  }
  
  export interface StatusResponse {
    status: string;
    message: string;
    code: number;
    data?: any;
  }
  