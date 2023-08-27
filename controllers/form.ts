import express from 'express';
import crypto from 'crypto';
import path from 'path';
import { asyncWrapper } from '../middleware/async'
import Form from '../models/Form';
import multer from 'multer';
import { GridFsStorage } from 'multer-gridfs-storage';
const storage = new GridFsStorage({
  url: process.env.MONGO_URI!, // The database connection url
  file: (req, file) => {
    try {
      return new Promise((resolve, reject) => {
        // Generating a random name for the file using crypto module
        crypto.randomBytes(16, (err, buf) => {
          if (err) {
            return reject(err);
          }
          // Setting the file name and extension using path module
          const filename = buf.toString('hex') + path.extname(file.originalname);
          // Returning the file information
          const fileInfo = {
            filename: filename,
            bucketName: 'files' // The GridFS bucket name
          };
          resolve(fileInfo);
        });
      });
    } catch (error) {
      console.log(error)
    }

  }
});

// Creating a multer middleware with the storage engine
export const upload = multer({ storage });

// Connecting to the MongoDB database

// Creating a post route for the endpoint
export const formDataSubmit = asyncWrapper(async (req: any, res: any) => {
  // Getting the form data from the request body and files
  const { createdBy, name, languages, email, phone, address, geolocationStatus } = req.body;
  console.log(req.body)
  const files = req.files;
  const { userId } = req.user
  // Creating an array of file ids from GridFS
  const fileIds = files?.map((file: any) => ({
    id: file.id,
    name: file.originalname
  }));


  // Creating a new document with the form data and file ids
  try {
    const user = await Form.findOne({ createdBy: userId })
    console.log("non created ran")
    if (!user) {
      console.log("not user ran")
      const formData = new Form({
        createdBy: userId,
        $push: {
          forms: {
            name: name,
            email: email,
            phone: phone,
            address: address,
            files: fileIds,
            languages: languages,
            geolocationStatus: geolocationStatus
          }
        }
      }
      );
      await formData.save();
      res.status(201).json({ message: 'Form data saved successfully' });
    }
    const newForm = await Form.findOneAndUpdate({ createdBy: userId }, {
      $push: {
        forms: {
          name: name,
          email: email,
          phone: phone,
          address: address,
          files: fileIds,
          languages: languages,
          geolocationStatus: geolocationStatus
        }
      }
    })
    // Saving the document to the database 
    res.status(201).json({ message: 'Form data saved successfully' });
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'An error occurred while saving form data' });
  }
});
export const getForms = asyncWrapper(async (req: any, res: any) => {
  try {
    const { userId } = req.user

    const userForms = await Form.findOne({ createdBy: userId })
    res.status(200).json(userForms?.forms)
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'An error occurred while retrieving form data' });
  }
})