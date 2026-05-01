import { DatabaseClient } from './client';

export class DmmApiKeysService extends DatabaseClient {
	public async validateApiKey(apiKey: string): Promise<boolean> {
		const key = await this.prisma.dmmApiKeys.findUnique({
			where: { apiKey },
		});
		return key !== null;
	}
}
