import { Router } from "express";
import jwt from "jsonwebtoken";
import { jwtValidation } from '../middlewares/jwt.middleware.js'

const router = Router();

router.get("/current", jwtValidation, (req, res) => {
    console.log('TOKEN VALIDADO')
    res.send('PROBANDO JWT')
});

export default router;
