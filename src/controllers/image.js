'use strict';

const imageService = require('../service/image');
const path = require('path');
const fs = require('fs');

/**
 * @api {get} /api/images Get Image Files
 * @apiName GetImageFiles
 * @apiGroup Images
 * @apiVersion 1.0.0
 *
 * @apiDescription Retrieves all image files from the specified directory and returns them as base64 encoded strings along with their names.
 *
 * @apiSuccess {String[]} imageBuffers Array of base64 encoded image data.
 * @apiSuccess {String[]} imageNames Array of names of the retrieved image files.
 *
 */
exports.getImageFiles = async (ctx) => {
  try {
    const imagesPath = 'images';
    const imageFiles = await imageService.getImageFiles(imagesPath);
    const imageBuffers = [];
    const imageNames = [];

    for (const file of imageFiles) {
      const filePath = path.join(imagesPath, file);
      const buffer = fs.readFileSync(filePath);
      const base64 = buffer.toString('base64');
      imageNames.push(file);
      imageBuffers.push(base64);
    }

    ctx.body = { imageBuffers, imageNames };
  } catch (error) {
    console.error('Failed to retrieve and send images:', error);
    ctx.status = 500;
    ctx.body = 'Failed to retrieve images';
  }
};
