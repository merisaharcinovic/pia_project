import * as express from "express";
import Job from "../models/job";
import User from "../models/user";
import mongoose from "mongoose";

export class JobController {

    getJobs = async (req: express.Request, res: express.Response) => {
        try {
          const jobs = await Job.find({}).exec();
      
          const jobCount = jobs.length;
      
          if (jobCount === 0) {
            return res.status(200).json([]);
          }
      
          const resultArray = [];

          console.log(jobCount)
      
          for (let i = 0; i < jobs.length; i++) {
            const job = jobs[i];
            console.log("JOB:", job)
            const result = {
              _id: job._id,
              client: null,
              agency: null,
              object: job.object,
              numWorkers: job.numWorkers,
              price: job.price,
              deadline: job.deadline.toISOString().slice(0, 10),
              status: job.status,
              review: job.review
            };
      
            const clientId = job.client;
            const agencyId = job.agency;
      
            const [client, agency] = await Promise.all([
              User.findById(clientId).exec(),
              User.findById(agencyId).exec(),
            ]);
      
            result.client = client;
            result.agency = agency;
      
            resultArray.push(result);
          }
      
          return res.status(200).json({ jobs: resultArray });
        } catch (error) {
          return res.status(500).json({ message: 'Greska prilikom dohvatanja poslova.' });
        }
      };
      

    getJobsForClient = async (req: express.Request, res: express.Response) => {
        try {
            const clientId = req.body.id;
      
            const jobs = await Job.find({ client: clientId }).exec();
        
            const jobCount = jobs.length;
        
            if (jobCount === 0) {
                return res.status(200).json([]);
            }
        
            const resultArray = [];
        
            for (let i = 0; i < jobs.length; i++) {
                const job = jobs[i];
                const result = {
                _id: job._id,
                client: null,
                agency: null,
                object: job.object,
                numWorkers: job.numWorkers,
                price:job.price,
                deadline: job.deadline.toISOString().slice(0, 10),
                status: job.status,
                review: job.review
                };
        
                const agencyId = job.agency;
        
                const agency = await User.findById(agencyId).exec();
                if (agency) {
                    result.agency = agency;
                }
        
                const clientId = job.client;
        
                const client = await User.findById(clientId).exec();
                if (client) {
                    result.client = client;
                }
        
                resultArray.push(result);
            }
        
            return res.status(200).json({ jobs: resultArray });
        } catch (error) {
            return res.status(500).json({ message: 'Greska prilikom dohvatanja poslova za klijenta.' });
        }
    };

    getJobsForAgency = async (req: express.Request, res: express.Response) => {
        try {
          const agencyId = req.body.id;
      
          const jobs = await Job.find({ agency: agencyId }).exec();
      
          const jobCount = jobs.length;
      
          if (jobCount === 0) {
            return res.status(200).json([]);
          }
      
          const resultArray = [];
      
          for (let i = 0; i < jobs.length; i++) {
            const job = jobs[i];
            const result = {
              _id: job._id,
              client: null,
              agency: null,
              object: job.object,
              numWorkers: job.numWorkers,
              price: job.price,
              deadline: job.deadline.toISOString().slice(0, 10),
              status: job.status,
            };
      
            const clientId = job.client;
      
            const client = await User.findById(clientId).exec();
            if (client) {
              result.client = client;
            }
      
            result.agency = await User.findById(agencyId).exec();
      
            resultArray.push(result);
          }
      
          return res.status(200).json({ jobs: resultArray });
        } catch (error) {
          return res.status(500).json({ message: 'Greska prilikom dohvatanja poslova za agenciju.' });
        }
      };

    assignWorkers = (req: express.Request, res: express.Response) => {
    let id = req.body.id;
    let numWorkers = req.body.numWorkers;

    Job.findByIdAndUpdate(
        id,
        { $set: { numWorkers: numWorkers } },
        (err, job) => {
            if (err) {
                res.status(500).json({ message: 'Greska pri dodeli radnika' });
            } 
            else if (!job) {
                res.status(404).json({ message: 'Posao nije pronadjen' });
            } 
            else {
                res.status(200).json({ message: 'Uspesno dodeljen broj radnika.' });
            }
        });
    }

    addReview = async (req: express.Request, res: express.Response) => {
        const { job, review } = req.body;
      
        try {
          const updatedJob = await Job.findByIdAndUpdate(
            job._id,
            { review: review },
            { new: true }
          );
          console.log(updatedJob)
      
          if (!updatedJob) {
            return res.status(404).json({ message: "Posao nije pronadjen" });
          }
      
          return res.status(200).json({ message: "Ocena je uspesno dodata.", job: updatedJob });
        } catch (error) {
          return res.status(500).json({ message: "Greska prilikom dodavanja ocene", error });
        }
    };

    editReview = async (req: express.Request, res: express.Response) => {
        const { job, review } = req.body;

        try {
          const updatedJob = await Job.findByIdAndUpdate(
            job._id,
            { review: review },
            { new: true }
          );
      
          if (!updatedJob) {
            return res.status(404).json({ message: 'Posao nije pronadjen' });
          }
      
          return res.status(200).json({ message: 'Ocena je uspesno izmenjena.', job: updatedJob });
        } catch (error) {
          return res.status(500).json({ message: 'Greska prilikom izmene ocene', error });
        }
      
    }
    deleteReview = async (req: express.Request, res: express.Response) => {
        const { job } = req.body;

        try {
            const updatedJob= await Job.findByIdAndUpdate(
            job._id,
            { review: null },
            { new: true }
            );

            if (!updatedJob) {
                return res.status(404).json({ message: 'Posao nije pronadjen' });
            }

            return res.status(200).json({ message: 'Ocena je uspesno obrisana.', job: updatedJob });
        } catch (error) {
            return res.status(500).json({ message: 'Greska prilikom brisanja ocene', error });
        }
    }
    

};