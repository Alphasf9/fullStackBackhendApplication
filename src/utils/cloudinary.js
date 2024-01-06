// usable code fro any file,video or pdf anything

import { v2 as cloudinary } from 'cloudinary' // as rename v2

import fs from 'fs' //fs--> file system by default in nodejs

import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});


const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null
        //upload the file on cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, { // print reposne
            resource_type: "auto"
        })
        console.log(response);
        // file has been uploaded successfully
        console.log('file is uploaded successfully', response.url);
        return response
    } catch (error) {
        fs.unlinkSync(localFilePath) // remove the locally save temporary file as the operation got rejected
        return null;
    }
}


export { uploadOnCloudinary }