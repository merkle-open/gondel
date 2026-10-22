import { addGondelPluginEventListener } from '@gondel/core';
import { getCurrentViewport, initMediaQueriesPlugin, VIEWPORT_ENTERED } from '../src/index';

jest.mock('@gondel/core', () => ({
	addGondelPluginEventListener: jest.fn(),
	getComponentByDomNode: jest.fn(() => mockComponent),
}));

const mockComponent = {
	_componentName: 'Test',
	handleViewport: jest.fn(),
	handleMedium: jest.fn(),
};

function mockMatchMedia(initialWidth: number) {
	let width = initialWidth;
	const queries: Array<{ list: MediaQueryList; listeners: Array<() => void> }> = [];
	function evaluate(query: string) {
		const match = /^(not all and )?\(max-width: ([\d.]+)(px|em)\)$/.exec(query);
		if (!match) {
			throw new Error(`Unexpected media query: ${query}`);
		}
		const maximum = Number(match[2]) * (match[3] === 'em' ? 16 : 1);
		return match[1] ? width > maximum : width <= maximum;
	}
	window.matchMedia = jest.fn((query: string) => {
		const listeners: Array<() => void> = [];
		const list: MediaQueryList = {
			media: query,
			matches: evaluate(query),
			onchange: null,
			addListener: (listener) => {
				if (listener) {
					listeners.push(() =>
						listener.call(
							list,
							Object.assign(new Event('change'), { matches: list.matches, media: query }),
						),
					);
				}
			},
			removeListener: jest.fn(),
			addEventListener: jest.fn(),
			removeEventListener: jest.fn(),
			dispatchEvent: jest.fn(),
		};
		queries.push({ list, listeners });
		return list;
	});
	return (nextWidth: number) => {
		width = nextWidth;
		const changed = queries.filter(({ list }) => {
			const matches = evaluate(list.media);
			const previous = list.matches;
			Object.defineProperty(list, 'matches', { value: matches, configurable: true });
			return previous !== matches;
		});
		changed.forEach(({ listeners }) => listeners.forEach((listener) => listener()));
	};
}

function registerViewportEvents() {
	document.body.innerHTML = '<div data-g-name="Test"></div>';
	const register = jest.mocked(addGondelPluginEventListener).mock.calls[0][2];
	const resolve = jest.fn();
	register(
		true,
		{
			eventName: VIEWPORT_ENTERED,
			namespace: 'g',
			eventRegistry: {
				Test: {
					'': [{ handlerName: 'handleViewport' }],
					medium: [{ handlerName: 'handleMedium' }],
				},
			},
		},
		resolve,
	);
	expect(resolve).toHaveBeenCalledWith(false);
}

beforeEach(() => {
	jest.clearAllMocks();
	mockComponent.handleViewport.mockReset();
	mockComponent.handleMedium.mockReset();
	document.body.innerHTML = '';
});

describe.each(['px', 'em'] as const)('maximum breakpoints in %s', (unit) => {
	const factor = unit === 'em' ? 16 : 1;
	const breakPoints = { large: Infinity, medium: 48, small: 30 };

	it.each([
		[0, 'small'],
		[29.999, 'small'],
		[30, 'small'],
		[30.001, 'medium'],
		[30.5, 'medium'],
		[48, 'medium'],
		[48.001, 'large'],
	])('initializes at width %s as %s', (width, expected) => {
		mockMatchMedia(Number(width) * factor);
		initMediaQueriesPlugin({ breakPoints, unit });
		expect(getCurrentViewport()).toBe(expected);
	});

	it('tracks fractional crossings in both directions without gaps or duplicate events', () => {
		const resize = mockMatchMedia(30 * factor);
		initMediaQueriesPlugin({ breakPoints, unit });
		registerViewportEvents();
		const seen: string[] = [];
		mockComponent.handleViewport.mockImplementation(({ viewport }: { viewport: string }) => {
			expect(getCurrentViewport()).toBe(viewport);
			seen.push(viewport);
		});

		for (const [width, expected] of [
			[30.001, 'medium'],
			[30.5, 'medium'],
			[48, 'medium'],
			[48.001, 'large'],
			[48, 'medium'],
			[30.001, 'medium'],
			[30, 'small'],
			[60, 'large'],
			[0, 'small'],
		] as const) {
			resize(width * factor);
			expect(getCurrentViewport()).toBe(expected);
		}
		expect(seen).toEqual(['medium', 'large', 'medium', 'small', 'large', 'small']);
		expect(mockComponent.handleMedium).toHaveBeenCalledTimes(2);
	});

	it('updates the helper without registered component listeners', () => {
		const resize = mockMatchMedia(30 * factor);
		initMediaQueriesPlugin({ breakPoints, unit });
		resize(30.001 * factor);
		expect(getCurrentViewport()).toBe('medium');
		resize(48.001 * factor);
		expect(getCurrentViewport()).toBe('large');
		resize(30 * factor);
		expect(getCurrentViewport()).toBe('small');
	});
});

it('handles a zero maximum without a truthiness check', () => {
	const resize = mockMatchMedia(0);
	initMediaQueriesPlugin({ breakPoints: { zero: 0, rest: Infinity } });
	expect(getCurrentViewport()).toBe('zero');
	resize(0.001);
	expect(getCurrentViewport()).toBe('rest');
	resize(0);
	expect(getCurrentViewport()).toBe('zero');
});

it('preserves the error for an unbounded smallest viewport', () => {
	mockMatchMedia(100);
	expect(() => initMediaQueriesPlugin({ breakPoints: { only: Infinity } })).toThrow(
		'The smallest provided viewport must not be set to Infinity',
	);
});
