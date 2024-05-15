import { Router } from 'express';
import {
    createTweet,
    deleteTweet,
    getUserTweets,
    updateTweet,
} from "../controllers/tweet.controllers.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"
import { upload } from "../middlewares/multer.middleware.js"

const router = Router();


router
    .route("/")
    .get(getUserTweets)
    .post(createTweet)
    .post(upload.fields(
        [
            {
                name: "profiePhoto",
                maxCount: 1
            }
        ]
    ))

router.use(verifyJWT); 

router.route("/").post(createTweet);
router.route("/user/:userId").get(getUserTweets);
router.route("/:tweetId").patch(updateTweet).delete(deleteTweet);

export default router