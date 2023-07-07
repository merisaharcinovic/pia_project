import * as express from "express"
import User from "../models/user";
import WorkerSchema from "../models/user";

import RegistrationRequest from "../models/registrationRequests";



export class AdminController{

  editClient = async (req: express.Request, res: express.Response) => {
    try {
      const clientId = req.body.client._id;
      const updatedClient = req.body.client;
  
      const client = await User.findByIdAndUpdate(clientId, updatedClient, { new: true }).exec();
  
      if (!client) {
        return res.status(404).json({ message: 'Klijent nije pronadjen.' });
      }
  
      return res.status(200).json({ message: 'Podaci klijenta su uspesno azurirani.', client });
    } catch (error) {
      return res.status(500).json({ message: 'Greska prilikom azuriranja podataka klijenta.' });
    }
  };
  
  editAgency = async (req: express.Request, res: express.Response) => {
    try {
      const agencyId = req.body.agency._id;
      const updatedAgency = req.body.agency;
  
      const agency = await User.findByIdAndUpdate(agencyId, updatedAgency, { new: true }).exec();
  
      if (!agency) {
        return res.status(404).json({ message: 'Agencija nije pronadjena.' });
      }
  
      return res.status(200).json({ message: 'Podaci agencije su uspesno azurirani.', agency });
    } catch (error) {
      return res.status(500).json({ message: 'Greska prilikom azuriranja podataka agencije.' });
    }
  };
  

  
  deleteUser=(req:express.Request, res:express.Response)=>{
      let username=req.body.username
      User.deleteOne({'username':username}, (err) => {
          if (err) {
            console.log(err);
            res.status(500).json({ error: 'Internal Server Error' });
          } else {
            res.json({ message: 'user deleted' });
          }
        });

  }
  
  allClients=(req:express.Request, res:express.Response)=>{
      User.find({role:'client'}, (err, clients)=>{
          if(err) console.log(err);
          else res.json(clients)
      })
  }
  allAgencies=(req:express.Request, res:express.Response)=>{
      User.find({role:'agency'}, (err, agencies)=>{
          if(err) console.log(err);
          else res.json(agencies)
      })
  }

  pendingRequests=(req:express.Request, res:express.Response)=>{
      RegistrationRequest.find({status:'na cekanju'}, (err, requests)=>{
          if(err) console.log(err);
          else res.json(requests)
      })
  }

  acceptRequest = (req: express.Request, res: express.Response) => {
      const toAccept = req.body;
    
      if (toAccept.client || toAccept.agency) {
        const user = new User({
          username: toAccept.username,
          password: toAccept.password,
          phone: toAccept.phone,
          email: toAccept.email,
          role: toAccept.role,
          client: toAccept.client,
          agency: toAccept.agency,
          profilePicture: toAccept.profilePicture,
        });
    
        
        user.save((err, savedUser) => {
          if (err) {
            console.log(err);
            res.status(500).json({ message: 'Internal Server Error' });
          } else {
            RegistrationRequest.deleteOne({ _id: toAccept._id }, (err) => {
              if (err) {
                console.log(err);
                res.status(500).json({ error: 'Internal Server Error' });
              } else {
                res.json({ message: 'Request accepted' });
              }
            });
          }
        });
      } else {
        res.status(400).json({ message: 'Invalid request' });
      }
    };
  declineRequest=(req:express.Request, res:express.Response)=>{
      const requestId = req.body._id;

      RegistrationRequest.findOneAndUpdate(
        { _id: requestId },
        { $set: { status: 'odbijen' } },
        { new: true },
        (err, updatedRequest) => {
          if (err) {
            console.log(err);
            res.status(500).json({ error: 'Internal Server Error' });
          } else {
            res.json({ message: 'Request declined'});
          }
        }
      );
  }

  addClient = (req: express.Request, res: express.Response) => {
      const clientDict={
          firstname:req.body.firstname,
          lastname: req.body.lastname
      }
      let added = new User({
          username : req.body.username,
          password :req.body.password,
          phone : req.body.phone,
          email : req.body.email,
          role:'client',
          client: clientDict,
          agency:null,
          profilePicture:req.body.profilePicture
      })

      added.save((err, resp)=>{
          if(err) {
              console.log(err);
              res.status(400).json({"message": "error"})
          }
          else res.json({"message": "added new client"})
      })
    };

    addAgency = (req: express.Request, res: express.Response) => {
      const agencyDict={
        name: req.body.name,
        address: req.body.address,
        PIB: req.body.PIB,
        description: req.body.description,
      }
      let added = new User({
          username : req.body.username,
          password :req.body.password,
          phone : req.body.phone,
          email : req.body.email,
          role:'agency',
          agency: agencyDict,
          client:null,
          profilePicture:req.body.profilePicture
      })

      added.save((err, resp)=>{
          if(err) {
              console.log(err);
              res.status(400).json({"message": "error"})
          }
          else res.json({"message": "added new agency"})
      })
    };

    // addWorker = (req: express.Request, res: express.Response) => {
    //   const agencyId = req.body.agency._id;
    //   console.log("AGENCIJA: ",agencyId)
    //   const worker ={
    //     firstname: req.body.firstname,
    //     lastname: req.body.lastname,
    //     email: req.body.email,
    //     phone: req.body.phone,
    //     specialization: req.body.specialization
    //   }
    //   console.log("WORKER: ",worker)

    //   User.updateOne(
    //     { _id: agencyId },
    //     { $push: { 'agency.workers': worker } },
    //     (err) => {
    //       if (err) {
    //         res.status(500).json({ message: 'Greska prilikom dodavanja radnika.' });
    //       } else {
            
    //         res.status(200).json({ message: 'Radnik uspesno dodat.' });
    //       }
    //     }
    //   );
    // };
    
    // editWorker = (req: express.Request, res: express.Response) => {
    //   const agencyId=req.body.agencyId;
    //   console.log("AGENCY:", agencyId)
    //   const worker = req.body.worker;

    //   console.log("WORKER:",worker)
    
    //   User.updateOne(
    //     { _id: agencyId, "agency.workers._id": worker._id },
    //     { $set: { "agency.workers.$": worker } },
    //     (err) => {
    //       if (err) {
    //         res.status(500).json({ message: 'Greska prilikom izmene radnika.' });
    //       } else {
    //         res.status(200).json({ message: 'Radnik uspesno izmenjen.' });
    //       }
    //     }
    //   );
    // };
    
    // deleteWorker = (req: express.Request, res: express.Response) => {
    //   const agencyId = req.body.agencyId;
    //   const workerId = req.body.worker._id
    //   console.log(workerId)
    //   console.log(agencyId)
    
    //   User.findById(agencyId, (err, agency) => {
    //     if (err) {
    //       return res.status(500).json({ message: 'Greska prilikom pronalazenja agencije.' });
    //     }
    
    //     if (!agency) {
    //       return res.status(404).json({ message: 'Agencija nije pronadjena.' });
    //     }
  
    //     console.log(agency)
    //     console.log(JSON.stringify(agency));
  
    //     console.log("WORKERS",agency.workers)
    
    //     const workerIndex = agency.workers.findIndex((worker) => worker._id.toString() == workerId);
    
    //     if (workerIndex === -1) {
    //       return res.status(404).json({ message: 'Radnik nije pronadjen u agenciji.' });
    //     }
    
    //     agency.workers.splice(workerIndex, 1);
    
    //     agency.save((err) => {
    //       if (err) {
    //         return res.status(500).json({ message: 'Greska prilikom brisanja radnika.' });
    //       }
    
    //       return res.status(200).json({ message: 'Radnik je uspesno obrisan iz agencije.' });
    //     });
    //   });
    // };

    addWorker = async (req: express.Request, res: express.Response) => {
      try {
        const agencyId = req.body.agency._id;
        console.log("AGENCIJA: ", agencyId);
        const worker = {
          firstname: req.body.firstname,
          lastname: req.body.lastname,
          email: req.body.email,
          phone: req.body.phone,
          specialization: req.body.specialization,
        };
        console.log("WORKER: ", worker);
    
        const user = await User.findById(agencyId);
        if (!user) {
          return res.status(404).json({ message: "Agencija nije pronadjena." });
        }
    
        user.agency.workers.push(worker);
        await user.save();
    
        res.status(200).json({ message: "Radnik uspesno dodat." });
      } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Greska prilikom dodavanja radnika." });
      }
    };
    
    editWorker = async (req: express.Request, res: express.Response) => {
      try {
        const agencyId = req.body.agencyId;
        console.log("AGENCY:", agencyId);
        const worker = req.body.worker;
        console.log("WORKER:", worker);
    
        const result = await User.updateOne(
          { _id: agencyId, "agency.workers._id": worker._id },
          { $set: { "agency.workers.$": worker } }
        );
    
        if (result.modifiedCount === 0) {
          return res.status(404).json({ message: "Radnik nije pronadjen." });
        }
    
        res.status(200).json({ message: "Radnik uspesno izmenjen." });
      } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Greska prilikom izmene radnika." });
      }
    };
    
    deleteWorker = async (req: express.Request, res: express.Response) => {
      try {
        const agencyId = req.body.agencyId;
        const workerId = req.body.worker._id;
        console.log(workerId);
        console.log(agencyId);
    
        const result = await User.updateOne(
          { _id: agencyId },
          { $pull: { "agency.workers": { _id: workerId } } }
        );
    
        if (result.modifiedCount === 0) {
          return res.status(404).json({ message: "Radnik nije pronadjen u agenciji." });
        }
    
        res.status(200).json({ message: "Radnik je uspesno obrisan iz agencije." });
      } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Greska prilikom brisanja radnika." });
      }
    };
    
    
    
    
    
    
    
    
    
}