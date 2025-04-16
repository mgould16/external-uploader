import type { NextApiRequest, NextApiResponse } from 'next';
import { configureCloudinary } from '@/lib/cloudinary';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  const { cloud_name, api_key, api_secret } = req.body;

  if (!cloud_name || !api_key || !api_secret) {
    return res.status(400).json({ error: 'Missing credentials' });
  }

  try {
    const cloudinary = configureCloudinary(cloud_name, api_key, api_secret);

    // Test auth and get folders
    const folders = await cloudinary.api.root_folders();

    // 🔥 Get all SMD fields
    const metadataFields = await cloudinary.api.metadata_fields();

    return res.status(200).json({
      success: true,
      folders,
      metadataFields,
    });
  } catch (err: any) {
    return res.status(401).json({
      error: 'Invalid Cloudinary credentials',
      details: err.message,
    });
  }
}
