import { Request, Response } from 'express';
import GameService from '../services/game';
import { AnswerRequest } from '../interfaces/game';

export default class GameController {  
  constructor(private gameService: GameService) {}

  public async handleGetCountries(req: Request, res: Response): Promise<Response> {
    try {
      const result = await this.gameService.getCountries();
      return res.status(result.code).json({
        success: result.status === "success",
        message: result.message,
        data: result.data
      });
    } catch (error: any) {
      console.error('Error in handleGetCountries:', error);
      return res.status(500).json({ 
        success: false, 
        message: error.message || "Internal server error" 
      });
    }
  }

  /**
   * Handle get cities by country request
   */
  public async handleGetCities(req: Request, res: Response): Promise<Response> {
    try {
      const { country } = req.params;
      const result = await this.gameService.getCities(country);
      return res.status(result.code).json({ 
        success: result.status === "success", 
        message: result.message,
        data: result.data 
      });
    } catch (error: any) {
      console.error('Error in handleGetCities:', error);
      return res.status(500).json({ 
        success: false, 
        message: error.message || "Internal server error" 
      });
    }
  }

  /**
   * Handle get clue request
   */
  public async handleGetClue(req: Request, res: Response): Promise<Response> {
    try {
      const user = req.user as { id: string };
      const forceDelete = req.query.forceDelete === 'true';
      
      const result = await this.gameService.getClue(user.id, forceDelete);
      
      return res.status(result.code).json({
        success: result.status === "success",
        message: result.message,
        data: result.data,
        completedQuiz: result.completedQuiz
      });
    } catch (error: any) {
      console.error('Error in handleGetClue:', error);
      return res.status(500).json({ 
        success: false, 
        message: error.message || "Internal server error" 
      });
    }
  }

  /**
   * Handle answer submission request
   */
  public async handleGetAnswer(req: Request, res: Response): Promise<Response> {
    try {
      const user = req.user as { id: string };
      const answer = req.body as AnswerRequest;
      
      const result = await this.gameService.getAnswer(user.id, answer);
      
      return res.status(result.code).json({
        success: result.status === "success",
        message: result.message,
        correct: result.correct,
        infos: result.infos
      });
    } catch (error: any) {
      console.error('Error in handleGetAnswer:', error);
      return res.status(500).json({ 
        success: false, 
        message: error.message || "Internal server error" 
      });
    }
  }
}