import express from "express";
import { getUserProfile } from "../controllers/user.controller.js";
import { followUnfollowUser } from "../controllers/user.controller.js";
import { getSuggestedUsers } from "../controllers/user.controller.js";
import { updateUser } from "../controllers/user.controller.js";
import { protectRoute } from "../middleware/protectRoute.js";
import { searchUsers } from "../controllers/user.controller.js";

const router = express.Router();

router.get('/profile/:username' , protectRoute , getUserProfile);
router.get('/search/:query', protectRoute, searchUsers);
router.get('/suggested' , protectRoute , getSuggestedUsers);
router.post('/follow/:id' , protectRoute , followUnfollowUser);
router.patch('/update' , protectRoute , updateUser);

export default router;

