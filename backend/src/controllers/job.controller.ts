import * as express from "express";
import Job from "../models/job";
import User from "../models/user";
import mongoose from "mongoose";

interface Worker {
    firstname: string;
    lastname: string;
    email: string;
    phone: string;
    specialization: string;
    available?: boolean;
  }

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
              deadline: job.deadline,
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

            console.log("JOB AGENCY",result.agency)
      
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
                deadline: job.deadline,
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

                console.log("JOB AGENCY",result.agency)

        
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
              deadline: job.deadline,
              status: job.status,
            };
      
            const clientId = job.client;
      
            const client = await User.findById(clientId).exec();
            if (client) {
              result.client = client;
            }
      
            result.agency = await User.findById(agencyId).exec();

            console.log("JOB AGENCY",result.agency)

      
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

    payAndFinish = async (req: express.Request, res: express.Response) => {
        try {
            const { job } = req.body;
        
            const updatedJob = await Job.findOneAndUpdate(
              { _id: job },
              { $set: { status: 'zavrsen' } },
              { new: true }
            );
        
            if (!updatedJob) {
              return res.status(404).json({ message: 'Posao nije pronadjen.' });
            }
        
            return res.status(200).json({ message: 'Posao placen i zavrsen.' });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Greska prilikom placanja i zavrsetka posla.' });
        }
    };

    updateRoomStatus = (req: express.Request, res: express.Response) => {
        const { job, room } = req.body;

        Job.findById(job._id)
            .then((foundJob) => {
            
            const targetRoom = foundJob.object.sketch.find((r) => r._id.toString() == room._id);

            if (targetRoom) {
                
                targetRoom.status = room.status;

                foundJob.save()
                .then(() => {
                    res.status(200).json({ message: 'Status sobe je uspesno azuriran.' });
                })
                .catch((error) => {
                    res.status(500).json({ error: 'Greska prilikom cuvanja promena u bazi podataka.' });
                });
            } else {
                res.status(404).json({ error: 'Soba nije pronadjena.' });
            }
            })
            .catch((error) => {
                res.status(500).json({ error: 'Greska prilikom pronalazenja posla u bazi podataka.' });
            });
    }


    checkWorkerAvailability = (req: express.Request, res: express.Response) => {
        const job = req.body.job
        const jobId = job._id;

        const agencyId = req.body.job.agency;
      
        User.findById(agencyId, (err, agency) => {
          if (err) {
            return res.status(500).json({ message: 'Greska pri pretrazi agencije.' });
          }
      
          if (!agency) {
            return res.status(404).json({ message: 'Agencija nije pronadjena.' });
          }
          const numAvailable=0;
          
          const response = {
            job: job,
            numAvailable: numAvailable
          };
      
          return res.status(200).json(response);
        });
    };
      
      
    takeWorkers = (req: express.Request, res: express.Response) => {
        console.log("TAKE WORKERS")
        const job = req.body.job;
        const numWorkers = req.body.numWorkers;

        console.log(job,numWorkers)

      
        User.findById(job.agency, (err, agency) => {
          if (err) {
            return res.status(500).json({ message: 'Greska u pretrazi agencije.' });
          }
      
          if (!agency) {
            return res.status(404).json({ message: 'Agencija nije pronadjena.' });
          }
      
          const availableWorkers = agency.workers.filter(worker => worker.available === true);
      
          if (availableWorkers.length < numWorkers) {
            return res.status(400).json({ message: 'Nema dovoljno slobodnih radnika u agenciji.' });
          }
      
          const selectedWorkers = availableWorkers.slice(0, numWorkers);
          selectedWorkers.forEach(worker => {
            worker.available = false;
          });
      
          agency.save((err, updatedAgency) => {
            if (err) {
              return res.status(500).json({ message: 'Greska pri azuriranju agencije.' });
            }
      
            return res.status(200).json({ message: 'Radnici dodeljeni poslu.'});
          });
        });
      };
      
    
};