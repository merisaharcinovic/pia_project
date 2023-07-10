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

jobRouter.route('/addReview').post(
    (req, res) => new JobController().addReview(req, res)

)

jobRouter.route('/editReview').post(
    (req, res) => new JobController().editReview(req, res)

)

jobRouter.route('/deleteReview').post(
    (req, res) => new JobController().deleteReview(req, res)

)
jobRouter.route('/payAndFinish').post(
    (req, res) => new JobController().payAndFinish(req, res)

)

jobRouter.route('/updateRoomStatus').post(
    (req, res) => new JobController().updateRoomStatus(req, res)

)
jobRouter.route('/checkWorkerAvailability').post(
    (req, res) => new JobController().checkWorkerAvailability(req, res)

)

jobRouter.route('/takeWorkers').post(
    (req, res) => new JobController().takeWorkers(req, res)
)

jobRouter.route('/hasEnough').post(
    (req, res) => new JobController().hasEnough(req, res)
)
export default jobRouter;