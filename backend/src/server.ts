import express from 'express';
import cors from 'cors'
import mongoose from 'mongoose'
import userRouter from './routers/user.routes';
import adminRouter from './routers/admin.routes';
import collaborationRouter from './routers/collaboration.routes';

const app = express();
app.use(cors())
app.use(express.json())

mongoose.connect("mongodb+srv://root:root@piaprojekat.p2xfn9u.mongodb.net/agencies")
const connection = mongoose.connection
connection.once('open', ()=>{
    console.log('db connected')
})

const router = express.Router();
router.use('/users', userRouter)
router.use('/admin', adminRouter)
router.use('/collaboration', collaborationRouter)


app.use('/', router)

app.listen(4000, () => console.log(`Express server running on port 4000`));