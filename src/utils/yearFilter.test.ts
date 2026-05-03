import { describe, expect, it } from 'vitest';
import { buildYearRegex } from './yearFilter';

describe('buildYearRegex', () => {
	it('returns exact year with word boundaries for tolerance 0', () => {
		expect(buildYearRegex(2014, 0)).toBe('\\b2014\\b');
	});

	it('returns alternation for tolerance 1', () => {
		const pattern = buildYearRegex(2014, 1);
		expect(pattern).toBe('\\b(2013|2014|2015)\\b');
		const re = new RegExp(pattern);
		expect(re.test('2013')).toBe(true);
		expect(re.test('2014')).toBe(true);
		expect(re.test('2015')).toBe(true);
		expect(re.test('2012')).toBe(false);
		expect(re.test('2016')).toBe(false);
	});

	it('returns alternation for tolerance 2', () => {
		const pattern = buildYearRegex(2014, 2);
		expect(pattern).toBe('\\b(2012|2013|2014|2015|2016)\\b');
		const re = new RegExp(pattern);
		expect(re.test('2012')).toBe(true);
		expect(re.test('2016')).toBe(true);
		expect(re.test('2011')).toBe(false);
		expect(re.test('2017')).toBe(false);
	});

	it('handles decade boundary (2019 ±1)', () => {
		const pattern = buildYearRegex(2019, 1);
		expect(pattern).toBe('\\b(2018|2019|2020)\\b');
		const re = new RegExp(pattern);
		expect(re.test('2018')).toBe(true);
		expect(re.test('2020')).toBe(true);
	});

	it('handles century boundary (2000 ±1)', () => {
		const pattern = buildYearRegex(2000, 1);
		expect(pattern).toBe('\\b(1999|2000|2001)\\b');
		const re = new RegExp(pattern);
		expect(re.test('1999')).toBe(true);
		expect(re.test('2001')).toBe(true);
	});

	it('does not match year embedded in longer number', () => {
		const pattern = buildYearRegex(2014, 0);
		const re = new RegExp(pattern);
		expect(re.test('x2014x')).toBe(false);
		expect(re.test('12014')).toBe(false);
		expect(re.test('20140')).toBe(false);
	});

	it('matches year within a torrent title', () => {
		const pattern = buildYearRegex(2014, 1);
		const re = new RegExp(pattern, 'i');
		expect(re.test('Movie.Name.2013.1080p.BluRay')).toBe(true);
		expect(re.test('Movie.Name.2015.720p')).toBe(true);
		expect(re.test('Movie.Name.2016.720p')).toBe(false);
	});
});
