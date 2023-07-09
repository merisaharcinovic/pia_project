import * as express from "express"
import User from "../models/user";
import Worker from "../models/worker";

import RegistrationRequest from "../models/registrationRequests";
import mongoose from "mongoose";

const ObjectId = mongoose.Types.ObjectId;




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

  

    addWorker = async (req: express.Request, res: express.Response) => {
      try {
        const agencyId = req.body.agency._id;
        console.log("AGENCIJA: ", agencyId);

        const worker = new Worker({
          firstname: req.body.firstname,
          lastname: req.body.lastname,
          email: req.body.email,
          phone: req.body.phone,
          specialization: req.body.specialization,
          agency: new ObjectId(agencyId)
        }) 


        console.log("WORKER: ", worker);

        const savedWorker = await worker.save();

        console.log("SAVED:",savedWorker)
    
        res.status(200).json({ message: "Radnik uspesno dodat." });
      } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Greska prilikom dodavanja radnika." });
      }
    };
    
    editWorker = async (req: express.Request, res: express.Response) => {
      try {
        const worker = req.body.worker;
        console.log("WORKER:", worker);
    
        const result = await Worker.updateOne(
          { _id: worker._id },
          { $set: worker }
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
        const workerId = req.body.worker._id;
        console.log(workerId);
    
        const result = await Worker.deleteOne({_id: workerId });
    
        if (result.deletedCount === 0) {
          return res.status(404).json({ message: "Radnik nije pronadjen u agenciji." });
        }
    
        res.status(200).json({ message: "Radnik je uspesno obrisan iz agencije." });
      } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Greska prilikom brisanja radnika." });
      }
    };
    
    
    
    getWorkers = async (req: express.Request, res: express.Response) => {
      try {
        const agencyId = req.body.agency._id;
        const convertedAgencyId = new ObjectId(agencyId);
    
        const workers = await Worker.find({ agency: convertedAgencyId }).exec();

        console.log(workers)
    
        res.status(200).json({ workers });
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Greska prilikom dohvatanja radnika.' });
      }
    };
    
    
    
    
    
}