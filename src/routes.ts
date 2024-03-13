import { Router } from "express"
import * as Onfido from './controllers/onfido'

const routes = Router()

routes.post('/createUser', Onfido.createUser)
routes.post('/getSDKToken', Onfido.getSDKToken)
routes.post('/getWorkflowRunId', Onfido.getWorkflowRunId)
routes.get('/getMotionFrame', Onfido.getMotionFrame)
routes.post('/deleteUser', Onfido.deleteUser)


export default routes