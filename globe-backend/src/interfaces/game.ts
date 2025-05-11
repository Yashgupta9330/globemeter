export interface CountryType {
  id?: number;
  name: string;
  cities?: CityType[];
}

export interface CityType {
  id?: number;
  name: string;
  country?: CountryType;
  countryId?: number;
  info?: InfoType;
}

export interface InfoType {
  id?: number;
  clues: string[];
  fun_fact: string[];
  trivia: string[];
  country?: CountryType;
  countryId?: number;
  city?: CityType;
  cityId?: number;
}

export interface ClueResponse {
  randomClue: string[];
  clueId: number;
  options: string[];
}

export interface AnswerRequest {
  clueId: number;
  city: string;
  score: number;
}

export interface AnswerResponse {
  country: string;
  city: string;
  fun_fact: string[];
  trivia: string[];
  clues: string[];
}
