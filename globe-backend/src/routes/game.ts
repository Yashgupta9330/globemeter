import { Router } from 'express';
import { handleGetCountries, handleGetCities, handleGetClue, handleGetAnswer } from '../controllers/game';
import { authenticate } from '../middleware/auth';

const GameRoutes = Router();

GameRoutes.get("/countries", authenticate, async (req, res) => {
    await handleGetCountries(req, res);
});

GameRoutes.get('/cities/:country', async (req, res) => {
    await handleGetCities(req, res);
});

GameRoutes.get('/clue', authenticate, async (req, res) => {
    await handleGetClue(req, res);
});

GameRoutes.post('/answer', authenticate, async (req, res) => {
    await handleGetAnswer(req, res);
});

GameRoutes.get('/reset', authenticate, async (req, res) => {
    req.query.forceDelete = 'true';
    await handleGetClue(req, res);
});

export default GameRoutes;
