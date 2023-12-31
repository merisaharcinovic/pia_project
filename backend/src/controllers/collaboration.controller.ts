import * as express from "express";
import CollaborationRequest from "../models/collaborationRequest";
import User from "../models/user";
import Job from "../models/job"
import mongoose from "mongoose";

export class CollaborationController {
  requestCollaboration = (req: express.Request, res: express.Response) => {
    const request = req.body.request;

    console.log(request)

    const newRequest = new CollaborationRequest({
      agency: request.agency,
      client: request.client,
      object: request.object,
      deadline: request.deadline,
      status: request.status,
      price: request.price
    });

    console.log(newRequest)


    newRequest.save((err, savedRequest) => {
      if (err) {
        return res.status(500).json({ message: 'Greska prilikom cuvanja zahteva za saradnju.' });
      }
      return res.status(200).json({ message: 'Zahtev za saradnju uspesno poslat.' });
    });
  };

  getCollaborationsForAgency = (req: express.Request, res: express.Response) => {
    const agencyId = req.body.id;
  
    let resultArray = [];
  
    CollaborationRequest.find({ agency: agencyId }, (err, requests) => {
      if (err) {
        return res.status(500).json({ message: 'Greska prilikom dohvatanja zahteva za agenciju.' });
      }
  
  
      const requestCount = requests.length;
  
      if (requestCount === 0) {
        return res.status(200).json({requests:[]});
      }
  
      let processedCount = 0;
  
      for (let i = 0; i < requests.length; i++) {
        const request = requests[i];
        const result = {
          _id: request._id,
          client: null,
          object: null,
          deadline: request.deadline,
          status: request.status,
          price: request.price
        };
  
        const clientId = request.client;
  
        User.findById(clientId, (err, client) => {
          if (err) {
            console.log(err);
          } else {
            result.client = client;
  
            const objectId = request.object;
  
            const clientObjects = client?.client?.objects || [];
  
            const object = clientObjects.find((obj) => obj._id.toString() == objectId);
            result.object = object;
  
  
            resultArray.push(result);
  
            processedCount++;
  
            if (processedCount === requestCount) {
              res.status(200).json({requests: resultArray});
            }
          }
        });
      }
    });
  };
  

  getCollaborationsForClient = async (req: express.Request, res: express.Response) => {
    try {
      const clientId = req.body.id;
    
      const requests = await CollaborationRequest.find({ client: clientId }).exec();
    
      const requestCount = requests.length;
    
      if (requestCount === 0) {
        return res.status(200).json({requests:[]});
      }
    
      const resultArray = [];
    
      for (let i = 0; i < requests.length; i++) {
        const request = requests[i];
        const result = {
          _id: request._id,
          client: null,
          agency: null,
          object: null,
          deadline: request.deadline,
          status: request.status,
          price: request.price
        };
  
        const agencyId = request.agency;
  
        const agency = await User.findById(agencyId).exec();
        if (agency) {
          result.agency = agency;
        }
    
        const clientId = request.client;
    
        const client = await User.findById(clientId).exec();
        if (client) {
          result.client = client;
    
          const objectId = request.object;
    
          const clientObjects = client?.client?.objects || [];
    
          const object = clientObjects.find((obj) => obj._id.toString() == objectId);
          result.object = object;
    
          resultArray.push(result);
        }
      }
      console.log("RESULT ARRAY: ", resultArray)
      return res.status(200).json({ requests: resultArray });
    } catch (error) {
      return res.status(500).json({ message: 'Greska prilikom dohvatanja zahteva za klijenta.' });
    }
  };
  

  declineCollaborationRequest = (req: express.Request, res: express.Response) => {
    let id = req.body.id;

    CollaborationRequest.findByIdAndUpdate(id, { status: 'odbijen' }, { new: true }, (err, updatedRequest) => {
      if (err) {
        res.status(500).json({ message: 'Greska prilikom odbijanja zahteva.' });
      } else if (!updatedRequest) {
        res.status(404).json({ message: 'Zahtev nije pronadjen.' });
      } else {
        res.status(200).json({ message: 'Zahtev odbijen.' });
      }
    });
  };

  deleteRequest = (req: express.Request, res: express.Response) => {
    const id = req.body.id;
  
    CollaborationRequest.findOneAndDelete({ _id: id }, (err, deletedRequest) => {
      if (err) {
        res.status(500).json({ message: 'Greska prilikom brisanja zahteva.' });
      } else if (!deletedRequest) {
        res.status(404).json({ message: 'Zahtev nije pronadjen.' });
      } else {
        res.status(200).json({ message: 'Zahtev obrisan.' });
      }
    });
  };


  sendOffer = (req: express.Request, res: express.Response) => {
    const offer = req.body.offer;
    const requestId = offer.requestId;
    const price = offer.price;
  
    CollaborationRequest.findById(requestId, (err, request) => {
      if (err) {
        return res.status(500).json({ message: 'Greska prilikom pronalazenja zahteva.' });
      }
  
      if (!request) {
        return res.status(404).json({ message: 'Zahtev nije pronadjen.' });
      }
  
      request.price = price;
      request.status = 'prihvacen';
  
      request.save((err) => {
        if (err) {
          return res.status(500).json({ message: 'Greska prilikom cuvanja ponude.' });
        }
  
        res.status(200).json({ message: 'Ponuda je poslata.' });
      });
    });
  };
  

  acceptOffer = async (req: express.Request, res: express.Response) => {
    let request=req.body.request

    const jobData ={
        client: request.client,
        agency: request.agency,
        object: request.object,
        status: 'aktivan',
        deadline:request.deadline,
        numWorkers: 0,
        price:request.price
    };
    console.log(jobData)

    const job = new Job(jobData);
    console.log(job)

    await job.save((err) => {
        if (err) {
          console.log(err)
        } else {
          
          CollaborationRequest.deleteOne({ _id: request._id }, (err) => {
            if (err) {
                res.status(500).json({ message: 'Greska prilikom prihvatanja ponude.' });
            } else {
                res.status(200).json({ message: 'Ponuda prihvacena.' });
            }
          });
        }
    });
  };
}
