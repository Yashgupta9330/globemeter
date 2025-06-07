import { Request, Response } from 'express';
import { getCountries, getCities, getClue, getAnswer } from '../services/game';
import { AnswerRequest } from '../interfaces/game';

export async function handleGetCountries(req: Request, res: Response): Promise<Response> {
  try {
    const result = await getCountries();
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
export async function handleGetCities(req: Request, res: Response): Promise<Response> {
  try {
    const { country } = req.params;
    const result = await getCities(country);
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
export async function handleGetClue(req: Request, res: Response): Promise<Response> {
  try {
    const user = req.user as { id: string };
    const forceDelete = req.query.forceDelete === 'true';
    
    const result = await getClue(user.id, forceDelete);
    
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
export async function handleGetAnswer(req: Request, res: Response): Promise<Response> {
  try {
    const user = req.user as { id: string };
    const answer = req.body as AnswerRequest;
    
    const result = await getAnswer(user.id, answer);
    
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


export async function handleGetOptions(req: Request, res: Response): Promise<Response> {
  try {
    const user = req.user as { id: string };
    const answer = req.body as any;
    let show50 : any[] = [];
    let options = answer.options;
    const clueId = answer.clueId;
    let score = 0;
    let result: any;
    while(show50.length < 2){ 
     for(let index1 = 0; index1<options.length; index1++){
      let select = options[index1];
      const [city, country] = select.split(", ");
      result = await getAnswer(user.id, {
        clueId: clueId,
        city,
        score
      });
      console.log("result", result)
      if(!(result.correct)){
        show50.push(index1);
        if(show50.length == 2) break;
      }
    }
  }
    console.log("show50", show50);
    options = options.filter((_:any,index:any) => !show50.includes(index));
    return res.status(200).json({
      success: true,
      message: "Options retrevied",
      options: options,
    });
  } catch (error: any) {
    console.error('Error in handleGetAnswer:', error);
    return res.status(500).json({ 
      success: false, 
      message: error.message || "Internal server error" 
    });
  }
}