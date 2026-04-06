import { Router } from 'express';
import * as eventsController from '../Controller/events.controller.js';

const router = Router();

router.post('/', eventsController.createEvent);

export default router;
