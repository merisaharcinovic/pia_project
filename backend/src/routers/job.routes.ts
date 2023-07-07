import express from 'express'
import { JobController } from '../controllers/job.controller';
const jobRouter = express.Router();


jobRouter.route('/getJobsForClient').post(
    (req, res) => new JobController().getJobsForClient(req, res)

)
jobRouter.route('/getJobsForAgency').post(
    (req, res) => new JobController().getJobsForAgency(req, res)

)

jobRouter.route('/getJobs').get(
    (req, res) => new JobController().getJobs(req, res)

)

jobRouter.route('/assignWorkers').post(
    (req, res) => new JobController().assignWorkers(req, res)

)
export default jobRouter;