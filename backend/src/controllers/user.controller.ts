import * as express from "express"
import User from "../models/user";
import RegistrationRequest from "../models/registrationRequests";

export class UserController{
  uploadProfilePicture=(req:express.Request, res:express.Response)=>{
    res.status(200).json({message:"Image uploaded!"});
  }
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

          const declinedbyUsername = await RegistrationRequest.findOne({ username: username, status:'odbijen'});
          if (userByUsername) {
            result.username = true;
          }

          const declinedbyEmail = await RegistrationRequest.findOne({ email: email, status:'odbijen'});
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

  

    getAgency = (req: express.Request, res: express.Response) => {
      let id= req.body.id
      User.findById(id, (err, user) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: 'Server error' });
        }
    
        if (!user) {
          return res.status(404).json({ error: 'User not found' });
        }
    
        res.json(user);
      });
    }
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
            res.status(200).json({
              'message': 'Uspesno azuriran profil',
              'updatedProfile': updatedProfile
            });
          }
        }
      );
    };

    updateAgencyProfile = (req: express.Request, res: express.Response) => {
      let username = req.body.username;
      let updatedProfile = req.body.updatedProfile;

      console.log(updatedProfile)
    
      User.updateOne(
        { 'username': username },
        {
          $set: {
            'agency.name': updatedProfile.name,
            'agency.description': updatedProfile.description,
            'agency.address.country': updatedProfile.address.country,
            'agency.address.city': updatedProfile.address.city,
            'agency.address.street': updatedProfile.address.street,
            'agency.address.number': updatedProfile.address.number,
            'email': updatedProfile.email,
            'phone': updatedProfile.phone,
          },
        },
        (err) => {
          if (err) {
            res.status(500).json({ 'message': 'Greska pri azuriranju profila' });
          } else {
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
            res.status(500).json({ message: 'Greska pri promeni lozinke' });
          } else {
            res.status(200).json({ message: 'Uspesno promenjena lozinka' });
          }
        }
      );
    }

    getObjects=(req: express.Request, res: express.Response) => {
      const userId = req.params.id

      User.findById(userId, (err, user) => {
        if (err) {
          res.status(500).json({ message: 'Greska pri dohvatanju korisnika' });
        } else if (!user) {
          res.status(404).json({ message: 'Korisnik nije pronadjen' });
        } else {
          const objects = user.client.objects;
          res.status(200).json({ objects });
        }
      });
    }

    deleteObject=(req: express.Request, res: express.Response) => {
      const { id, object } = req.body;
      console.log(object)

      User.updateOne(
        { _id: id },
        {
          $pull: {
            'client.objects': {
              // _id:object._id
              address: object.address,
              objectType: object.objectType,
              area: object.area,
              numRooms: object.numRooms
            }
          }
        },
        (err, result) => {
          if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Greska prilikom brisanja objekta.' });
          }
    
          if (result.nModified === 0) {
            return res.status(404).json({ message: 'Objekat nije pronadjen.' });
          }
    
          return res.status(200).json({ message: 'Objekat uspesno obrisan.' });
        }
      );
    }  

    editObject = (req: express.Request, res: express.Response) => {
      const { id, editObject } = req.body; 
      console.log(editObject)
    
      User.findById(id, (err, user) => {
        if (err) {
          return res.status(500).json({ message: 'Greska prilikom pronalazenja korisnika.' });
        }
    
        if (!user) {
          return res.status(404).json({ message: 'Korisnik nije pronadken.' });
        }
    
        const objectToUpdate = user.client.objects.find((object) => object._id.equals(editObject._id));
    
        if (!objectToUpdate) {
          return res.status(404).json({ message: 'Objekat nije pronadjen.' });
        }
    
        objectToUpdate.objectType = editObject.objectType;
        objectToUpdate.address = editObject.address;
        objectToUpdate.numRooms = editObject.numRooms;
        objectToUpdate.area = editObject.area;
    
        user.save((err) => {
          if (err) {
            
            return res.status(500).json({ message: 'Greska prilikom cuvanja objekta.' });
          }
    
          return res.status(200).json({ message: 'Objekat je uspesno azuriran.' });
        });
      });
    };

    addObject = (req: express.Request, res: express.Response) => {
      const userId = req.body.id; 
      const objectToAdd = req.body.object;
    
      User.findById(userId, (err, user) => {
        if (err || !user) {
          return res.status(404).json({ message: "Korisnik nije pronadjen." });
        }
    
        user.client.objects.push(objectToAdd);
    
        user.save((err) => {
          if (err) {
            return res.status(500).json({ message: "Greska prilikom dodavanja objekta." });
          }
    
          return res.status(200).json({ message: "Objekat uspesno dodat korisniku." });
        });
    });
  }

 
}