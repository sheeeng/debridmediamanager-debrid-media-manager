import { repository as db } from '@/services/repository';
import { NextApiRequest, NextApiResponse } from 'next';

export async function validateDmmApiKeyHeader(
	req: NextApiRequest,
	res: NextApiResponse
): Promise<boolean> {
	const apiKey = req.headers['x-api-key'];
	if (!apiKey || typeof apiKey !== 'string') {
		res.status(401).json({ error: 'Missing x-api-key header' });
		return false;
	}

	const isValid = await db.validateDmmApiKey(apiKey);
	if (!isValid) {
		res.status(401).json({ error: 'Invalid API key' });
		return false;
	}

	return true;
}
