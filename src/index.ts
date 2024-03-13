import express, {Request, Response, ErrorRequestHandler} from 'express'
import cors from 'cors'

import routes from './routes'
import dotenv from 'dotenv'


const server = express()

dotenv.config()

server.use(cors())
server.use(express.json())
server.use(express.urlencoded({ extended: false }));
server.use('/api', routes)

server.use((req: Request, res: Response) => {
  res.status(404).json({ error: 'Something goes wrong. Please contact our support.' });
});

const errorHandler: ErrorRequestHandler = (err, req, res) => {
  res.status(400).json({ error: 'Something goes wrong. Please contact our support.' });
}
server.use(errorHandler);

server.listen(process.env.PORT, () => { console.log(`Server running on port ${process.env.PORT}`) });


export default server