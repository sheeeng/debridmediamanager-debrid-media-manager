import { getMetadataCache } from '@/services/metadataCache';
import { RATE_LIMIT_CONFIGS, withIpRateLimit } from '@/services/rateLimit/withRateLimit';
import { NextApiHandler } from 'next';
import { validateDmmApiKeyHeader } from './auth';

const handler: NextApiHandler = async (req, res) => {
	if (req.method !== 'POST') {
		return res.status(405).json({ error: 'Method not allowed' });
	}

	if (!(await validateDmmApiKeyHeader(req, res))) return;

	const { tmdbId, mediaType } = req.body;

	if (!tmdbId) {
		return res.status(400).json({ error: 'Missing tmdbId' });
	}

	if (mediaType !== 'movie' && mediaType !== 'tv') {
		return res.status(400).json({ error: 'mediaType must be "movie" or "tv"' });
	}

	try {
		const metadataCache = getMetadataCache();
		const externalIds = await metadataCache.getTmdbExternalIds(tmdbId, mediaType);
		const imdbId = externalIds?.imdb_id || null;

		return res.status(200).json({
			imdbId,
			tmdbId: String(tmdbId),
			mediaType,
		});
	} catch (error) {
		console.error('Error resolving TMDB ID:', error);
		return res.status(500).json({
			error: 'Failed to resolve TMDB ID',
			details: error instanceof Error ? error.message : 'Unknown error',
		});
	}
};

export default withIpRateLimit(handler, RATE_LIMIT_CONFIGS.default);
