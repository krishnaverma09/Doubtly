const Doubt = require("../models/Doubt");
const uploadToCloudinary = require("../utils/uploadToCloudinary");

// @desc    Student raises a doubt
// @route   POST /api/doubts
// @access  Student only (JWT)
  exports.createDoubt = async (req, res) => {
  try {
    if (req.user.role !== "student") {
      return res.status(403).json({ message: "Only students can raise doubts" });
    }

    const { title, subject, description } = req.body;

    let media = [];

    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const type = file.mimetype.startsWith("image")
          ? "image"
          : file.mimetype.startsWith("audio")
          ? "audio"
          : "video";

        const resourceType = type === "image" ? "image" : "video";

        const result = await uploadToCloudinary(
          file.buffer,
          "doubtly/doubts",
          resourceType
        );

        media.push({
          url: result.secure_url,
          mediaType: type,
        });
      }
    }

    const doubt = await Doubt.create({
      title,
      subject,
      description,
      student: req.user.id,
      media,
    });

    res.status(201).json(doubt);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get doubts (everyone sees all doubts)
// @route   GET /api/doubts
// @access  Protected
exports.getDoubts = async (req, res) => {
  try {
    // Everyone sees all doubts now
    const doubts = await Doubt.find()
      .populate("student", "name email")
      .populate("answers.teacher", "name email")
      .sort({ createdAt: -1 });

    // Ensure status is consistent with answer existence (handles legacy data)
    const processedDoubts = doubts.map(doubt => {
      const d = doubt.toObject();
      if ((!d.answers || d.answers.length === 0) && d.status === 'answered') {
        d.status = 'open';
      }
      return d;
    });

    res.json(processedDoubts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Teacher answers a doubt
// @route   PATCH /api/doubts/:id/answer
// @access  Teacher only
exports.answerDoubt = async (req, res) => {
  try {
    if (req.user.role !== "teacher") {
      return res.status(403).json({ message: "Only teachers can answer doubts" });
    }

    const doubt = await Doubt.findById(req.params.id);
    if (!doubt) {
      return res.status(404).json({ message: "Doubt not found" });
    }

    // Check if teacher has already answered
    const alreadyAnswered = doubt.answers.find(
      (a) => a.teacher.toString() === req.user.id
    );
    if (alreadyAnswered) {
      return res.status(400).json({ message: "You have already answered this doubt" });
    }

    let answerMedia = [];

    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const type = file.mimetype.startsWith("image")
          ? "image"
          : file.mimetype.startsWith("audio")
          ? "audio"
          : "video";

        const resourceType = type === "image" ? "image" : "video";

        const result = await uploadToCloudinary(
          file.buffer,
          "doubtly/answers",
          resourceType
        );

        answerMedia.push({
          url: result.secure_url,
          mediaType: type,
        });
      }
    }

    doubt.answers.push({
      text: req.body.answer,
      media: answerMedia,
      teacher: req.user.id,
    });
    
    doubt.status = "answered";

    await doubt.save();
    res.json(doubt);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Toggle upvote on a doubt
// @route   PUT /api/doubts/:id/upvote
// @access  Protected
exports.toggleUpvote = async (req, res) => {
  try {
    const doubt = await Doubt.findById(req.params.id);

    if (!doubt) {
      return res.status(404).json({ message: "Doubt not found" });
    }

    // Check if doubt has already been upvoted by this user
    if (doubt.upvotes.includes(req.user.id)) {
      // Remove upvote
      doubt.upvotes = doubt.upvotes.filter(
        (id) => id.toString() !== req.user.id
      );
    } else {
      // Add upvote
      doubt.upvotes.push(req.user.id);
    }

    await doubt.save();
    res.json(doubt.upvotes); // Return updated upvotes array
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a doubt (student only, before answer)
exports.updateDoubt = async (req, res) => {
  const { title, subject, description } = req.body;

  const doubt = await Doubt.findById(req.params.id);

  if (!doubt) {
    return res.status(404).json({ message: "Doubt not found" });
  }

  // Ownership check
  if (doubt.student.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: "Not authorized" });
  }

  // Cannot edit after answered
  if (doubt.status !== "open") {
    return res.status(400).json({ message: "Cannot edit answered doubt" });
  }

  doubt.title = title || doubt.title;
  doubt.subject = subject || doubt.subject;
  doubt.description = description || doubt.description;

  const updated = await doubt.save();
  res.json(updated);
};

// @desc    Delete a doubt (student only, before answer)
exports.deleteDoubt = async (req, res) => {
  const doubt = await Doubt.findById(req.params.id);

  if (!doubt) {
    return res.status(404).json({ message: "Doubt not found" });
  }

  if (doubt.student.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: "Not authorized" });
  }

  if (doubt.status !== "open") {
    return res.status(400).json({ message: "Cannot delete answered doubt" });
  }

  await doubt.deleteOne();
  res.json({ message: "Doubt deleted successfully" });
};

// @desc    Edit answer (teacher only)
exports.editAnswer = async (req, res) => {
  const { answer } = req.body;

  const doubt = await Doubt.findById(req.params.id);

  if (!doubt) {
    return res.status(404).json({ message: "Doubt not found" });
  }

  const answerIndex = doubt.answers.findIndex(
    (a) => a.teacher.toString() === req.user._id.toString()
  );

  if (answerIndex === -1) {
    return res.status(404).json({ message: "Your answer not found" });
  }

  doubt.answers[answerIndex].text = answer;
  await doubt.save();

  res.json(doubt);
};

// @desc    Delete answer (teacher only)
exports.deleteAnswer = async (req, res) => {
  const doubt = await Doubt.findById(req.params.id);

  if (!doubt) {
    return res.status(404).json({ message: "Doubt not found" });
  }

  const initialLength = doubt.answers.length;
  doubt.answers = doubt.answers.filter(
    (a) => a.teacher.toString() !== req.user._id.toString()
  );

  if (doubt.answers.length === initialLength) {
    return res.status(404).json({ message: "Your answer not found" });
  }

  if (doubt.answers.length === 0) {
    doubt.status = "open";
  }

  await doubt.save();

  res.json({ message: "Answer deleted" });
};
