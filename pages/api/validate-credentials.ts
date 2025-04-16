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

  // ✅ Log full incoming request info
  console.log('[validate-credentials] Request headers:', req.headers);
  console.log('[validate-credentials] Request body:', req.body);

  const { cloud_name, api_key, api_secret } = req.body;

  if (!cloud_name || !api_key || !api_secret) {
    console.warn('[validate-credentials] Missing one or more credentials in req.body');
    return res.status(400).json({ error: 'Missing Cloudinary credentials' });
  }

  // ✅ Log masked credential preview
  console.log('[validate-credentials] Using credentials:', {
    cloud_name,
    api_key,
    api_secret_preview: api_secret.slice(0, 4) + '***',
  });

  try {
    const cloudinary = configureCloudinary(cloud_name, api_key, api_secret);

    // ✅ Config status
    console.log('[validate-credentials] Cloudinary configured. Fetching folders...');

    const folderRes = await cloudinary.api.root_folders();

    console.log('[validate-credentials] Folders fetched:', folderRes.folders.length);

    // @ts-expect-error: metadata_fields is not typed in cloudinary SDK but is valid
    const metadataFields = await cloudinary.api.metadata_fields();

    console.log('[validate-credentials] Metadata fields fetched:', metadataFields.length);

    return res.status(200).json({
      success: true,
      folders: folderRes.folders,
      metadataFields,
    });
  } catch (err) {
    const error = err as Error;

    // ✅ Log error for Vercel logs
    console.error('[validate-credentials] Error fetching from Cloudinary:', error.message);

    return res.status(401).json({
      error: 'Invalid Cloudinary credentials',
      details: error.message,
    });
  }
}
