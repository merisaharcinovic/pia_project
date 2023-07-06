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

adminRouter.route('/addAgency').post(
    (req,res)=>new AdminController().addAgency(req,res)
)

adminRouter.route('/deleteUser').post(
    (req,res)=>new AdminController().deleteUser(req,res)
)

adminRouter.route('/deleteWorker').post(
    (req,res)=>new AdminController().deleteWorker(req,res)
)

adminRouter.route('/addWorker').post(
    (req,res)=>new AdminController().addWorker(req,res)
)

adminRouter.route('/editWorker').post(
    (req,res)=>new AdminController().editWorker(req,res)
)

export default adminRouter;