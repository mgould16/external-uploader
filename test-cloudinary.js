// test-cloudinary.js
const { v2: cloudinary } = require('cloudinary');

cloudinary.config({
  cloud_name: 'dam-fashion',
  api_key: '848884815566778',
  api_secret: 'fGmskB4IgoWyhHcAiot2z_fVn0Q',
});

cloudinary.api.root_folders()
  .then((res) => console.log('Folders:', res))
  .catch((err) => console.error('Error:', err));
