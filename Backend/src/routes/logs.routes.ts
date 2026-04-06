import { Router } from 'express';
import * as logsController from '../Controller/logs.controller.js';

const router = Router();

router.get('/', logsController.getLogs);
router.get('/:eventId', logsController.getLogsByEventId);

export default router;

