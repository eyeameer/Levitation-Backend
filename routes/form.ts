import express from 'express'
import { upload } from '../controllers/form'
export const formRouter=express.Router()
import { formDataSubmit,getForms } from '../controllers/form'
formRouter.post('/formSubmit',upload.array('files'), formDataSubmit as any)
formRouter.get('/getForms', getForms as any)