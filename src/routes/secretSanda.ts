import express from 'express';
import { getSecretSantaAssignments, postSecretSantaAssignments } from '../controllers/sanda/create';

const sanda = express.Router();

/**
 * Get the Secret Santa assignments
 * Example: Fetch existing assignments or test endpoint
 */
sanda.get('/assignments', getSecretSantaAssignments);

/**
 * Post new Secret Santa assignments
 * Example: Upload employee data, generate assignments
 */
sanda.post('/assignments', postSecretSantaAssignments);

export default sanda;
