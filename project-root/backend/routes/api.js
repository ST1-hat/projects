const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { ProfilePicture } = require('../models');

// Configure Multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '..', '..', 'frontend', 'images'));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Upload Profile Picture
router.post('/profile-pic', upload.single('profilePic'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const { filename, originalname, mimetype, path: filePath, size } = req.file;

    const newProfilePic = await ProfilePicture.create({
      filename,
      originalName: originalname,
      mimeType: mimetype,
      path: filePath,
      size
    });

    // Construct URL based on how app.js serves static files
    // app.js serves /images from ../frontend/images
    const fileUrl = `/images/${filename}`;

    res.json({ success: true, url: fileUrl, data: newProfilePic });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Failed to upload profile picture' });
  }
});

// Get Latest Profile Picture
router.get('/profile-pic', async (req, res) => {
  try {
    const latestPic = await ProfilePicture.findOne({
      order: [['createdAt', 'DESC']]
    });

    if (latestPic) {
      const fileUrl = `/images/${latestPic.filename}`;
      res.json({ success: true, url: fileUrl });
    } else {
      res.json({ success: false, message: 'No profile picture found' });
    }
  } catch (error) {
    console.error('Fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch profile picture' });
  }
});

router.get('/status', (req, res) => {
  res.json({ status: 'API is running' });
});

module.exports = router;
