import express from 'express'
import { UserController } from '../controllers/user.controller';
import multer from 'multer';

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'profilePictures/'); 
    },
    filename: function (req, file, cb) {
      
      cb(null, file.originalName);
    }
  });
  
const upload = multer({ storage: storage });

const userRouter = express.Router();

userRouter.route('/login').post(
    (req,res)=>new UserController().login(req,res)
)
userRouter.route('/checkUsernameAndEmail').post(
    (req,res)=>new UserController().checkUsernameAndEmail(req,res)
)

userRouter.route('/registerClient').post(
    (req,res)=>new UserController().registerClient(req,res)
)

userRouter.route('/registerAgency').post(
    (req,res)=>new UserController().registerAgency(req,res)
)

userRouter.route('/allAgencies').get(
    (req,res)=>new UserController().allAgencies(req,res)
)


userRouter.route('/getAgency').post(
    (req, res) => new UserController().getAgency(req, res)

)

userRouter.route('/updateProfile').post(
    (req, res) => new UserController().updateProfile(req, res)

)

userRouter.route('/updateAgencyProfile').post(
    (req, res) => new UserController().updateAgencyProfile(req, res)

)



userRouter.route('/changePassword').post(
    (req, res) => new UserController().changePassword(req, res)

)

userRouter.route('/getObjects/:id').get(
    (req, res) => new UserController().getObjects(req, res)
);

userRouter.route('/deleteObject').post(
    (req, res) => new UserController().deleteObject(req, res)

)

userRouter.route('/editObject').post(
    (req, res) => new UserController().editObject(req, res)

)

userRouter.route('/addObject').post(
    (req, res) => new UserController().addObject(req, res)

)

userRouter.route('/upload-profile-picture').post(upload.single('profilePicture'),
    (req, res) => new UserController().uploadProfilePicture(req, res)

)

export default userRouter;