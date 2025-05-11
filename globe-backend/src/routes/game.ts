import { Router } from 'express';
import GameController from '../controllers/game';
import { authenticate } from '../middleware/auth';
import GameService from '../services/game'; 

const GameRoutes = Router();
const gameService = new GameService();
const gameController = new GameController(gameService);

GameRoutes.get("/countries", authenticate, (req, res) => {
    gameController.handleGetCountries(req, res);
});

GameRoutes.get('/cities/:country', (req, res) => {
    gameController.handleGetCities(req, res);
});

GameRoutes.get('/clue', authenticate, (req, res) => {
    gameController.handleGetClue(req, res);
});

GameRoutes.post('/answer', authenticate, (req, res) => {
    gameController.handleGetAnswer(req, res);
});

GameRoutes.get('/reset', authenticate, (req, res) => {
    req.query.forceDelete = 'true';
    gameController.handleGetClue(req, res);
});

export default GameRoutes;
