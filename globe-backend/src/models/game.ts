import prisma from '../db';
import { AnswerResponse } from '../interfaces/game';

export default class GameModel {
  /**
   * Get all countries
   */
  public static async getCountries() {
    try {
      const countries = await prisma.country.findMany({
        orderBy: { name: 'asc' }
      });
      
      return countries;
    } catch (error) {
      console.error('Error in getCountries:', error);
      return null;
    }
  }

  /**
   * Get cities by country name
   */
  public static async getCities(country: string) {
    try {
      const countryData = await prisma.country.findUnique({
        where: { name: country },
        include: { cities: true }
      });
      
      return countryData?.cities || null;
    } catch (error) {
      console.error('Error in getCities:', error);
      return null;
    }
  }

  /**
   * Get all info with country and city relations
   */
  public static async getInfo() {
    try {
      const info = await prisma.info.findMany({
        include: {
          country: true,
          city: true
        }
      });
      
      return info;
    } catch (error) {
      console.error('Error in getInfo:', error);
      return null;
    }
  }

  /**
   * Get info by ID with country and city relations
   */
  public static async getInfoById(id: number): Promise<AnswerResponse | null> {
    try {
      const info = await prisma.info.findUnique({
        where: { id },
        include: {
          country: true,
          city: true
        }
      });
      
      if (!info) {
        return null;
      }

      const destinationData: AnswerResponse = {
        country: info.country.name,
        city: info.city.name,
        fun_fact: info.fun_fact,
        trivia: info.trivia,
        clues: info.clues
      };
      
      return destinationData;
    } catch (error) {
      console.error('Error in getInfoById:', error);
      return null;
    }
  }
}