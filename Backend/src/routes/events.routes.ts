import { Router } from 'express';
import * as eventsController from '../Controller/events.controller.js';

const router = Router();

router.post('/', eventsController.createEvent);
router.post('/:id/retry', eventsController.retryEvent);
router.post('/:id/cancel', eventsController.cancelEvent);
router.get('/', eventsController.getEvents); // Also adding getEvents to help dashboard

export default router;
