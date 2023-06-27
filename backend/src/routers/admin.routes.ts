import express from 'express'
import {AdminController } from '../controllers/admin.controller';
const adminRouter = express.Router();

adminRouter.route('/pendingRequests').get(
    (req,res)=>new AdminController().pendingRequests(req,res)
)

adminRouter.route('/allClients').get(
    (req,res)=>new AdminController().allClients(req,res)
)

adminRouter.route('/allAgencies').get(
    (req,res)=>new AdminController().allAgencies(req,res)
)

adminRouter.route('/acceptRequest').post(
    (req,res)=>new AdminController().acceptRequest(req,res)
)

adminRouter.route('/declineRequest').post(
    (req,res)=>new AdminController().declineRequest(req,res)
)

adminRouter.route('/addClient').post(
    (req,res)=>new AdminController().addClient(req,res)
)

adminRouter.route('/deleteClient').post(
    (req,res)=>new AdminController().deleteClient(req,res)
)

export default adminRouter;