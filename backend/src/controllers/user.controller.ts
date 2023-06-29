import * as express from "express"
import User from "../models/user";
import RegistrationRequest from "../models/registrationRequests";

export class UserController{
    registerAgency=(req:express.Request, res:express.Response)=>{
        console.log(req.body.agencyAddress)
        let registrationRequest = new RegistrationRequest({
            username : req.body.username,
            password :req.body.password,
            phone : req.body.phone,
            email : req.body.email,
            role:'agency',
            agency:{
                name :req.body.agencyName,
                address : req.body.agencyAddress,
                PIB :req.body.agencyPIB,
                description : req.body.agencyDescription
            },
            client:null,
            profilePicture:req.body.profilePicture
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
            profilePicture:req.body.profilePicture
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

    searchAgencies = (req: express.Request, res: express.Response) => {
      let searchParam = req.query.param;
      let searchByAddress = req.query.searchByAddress === 'true';
      let searchByName = req.query.searchByName === 'true';
    
      let query: any = {
        role: 'agency'
      };
    
      if (searchByAddress && searchByName) {
        query.$or = [
          { 'agency.name': { $regex: searchParam, $options: 'i' } },
          {
            'agency.address': {
              $elemMatch: {
                $or: [
                  { country: { $regex: searchParam, $options: 'i' } },
                  { city: { $regex: searchParam, $options: 'i' } },
                  { street: { $regex: searchParam, $options: 'i' } },
                  { number: { $regex: searchParam, $options: 'i' } }
                ]
              }
            }
          }
        ];
      } else if (searchByAddress) {
        query['agency.address'] = {
          $elemMatch: {
            $or: [
              { country: { $regex: searchParam, $options: 'i' } },
              { city: { $regex: searchParam, $options: 'i' } },
              { street: { $regex: searchParam, $options: 'i' } },
              { number: { $regex: searchParam, $options: 'i' } }
            ]
          }
        };
      } else if (searchByName) {
        query['agency.name'] = { $regex: searchParam, $options: 'i' };
      }
    
      User.find(query, (err, agencies) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ message: 'Error searching agencies' });
        }
    
        res.json(agencies);
      });
    };

    updateProfile=(req: express.Request, res: express.Response) => {
      let username=req.body.username;
      let updatedProfile = req.body.updatedProfile

      User.updateOne(
        { 'username':username },
        {
          $set: {
            'client.firstname': updatedProfile.firstname,
            'client.lastname': updatedProfile.lastname,
            email: updatedProfile.email,
            phone: updatedProfile.phone,
            profilePicture: updatedProfile.profilePicture,
          },
        },
        (err) => {
          if (err) {
            res.status(500).json({ 'message': 'Greska pri azuriranju profila' });
          } else {
            // Vratite ažurirane podatke profila kao deo odgovora
            res.status(200).json({
              'message': 'Uspesno azuriran profil',
              'updatedProfile': updatedProfile
            });
          }
        }
      );
    };


    
    changePassword=(req: express.Request, res: express.Response) => {
      let username=req.body.username
      let newPassword=req.body.newPassword
      
      User.updateOne(
        { username: username },
        { password: newPassword },
        (err) => {
          if (err) {
            res.status(500).json({ message: 'Greška pri promeni lozinke' });
          } else {
            res.status(200).json({ message: 'Uspesno promenjena lozinka' });
          }
        }
      );
    }
}