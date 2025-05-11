import GameModel from '../models/game';
import UserModel from '../models/user';
import GameHashmap from '../helper/game';
import IStatusMap from '../interfaces/statusMap';
import { AnswerRequest } from '../interfaces/game';

const gameMap = GameHashmap.getInstance();

export default class GameService {
  /**
   * Get all countries
   */
  public async getCountries(): Promise<IStatusMap> {
    try {
      const countries = await GameModel.getCountries();
      
      if (!countries) {
        return {
          status: "error",
          message: "Countries not found",
          code: 404
        };
      }
      
      return {
        status: "success",
        message: "Countries retrieved successfully",
        code: 200,
        data: countries
      };
    } catch (error:any) {
      console.error(error);
      return {
        status: "error",
        message: error.message || "Internal server error",
        code: 500
      };
    }
  }

  /**
   * Get cities by country name
   */
  public async getCities(country: string): Promise<IStatusMap> {
    try {
      const cities = await GameModel.getCities(country);
      
      if (!cities) {
        return {
          status: "error",
          message: "Cities not found",
          code: 404
        };
      }
      
      return {
        status: "success",
        message: "Cities retrieved successfully",
        code: 200,
        data: cities
      };
    } catch (error:any) {
      console.error(error);
      return {
        status: "error",
        message: error.message || "Internal server error",
        code: 500
      };
    }
  }

  /**
   * Get a clue for the game
   */
  public async getClue(userId: string, forceDelete: boolean = false): Promise<IStatusMap> {
    try {
      if (forceDelete) {
        await gameMap.deletePlayed(userId);
      }
      
      const infos = await GameModel.getInfo();
      
      if (!infos) {
        return {
          status: "error",
          message: "Clues not found",
          code: 404
        };
      }
      
      const completedClues = (await gameMap.getPlayed(userId)) || [];
      const filteredInfos = infos.filter(
        (info:any) => !completedClues.includes(info.id)
      );
      
      if (filteredInfos.length === 0 && completedClues.length > 0) {
        return {
          status: "success",
          message: "No more clues",
          code: 200,
          data: [],
          completedQuiz: true
        };
      } else if (filteredInfos.length === 0) {
        return {
          status: "success",
          message: "No clues found",
          code: 200,
          data: [],
          completedQuiz: false
        };
      }
      
      const clues = gameMap.getRandomClue(filteredInfos);
      
      return {
        status: "success",
        message: "Clue retrieved successfully",
        code: 200,
        data: clues
      };
    } catch (error:any) {
      console.error(error);
      return {
        status: "error",
        message: error.message || "Internal server error",
        code: 500
      };
    }
  }

  /**
   * Process answer submission
   */
  public async getAnswer(userId: string, answer: AnswerRequest): Promise<IStatusMap> {
    try {
      const infos = await GameModel.getInfoById(answer.clueId);
      
      if (!infos) {
        return {
          status: "error",
          message: "Clue not found",
          code: 404
        };
      }
      
      await UserModel.updateUserScore(userId, answer.score);
      await gameMap.setPlayed(userId, answer.clueId);
      
      if (infos.city === answer.city) {
        return {
          status: "success",
          message: "Correct Answer",
          code: 200,
          correct: true,
          infos
        };
      } else {
        return {
          status: "success",
          message: "Wrong City",
          code: 200,
          correct: false,
          infos
        };
      }
    } catch (error:any) {
      console.error(error);
      return {
        status: "error",
        message: error.message || "Internal server error",
        code: 500
      };
    }
  }
}