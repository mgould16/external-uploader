import type { NextApiRequest, NextApiResponse } from 'next';
import { randomUUID } from 'crypto';

type Config = {
  id: string;
  createdAt: string;
  cloudName: string;
  apiKey: string;
  apiSecret: string;
  folder: string;
  fields: { external_id: string; required: boolean }[];
};

const configs: Record<string, Config> = {}; // TEMP store (resets on each deploy)

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { cloudName, apiKey, apiSecret, folder, fields } = req.body;

  if (!cloudName || !apiKey || !apiSecret || !folder || !Array.isArray(fields)) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const id = randomUUID();
  const newConfig: Config = {
    id,
    createdAt: new Date().toISOString(),
    cloudName,
    apiKey,
    apiSecret,
    folder,
    fields,
  };

  configs[id] = newConfig;

  console.log('[Uploader Config] Created:', newConfig);

  return res.status(200).json({ success: true, id });
}
