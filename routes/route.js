import express from 'express';
import controller from '../controllers/controller';
import me from '../controllers/auth/me';
import auth from '../controllers/auth/auth';

// routes to pages
const router = express.Router();
router.post('/register', controller.register); // registe ruser
router.post('/log-in', controller.login); // login user with new access token and after 60s expires
router.post('/log-out', controller.logout); // logout user as well as delete refresh token
router.get('/me', auth, me); // about me
router.post('/refresh', auth, controller.refresh); // on sending refresh token return new access token after verifying refresh token

export default router;