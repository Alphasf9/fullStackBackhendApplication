// usable code for any file,video or pdf anything 

import { v2 as cloudinary } from 'cloudinary' // as rename v2

import fs from 'fs' //fs--> file system by default in nodejs


cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});


const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null
        //upload the file on cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, { // print response
            resource_type: "auto"
        });
        // console.log("Cloudinary response url-->", " ", response); // study this data
        // file has been uploaded successfully
        console.log('file is uploaded on Cloudinary successfully', response.url);
        // fs.unlinkSync(localFilePath); // after succesffully upload file will be removed from cloudinary
        fs.unlinkSync(localFilePath);
        return response
    } catch (error) {
        fs.unlinkSync(localFilePath) // remove the locally save temporary file as the operation got rejected
        return null;
    }
}


export { uploadOnCloudinary }