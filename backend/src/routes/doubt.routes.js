const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/auth.middleware");
const {
  createDoubt,
  getDoubts,
  answerDoubt,
  toggleUpvote,
  updateDoubt,
  deleteDoubt,
  editAnswer,
  deleteAnswer,
} = require("../controllers/doubt.controller");

const upload = require("../middleware/multer");

router.post("/", protect, upload.array("media"), createDoubt);
router.get("/", protect, getDoubts);
router.put("/:id/upvote", protect, toggleUpvote);
router.put("/:id/answer", protect, upload.array("media"), answerDoubt);
router.put("/:id", protect, updateDoubt);
router.delete("/:id", protect, deleteDoubt);
router.put("/:id/answer/edit", protect, editAnswer);
router.delete("/:id/answer", protect, deleteAnswer);

module.exports = router;
