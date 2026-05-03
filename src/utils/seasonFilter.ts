/**
 * Generates a regex pattern that matches common season notations in torrent names.
 *
 * For season 1:  matches "s01", "S01", "season 1", "season.1", "season1"
 * For season 12: matches "s12", "S12", "season 12", "season.12", "season12"
 *
 * The pattern uses word boundary on the left and a lookahead for non-digit on the right
 * (or end-of-string) so "s01" doesn't match inside "s012" but does match at end-of-string
 * or before a non-digit like "s01e05".
 */
export function buildSeasonRegex(season: number): string {
	const padded = String(season).padStart(2, '0');
	const raw = String(season);

	// s01 / S01 style — most common in torrent names
	const sXX = `[sS]${padded}`;

	// "season 1", "season.1", "season1" style (case-insensitive handled by caller)
	// Use the raw (unpadded) number since "season.01" is rare vs "season.1"
	const seasonWord = `[sS]eason.?${raw}`;

	// Combine with alternation; require non-digit after (or end) to avoid s01 matching s012
	return `(?:${sXX}|${seasonWord})(?![0-9])`;
}
