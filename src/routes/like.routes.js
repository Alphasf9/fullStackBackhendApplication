import { Router } from 'express'

import {
    getLikedVideos,
    togggleTweetLike,
    toggleCommentLike,
    toggleVideoLike
} from "../controllers/like.controller.js"

import { verifyJWT } from "../middlewares/auth.middleware.js"

const router = Router();


router.use(verifyJWT);


router.route("/toggle/v/:videoId").post(toggleVideoLike);
router.route("/toggle/c/commentId").post(toggleCommentLike);
router.route("toggle/t/tweetId").post(togggleTweetLike);

router.route("/videos").get(getLikedVideos);

export default router;