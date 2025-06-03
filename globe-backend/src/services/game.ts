import prisma from '../db';
import GameHashmap from '../helper/game';
import IStatusMap from '../interfaces/statusMap';
import { AnswerRequest } from '../interfaces/game';

const gameMap = GameHashmap.getInstance();

/**
 * Get all countries
 */
export async function getCountries(): Promise<IStatusMap> {
  try {
    const countries = await prisma.country.findMany({
      include: {
        cities: true
      }
    });
    
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
export async function getCities(country: string): Promise<IStatusMap> {
  try {
    const cities = await prisma.city.findMany({
      where: {
        country: {
          name: country
        }
      }
    });
    
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
export async function getClue(userId: string, forceDelete: boolean = false): Promise<IStatusMap> {
  try {
    if (forceDelete) {
      await gameMap.deletePlayed(userId);
    }
    
    const infos = await prisma.info.findMany({
      include: {
        city: {
          include: {
            country: true
          }
        }
      }
    });
    
    if (!infos) {
      return {
        status: "error",
        message: "Clues not found",
        code: 404
      };
    }
    
    const completedClues = (await gameMap.getPlayed(userId)) || [];
    const filteredInfos = infos.filter(
      (info) => !completedClues.includes(info.id)
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
export async function getAnswer(userId: string, answer: AnswerRequest): Promise<IStatusMap> {
  try {
    const infos = await prisma.info.findUnique({
      where: { id: answer.clueId },
      include: {
        city: {
          include: {
            country: true
          }
        }
      }
    });
    
    if (!infos) {
      return {
        status: "error",
        message: "Clue not found",
        code: 404
      };
    }

    const temp = infos.city.name === answer.city ? 1 :0;
    await prisma.user.update({
      where: { id: userId },
      data: {
        maxScore: {
          increment: temp
        }
      }
    });
    await gameMap.setPlayed(userId, answer.clueId);
    
    if (infos.city.name === answer.city) {
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