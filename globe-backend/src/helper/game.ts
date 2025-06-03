import { ClueResponse } from '../interfaces/game';

export default class GameHashmap {
  private static instance: GameHashmap;
  private map: Map<string, number[]>;
  
  private constructor() {
    this.map = new Map<string, number[]>();
  }

  /**
   * Get city and country options for clue game
   */
  private static getCityCountryOptions(
    data: any[],
    correctOption: string,
    count: number = 3
  ): string[] {
    if (data.length <= count) {
      return data.map((item) => {
        const cityName = item.city.name;
        const countryName = item.city.country.name;
        return `${cityName}, ${countryName}`;
      });
    }

    const dataCopy = [...data];
    const cityCountryOptions: string[] = [];
    const usedIndices = new Set<number>();

    while (
      cityCountryOptions.length < count &&
      usedIndices.size < dataCopy.length
    ) {
      const randomIndex = Math.floor(Math.random() * dataCopy.length);
      if (usedIndices.has(randomIndex)) continue;
      
      usedIndices.add(randomIndex);
      const randomItem = dataCopy[randomIndex];
      const cityName = randomItem.city.name;
      const countryName = randomItem.city.country.name;
      const cityCountryOption = `${cityName}, ${countryName}`;
      
      if (
        cityCountryOption === correctOption ||
        cityCountryOptions.includes(cityCountryOption)
      ) {
        continue;
      }
      
      cityCountryOptions.push(cityCountryOption);
    }
    
    return cityCountryOptions;
  }

  /**
   * Get singleton instance
   */
  public static getInstance(): GameHashmap {
    if (!GameHashmap.instance) {
      GameHashmap.instance = new GameHashmap();
    }
    return GameHashmap.instance;
  }

  /**
   * Get map
   */
  public getMap(): Map<string, number[]> {
    return this.map;
  }

  /**
   * Set clue as played for user
   */
  public setPlayed(key: string, value: number): void {
    if (this.map.has(key)) {
      const existingValues = this.map.get(key) || [];
      if (!existingValues.includes(value)) {
        existingValues.push(value);
        this.map.set(key, existingValues);
      }
    } else {
      this.map.set(key, [value]);
    }
  }

  /**
   * Get played clues for user
   */
  public getPlayed(key: string): number[] | undefined {
    return this.map.get(key);
  }

  /**
   * Delete played clues for user
   */
  public deletePlayed(key: string): boolean {
    return this.map.delete(key);
  }

  /**
   * Get random clue from data
   */
  public getRandomClue(data: any[]): ClueResponse | null {
    if (!data || data.length === 0) return null;
    
    const randomIndex = Math.floor(Math.random() * data.length);
    const randomData = data[randomIndex];
    const city = randomData.city.name;
    const country = randomData.city.country.name;
    const randomClue = randomData.clues;
    const correctOption = `${city}, ${country}`;
    const options = [correctOption];
    
    const cityCountryOptions = GameHashmap.getCityCountryOptions(
      data.filter((item) => item.id !== randomData.id),
      correctOption,
      3
    );
    
    const allOptions = [...options, ...cityCountryOptions];
    this.shuffleArray(allOptions);
    
    return {
      randomClue,
      clueId: randomData.id,
      options: allOptions,
    };
  }

   /**
   * Shuffle array
   */
  private shuffleArray(array: any[]): void {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }
}