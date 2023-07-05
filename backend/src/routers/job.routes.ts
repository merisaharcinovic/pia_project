import express from 'express'
import { JobController } from '../controllers/job.controller';
const jobRouter = express.Router();


jobRouter.route('/getJobsForClient').post(
    (req, res) => new JobController().getJobsForClient(req, res)

)
jobRouter.route('/getJobsForAgency').post(
    (req, res) => new JobController().getJobsForAgency(req, res)

)
export default jobRouter;