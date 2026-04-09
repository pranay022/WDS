import { Router } from 'express';
import * as endpointController from '../Controller/endpoints.controller.js'

const router = Router();

router.post('/', endpointController.createEndpoint);
router.get('/', endpointController.getEndpoints);
router.delete('/:id', endpointController.deleteEndpoint);

export default router;