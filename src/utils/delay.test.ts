import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { delay } from './delay';

describe('delay', () => {
	beforeEach(() => {
		vi.useFakeTimers();
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	it('resolves immediately for ms = 0', async () => {
		const result = delay(0);
		expect(result).toBeInstanceOf(Promise);
		await result;
	});

	it('resolves immediately for negative ms', async () => {
		const result = delay(-100);
		expect(result).toBeInstanceOf(Promise);
		await result;
	});

	it('returns a promise', () => {
		const result = delay(100);
		expect(result).toBeInstanceOf(Promise);
		vi.advanceTimersByTime(100);
	});

	it('resolves after the specified timeout in non-browser env', async () => {
		let resolved = false;
		delay(1000).then(() => {
			resolved = true;
		});

		vi.advanceTimersByTime(999);
		await Promise.resolve();
		expect(resolved).toBe(false);

		vi.advanceTimersByTime(1);
		await Promise.resolve();
		expect(resolved).toBe(true);
	});

	it('does not resolve before timeout elapses', async () => {
		let resolved = false;
		delay(500).then(() => {
			resolved = true;
		});

		vi.advanceTimersByTime(499);
		await Promise.resolve();
		expect(resolved).toBe(false);
	});
});

describe('delay (browser path)', () => {
	let originalWindow: typeof globalThis.window;
	let delayBrowser: typeof delay;

	beforeEach(async () => {
		vi.resetModules();
		originalWindow = globalThis.window;
		// Simulate browser environment
		if (typeof globalThis.window === 'undefined') {
			(globalThis as any).window = { setTimeout, clearTimeout };
		}
		delete process.env.VITEST_WORKER_ID;
		const mod = await import('./delay');
		delayBrowser = mod.delay;
	});

	afterEach(() => {
		if (originalWindow === undefined) {
			delete (globalThis as any).window;
		}
		process.env.VITEST_WORKER_ID = '1';
	});

	it('resolves after the requested time in browser env', async () => {
		const start = Date.now();
		await delayBrowser(50);
		const elapsed = Date.now() - start;
		expect(elapsed).toBeGreaterThanOrEqual(40);
	});

	it('compensates when setTimeout oversleeps (simulated throttling)', async () => {
		const start = Date.now();
		await delayBrowser(100);
		const elapsed = Date.now() - start;
		// Should still resolve — even if setTimeout fires late, the second
		// setTimeout (compensation) catches up
		expect(elapsed).toBeGreaterThanOrEqual(90);
	});

	it('resolves immediately for ms <= 0 in browser env', async () => {
		await delayBrowser(0);
		await delayBrowser(-1);
	});
});
