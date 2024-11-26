export interface CatBreed {
    id: string;
    name: string;
    description: string;
    weight: {
      imperial: string;
      metric: string;
    };
    life_span: string;
    origin: string;
    temperament: string;
    adaptability?: number;
    affection_level?: number;
    child_friendly?: number;
    grooming?: number;
    intelligence?: number;
    social_needs?: number;
  }
  
  export interface CatImage {
    id: string;
    url: string;
    breeds: CatBreed[];
  }