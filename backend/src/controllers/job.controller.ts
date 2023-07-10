import * as express from "express";
import Job from "../models/job";
import User from "../models/user";
import Worker from "../models/worker";

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
              deadline: job.deadline,
              status: job.status,
              review: job.review,
              hasEnoughWorkers: job.hasEnoughWorkers
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
                deadline: job.deadline,
                status: job.status,
                review: job.review,
                hasEnoughWorkers: job.hasEnoughWorkers

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
              deadline: job.deadline,
              status: job.status,
              review:job.review,
              hasEnoughWorkers: job.hasEnoughWorkers

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

    payAndFinish = async (req: express.Request, res: express.Response) => {
        try {
            const { job } = req.body;

            const workers = await Worker.find({ agency: job.agency._id, available: false });

            const workersToUpdate = workers.slice(0, job.numWorkers);
            workersToUpdate.forEach(async (worker) => {
              worker.available = true;
              await worker.save();
            });
        
            const updatedJob = await Job.findOneAndUpdate(
              { _id: job },
              { $set: { status: 'zavrsen', hasEnoughWorkers:false } },
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
        const job = req.body.job;
      
        const agencyId = req.body.job.agency;
      
        Worker.find({ agency: agencyId, available: true }, (err, workers) => {
          if (err) {
            return res.status(500).json({ message: 'Greska prilikom pretrage slobodnih radnika.' });
          }
      
          const numAvailable = workers.length;

          console.log("AVAILABLE WORKERS", workers, "NUM:", numAvailable)
      
          const response = {
            job: job,
            numAvailable: numAvailable
          };
      
          return res.status(200).json(response);
        });
      };
      
      
      takeWorkers = async (req: express.Request, res: express.Response) => {
        console.log("TAKE WORKERS");
        const job = req.body.job;
        const numWorkers = job.numWorkers;
      
        console.log(job, numWorkers);
      
        try {
          const workers = await Worker.find({ agency: job.agency._id, available: true }).exec();
      
          console.log("FOUND WORKERS:", workers)
          if (workers.length < numWorkers) {
            return res.status(400).json({ message: 'Nema dovoljno slobodnih radnika u agenciji.' });
          }
      
          for (let i = 0; i < numWorkers; i++) {
            await Worker.findByIdAndUpdate(workers[i]._id, { available: false }).exec();
          }
      
          return res.status(200).json({ message: 'Radnici dodeljeni poslu.' });
        } catch (err) {
          console.error(err);
          return res.status(500).json({ message: 'Greška prilikom dodele radnika.' });
        }
      };

      hasEnough =  (req: express.Request, res: express.Response) => {
        let jobId=req.body.job._id
        Job.findOneAndUpdate({ _id: jobId }, { hasEnoughWorkers: true }, { new: true })
        .then(updatedJob => {
          console.log(updatedJob);
          res.status(200).json({ message: 'Posao ima dovoljno radnika.' });

        })
        .catch(error => {
          res.status(500).json({ error: 'Greska prilikom pronalazenja posla u bazi podataka.' });
        });

      }
};