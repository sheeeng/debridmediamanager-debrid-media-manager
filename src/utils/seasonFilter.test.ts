import { describe, expect, it } from 'vitest';
import { buildSeasonRegex } from './seasonFilter';

describe('buildSeasonRegex', () => {
	it('matches s01 notation for season 1', () => {
		const pattern = buildSeasonRegex(1);
		const re = new RegExp(pattern, 'i');
		expect(re.test('Show.Name.S01E01.1080p')).toBe(true);
		expect(re.test('Show.Name.s01e05.720p')).toBe(true);
		expect(re.test('Show.Name.S01.COMPLETE')).toBe(true);
	});

	it('matches season word variants for season 1', () => {
		const pattern = buildSeasonRegex(1);
		const re = new RegExp(pattern, 'i');
		expect(re.test('Show Name Season 1 Complete')).toBe(true);
		expect(re.test('Show.Name.Season.1.1080p')).toBe(true);
		expect(re.test('Show.Name.Season1.Pack')).toBe(true);
	});

	it('does not match other seasons', () => {
		const pattern = buildSeasonRegex(1);
		const re = new RegExp(pattern, 'i');
		expect(re.test('Show.Name.S02E01.1080p')).toBe(false);
		expect(re.test('Show Name Season 2 Complete')).toBe(false);
		expect(re.test('Show.Name.S11E01.1080p')).toBe(false);
	});

	it('does not match s01 inside s012', () => {
		const pattern = buildSeasonRegex(1);
		const re = new RegExp(pattern, 'i');
		expect(re.test('S012')).toBe(false);
	});

	it('handles double-digit seasons', () => {
		const pattern = buildSeasonRegex(12);
		const re = new RegExp(pattern, 'i');
		expect(re.test('Show.Name.S12E01.1080p')).toBe(true);
		expect(re.test('Show Name Season 12 Complete')).toBe(true);
		expect(re.test('Show.Name.Season.12.1080p')).toBe(true);
		expect(re.test('Show.Name.S12.COMPLETE')).toBe(true);
	});

	it('does not match season 1 when looking for season 12', () => {
		const pattern = buildSeasonRegex(12);
		const re = new RegExp(pattern, 'i');
		expect(re.test('Show.Name.S01E12.1080p')).toBe(false);
		expect(re.test('Show Name Season 1 Complete')).toBe(false);
	});

	it('does not match season 12 inside season 123', () => {
		const pattern = buildSeasonRegex(12);
		const re = new RegExp(pattern, 'i');
		expect(re.test('S123')).toBe(false);
		expect(re.test('Season 123')).toBe(false);
	});

	it('handles season 0 (specials)', () => {
		const pattern = buildSeasonRegex(0);
		const re = new RegExp(pattern, 'i');
		expect(re.test('Show.Name.S00E01')).toBe(true);
		expect(re.test('Show Name Season 0')).toBe(true);
	});

	it('matches s01 at end of string', () => {
		const pattern = buildSeasonRegex(1);
		const re = new RegExp(pattern, 'i');
		expect(re.test('Show.Name.S01')).toBe(true);
	});

	it('matches s01 before episode marker', () => {
		const pattern = buildSeasonRegex(3);
		const re = new RegExp(pattern, 'i');
		expect(re.test('Show.S03E10.720p')).toBe(true);
	});
});
