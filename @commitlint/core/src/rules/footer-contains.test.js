import test from 'ava';
import parse from '../library/parse';
import footerContains from './footer-contains';

const messages = {
	empty: 'foo(bar): baz',
	matched: 'chore: subject\nBREAKING CHANGE: something important',
	matchedAlt:
		'chore: subject\n\nsomething something fixed that issue\n\ncloses #1',
	unmatched: 'foo(bar): baz\n\nbody\n\nPROJEKT-001'
};

const parsed = {
	empty: parse(messages.empty),
	matched: parse(messages.matched),
	matchedAlt: parse(messages.matchedAlt),
	unmatched: parse(messages.unmatched)
};

test('footer-contains with no footer should not succeed', async t => {
	const [actual] = footerContains(await parsed.empty, 'always', /qux$/gi);
	const expected = false;
	t.deepEqual(actual, expected);
});

test('footer-contains with matching footer should succeed', async t => {
	const [actual] = footerContains(
		await parsed.matched,
		'always',
		/important$/gi
	);
	const expected = true;
	t.deepEqual(actual, expected);
});

test('footer-contains with alternate matching footer should succeed', async t => {
	const [actual] = footerContains(
		await parsed.matchedAlt,
		'always',
		/Closes #\d+$/gi
	);
	const expected = true;
	t.deepEqual(actual, expected);
});

test('footer-contains with non-matching footer should not succeed', async t => {
	const [actual] = footerContains(await parsed.unmatched, 'always', /qux$/gi);
	const expected = false;
	t.deepEqual(actual, expected);
});
