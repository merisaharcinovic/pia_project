import * as express from "express"
import User from "../models/user";
import RegistrationRequest from "../models/registrationRequests";



export class AdminController{
    deleteClient=(req:express.Request, res:express.Response)=>{
        let username=req.body.username
        User.deleteOne({'username':username}, (err) => {
            if (err) {
              console.log(err);
              res.status(500).json({ error: 'Internal Server Error' });
            } else {
              res.json({ message: 'client deleted' });
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
        RegistrationRequest.find({status:'pending'}, (err, requests)=>{
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
          { $set: { status: 'declined' } },
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
            profilePicture:""
        })

        added.save((err, resp)=>{
            if(err) {
                console.log(err);
                res.status(400).json({"message": "error"})
            }
            else res.json({"message": "added new client"})
        })
      };
    
}