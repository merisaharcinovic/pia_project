import express from 'express'
import { CollaborationController } from '../controllers/collaboration.controller';
const collaborationRouter = express.Router();


collaborationRouter.route('/requestCollaboration').post(
    (req, res) => new CollaborationController().requestCollaboration(req, res)

)

collaborationRouter.route('/getCollaborationsForAgency').post(
    (req, res) => new CollaborationController().getCollaborationsForAgency(req, res)

)
export default collaborationRouter;