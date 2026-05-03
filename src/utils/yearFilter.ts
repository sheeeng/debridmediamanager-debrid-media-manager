/**
 * Generates a regex pattern that matches any year in [year - tolerance, year + tolerance].
 * The pattern is wrapped in word boundaries so "2014" doesn't match inside "12014".
 *
 * Examples (year=2014):
 *   tolerance 0 → "\\b2014\\b"
 *   tolerance 1 → "\\b(2013|2014|2015)\\b"
 *   tolerance 2 → "\\b(2012|2013|2014|2015|2016)\\b"
 */
export function buildYearRegex(year: number, tolerance: number): string {
	if (tolerance === 0) return `\\b${year}\\b`;

	const years: number[] = [];
	for (let y = year - tolerance; y <= year + tolerance; y++) {
		years.push(y);
	}
	return `\\b(${years.join('|')})\\b`;
}
