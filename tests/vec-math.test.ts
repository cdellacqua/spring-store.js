import {expect} from 'chai';
import {add, norm, scale, sub} from '../src/lib/vec-math';

describe('typed arrays operations', () => {
	it('adds two Float32Array objects returning a new object', () => {
		const a = new Float32Array([1, 2, 3]);
		const b = new Float32Array([4, 5, 6]);
		const actual = add(a, b, true);
		const expected = new Float32Array([5, 7, 9]);
		expect(actual).to.eqls(expected);
		expect(a).to.eqls(new Float32Array([1, 2, 3]));
		expect(b).to.eqls(new Float32Array([4, 5, 6]));
	});
	it('adds two Float32Array objects mutating the first object', () => {
		const a = new Float32Array([1, 2, 3]);
		const b = new Float32Array([4, 5, 6]);
		const actual = add(a, b, false);
		const expected = new Float32Array([5, 7, 9]);
		expect(actual).to.eqls(expected);
		expect(a).to.eqls(expected);
		expect(b).to.eqls(new Float32Array([4, 5, 6]));
	});
	it('subtracts two Float32Array objects returning a new object', () => {
		const a = new Float32Array([1, 2, 3]);
		const b = new Float32Array([5, 4, 0]);
		const actual = sub(a, b, true);
		const expected = new Float32Array([-4, -2, 3]);
		expect(actual).to.eqls(expected);
		expect(a).to.eqls(new Float32Array([1, 2, 3]));
		expect(b).to.eqls(new Float32Array([5, 4, 0]));
	});
	it('subtracts two Float32Array objects mutating the first object', () => {
		const a = new Float32Array([1, 2, 3]);
		const b = new Float32Array([5, 4, 0]);
		const actual = sub(a, b, false);
		const expected = new Float32Array([-4, -2, 3]);
		expect(actual).to.eqls(expected);
		expect(a).to.eqls(expected);
		expect(b).to.eqls(new Float32Array([5, 4, 0]));
	});
	it('multiplies a Float32Array with a scalar returning a new array', () => {
		const a = new Float32Array([1, 2, 3]);
		const b = 0.5;
		const actual = scale(a, b, true);
		const expected = new Float32Array([0.5, 1, 1.5]);
		expect(actual).to.eqls(expected);
		expect(a).to.eqls(new Float32Array([1, 2, 3]));
	});
	it('multiplies a Float32Array with a scalar mutating the array', () => {
		const a = new Float32Array([1, 2, 3]);
		const b = 0.5;
		const actual = scale(a, b, false);
		const expected = new Float32Array([0.5, 1, 1.5]);
		expect(actual).to.eqls(expected);
		expect(a).to.eqls(expected);
	});
	it('computes the norm of a Float32Array', () => {
		const a = new Float32Array([1, 2, 3]);
		const actual = norm(a);
		const expected = Math.sqrt(
			new Float32Array([1, 2, 3]).reduce((sum, cur) => (sum += cur * cur), 0),
		);
		expect(actual).to.eqls(expected);
		expect(a).to.eqls(new Float32Array([1, 2, 3]));
	});
});
