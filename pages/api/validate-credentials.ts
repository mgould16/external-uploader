import type { NextApiRequest, NextApiResponse } from 'next';
import { configureCloudinary } from '@/lib/cloudinary';

type Folder = {
  name: string;
  path: string;
};

type MetadataField = {
  external_id: string;
  label: string;
  type: string;
};

type SuccessResponse = {
  success: true;
  folders: Folder[];
  metadataFields: MetadataField[];
};

type ErrorResponse = {
  error: string;
  details?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SuccessResponse | ErrorResponse>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { cloud_name, api_key, api_secret } = req.body;

  if (!cloud_name || !api_key || !api_secret) {
    return res.status(400).json({ error: 'Missing Cloudinary credentials' });
  }

  try {
    const cloudinary = configureCloudinary(cloud_name, api_key, api_secret);

    const folderRes = await cloudinary.api.root_folders();
    const metadataFields = await cloudinary.api.metadata_fields();

    return res.status(200).json({
      success: true,
      folders: folderRes.folders,
      metadataFields,
    });
  } catch (err) {
    const error = err as Error;
    return res.status(401).json({
      error: 'Invalid Cloudinary credentials',
      details: error.message,
    });
  }
}
