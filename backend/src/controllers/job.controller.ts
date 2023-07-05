import * as express from "express";
import Job from "../models/job";
import User from "../models/user";
import mongoose from "mongoose";

export class JobController {
  
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
                status: job.status,
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
      
}      