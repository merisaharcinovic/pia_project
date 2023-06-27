import * as express from "express"
import User from "../models/user";
import RegistrationRequest from "../models/registrationRequests";

export class UserController{
    registerAgency=(req:express.Request, res:express.Response)=>{

        let registrationRequest = new RegistrationRequest({
            username : req.body.username,
            password :req.body.password,
            phone : req.body.phone,
            email : req.body.email,
            role:'agency',
            agency:{
                name :req.body.agencyName,
                adress : req.body.agencyAddress,
                PIB :req.body.agencyPIB,
                description : req.body.agencyDescription
            },
            client:null,
            profilePicture:""
        })

        registrationRequest.save((err, resp)=>{
            if(err) {
                console.log(err);
                res.status(400).json({"message": "error"})
            }
            else res.json({"message": "ok"})
        })

    }
    registerClient=(req:express.Request, res:express.Response)=>{
    

        let registrationRequest = new RegistrationRequest({
            username : req.body.username,
            password :req.body.password,
            phone : req.body.phone,
            email : req.body.email,
            role:'client',
            client:{
                firstname :req.body.firstname,
                lastname : req.body.lastname
            },
            agency:null,
            profilePicture:""
        })

        registrationRequest.save((err, resp)=>{
            if(err) {
                console.log(err);
                res.status(400).json({"message": "error"})
            }
            else res.json({"message": "ok"})
        })

    }
    
    login=(req:express.Request, res:express.Response)=>{
        let username=req.body.username;
        let password=req.body.password;

        User.findOne({'username':username, 'password':password}, (err, user)=>{
            if(err) console.log(err)
            else res.json(user)
        })

    }

    checkUsernameAndEmail = async (req: express.Request, res: express.Response) => {
        try {
          const username = req.body.username;
          const email = req.body.email;
      
          let result = { username: false, email: false };
      
          const userByUsername = await User.findOne({ username: username });
          if (userByUsername) {
            result.username = true;
          }

          const declinedbyUsername = await RegistrationRequest.findOne({ username: username, status:'declined'});
          if (userByUsername) {
            result.username = true;
          }

          const declinedbyEmail = await RegistrationRequest.findOne({ email: email, status:'declined'});
          if (declinedbyEmail) {
            result.email = true;
          }
      
          const userByEmail = await User.findOne({ email: email });
          if (userByEmail) {
            result.email = true;
          }
      
          res.json(result);
        } catch (err) {
          console.log(err);
          res.status(500).json({ error: 'Internal Server Error' });
        }
    };

    allAgencies=(req:express.Request, res:express.Response)=>{
        User.find({role:'agency'}, (err, agencies)=>{
            if(err) console.log(err);
            else res.json(agencies)
        })
    }
}