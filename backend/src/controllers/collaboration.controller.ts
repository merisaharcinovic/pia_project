import * as express from "express";
import CollaborationRequest from "../models/collaborationRequest";
import User from "../models/user";

export class CollaborationController {
  requestCollaboration = (req: express.Request, res: express.Response) => {
    const request = req.body.request;

    const newRequest = new CollaborationRequest({
      agency: request.agency,
      client: request.client,
      object: request.object,
      deadline: request.deadline,
      status: request.status,
      price: request.price
    });

    newRequest.save((err, savedRequest) => {
      if (err) {
        return res.status(500).json({ message: 'Greska prilikom cuvanja zahteva za saradnju.' });
      }
      return res.status(200).json({ message: 'Zahtev za saradnju uspesno poslat.' });
    });
  };

  getCollaborationsForAgency = (req: express.Request, res: express.Response) => {
    const agencyId = req.body.id;
    console.log(agencyId);
  
    let resultArray = [];
  
    CollaborationRequest.find({ agency: agencyId }, (err, requests) => {
      if (err) {
        return res.status(500).json({ message: 'Greska prilikom dohvatanja zahteva za agenciju.' });
      }
  
      console.log(requests);
  
      const requestCount = requests.length;
  
      if (requestCount === 0) {
        return res.status(200).json([]);
      }
  
      let processedCount = 0;
  
      for (let i = 0; i < requests.length; i++) {
        const request = requests[i];
        const result = {
          _id: request._id,
          client: null,
          object: null,
          deadline: request.deadline.toISOString().slice(0, 10),
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
            console.log(clientObjects);
  
            const object = clientObjects.find((obj) => obj._id.toString() == objectId);
            console.log("OBJECT: ", object);
            result.object = object;
  
            console.log("RESULT", result);
  
            resultArray.push(result);
  
            processedCount++;
  
            if (processedCount === requestCount) {
              console.log("ARRAY", resultArray);
              res.status(200).json({requests: resultArray});
            }
          }
        });
      }
    });
  };
  

  declineCollaborationRequest = (req: express.Request, res: express.Response) => {
    let id = req.body.id;

    CollaborationRequest.findByIdAndUpdate(id, { status: 'declined' }, { new: true }, (err, updatedRequest) => {
      if (err) {
        res.status(500).json({ message: 'Greska prilikom odbijanja zahteva.' });
      } else if (!updatedRequest) {
        res.status(404).json({ message: 'Zahtev nije pronadjen.' });
      } else {
        res.status(200).json({ message: 'Zahtev odbijen.' });
      }
    });
  };
}
