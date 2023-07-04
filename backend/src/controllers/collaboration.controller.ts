import * as express from "express"
import CollaborationRequest from "../models/collaborationRequest"

export class CollaborationController{
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
        console.log(agencyId)
      
        CollaborationRequest.find({ agency: agencyId }, (err, requests) => {
            if (err) {
              res.status(500).json({ message: 'Greška prilikom dohvatanja zahteva za agenciju.' });
            } else {
                console.log(requests)
              res.status(200).json({ requests: requests });
            }
        });
    };
      

}