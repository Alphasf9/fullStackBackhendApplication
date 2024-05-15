import { Router } from "express";
import {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
} from "../controllers/playlist.controller.js";
import { upload } from "../middlewares/multer.middleware.js"


import { verifyJWT } from "../middlewares/auth.middleware.js"
const router = Router();

router.use(verifyJWT);

router.route("/")
    .post(upload.fields([
        {
            name: "videos",
            maxCount: 1,
        }
    ]),
        createPlaylist
    )

router
    .route("/:playlistById")
    .get(getPlaylistById)
    .patch(updatePlaylist)
    .delete(deletePlaylist)

router.route("/add/:videoId/:playlistId").patch(addVideoToPlaylist);
router.route("/remove/:videId/:playlistId").patch(removeVideoFromPlaylist);

router.route("/user/:userId").get(getUserPlaylists);

