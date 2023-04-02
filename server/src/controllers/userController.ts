import { NextFunction, Request, Response, Router } from 'express';
import { createPlayer, deletePlayer, getUsers, updatePlayer } from '../services/player.service';

const router = Router()


/**
 * @route {GET} /players
 * @queryparam offset : number of players dismissed from the first one
 * @queryparam limit : number of articles returned
 * @queryparam id
 * @queryparam username
 * @queryparam A1Id
 * @queryparam score : more than t
 * @returns players: list of users*
 */
router.get('/users', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await getUsers(req.query);
      res.json(result);
    } catch (error) {
      next(error);
    }
  });


/**
 * @route {POST} /players
 * @bodyparam full_name
 * @bodyparam country_code
 * @bodyparam birth_date
 * @bodyparam gender
 * 
 */
  router.post('/players', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await createPlayer(req.body.player, "aleks");
      res.json(result);
    } catch (error) {
      next(error);
    }
  });

  /**
 * @route {PUT} /players
 * @param id
 * @bodyparam name
 * @bodyparam coundry_code
 * @bodyparam gender
 * @bodyparam birth_date
 */
   router.put('/players/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await updatePlayer(req.body.player, Number(req.params.id), "aleks");
      res.json(result);
    } catch (error) {
      next(error);
    }
  });

/**
 * Delete player
 * @route delete
 * @route {DELETE} /player/:id
 */
 router.delete(
  '/players/:id',  async (req: Request, res: Response, next: NextFunction) => {
    console.log("delete")
    try {
      await deletePlayer(Number(req.params.id));
      res.sendStatus(204);
    } catch (error) {
      next(error);
    }
  },
);  
  export default router;

