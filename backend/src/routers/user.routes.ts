import express from 'express'
import { UserController } from '../controllers/user.controller';
const userRouter = express.Router();

userRouter.route('/login').post(
    (req,res)=>new UserController().login(req,res)
)
userRouter.route('/checkUsernameAndEmail').post(
    (req,res)=>new UserController().checkUsernameAndEmail(req,res)
)

userRouter.route('/registerClient').post(
    (req,res)=>new UserController().registerClient(req,res)
)

userRouter.route('/registerAgency').post(
    (req,res)=>new UserController().registerAgency(req,res)
)

userRouter.route('/allAgencies').get(
    (req,res)=>new UserController().allAgencies(req,res)
)
export default userRouter;