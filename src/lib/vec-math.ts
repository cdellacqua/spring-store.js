/**
 * Add two Float32Array, element by element.
 * @param vMut the first operand, which may be mutated (see last parameter).
 * @param other the second operand.
 * @param copy if true this function will not mutate the first operand, returning a new Float32Array as the result of the operation.
 * If false, this function will mutate the first operand, hopefully improving performance by recycling already allocated space.
 * @returns a Float32Array.
 */
export function add(
	vMut: Float32Array,
	other: Float32Array,
	copy: boolean,
): Float32Array {
	const target = copy ? new Float32Array(vMut) : vMut;
	for (let i = 0; i < vMut.length; i++) {
		target[i] = vMut[i] + other[i];
	}
	return target;
}
/**
 * Subtract two Float32Array, element by element.
 * @param vMut the first operand, which may be mutated (see last parameter).
 * @param other the second operand.
 * @param copy if true this function will not mutate the first operand, returning a new Float32Array as the result of the operation.
 * If false, this function will mutate the first operand, hopefully improving performance by recycling already allocated space.
 * @returns a Float32Array.
 */
export function sub(
	vMut: Float32Array,
	other: Float32Array,
	copy: boolean,
): Float32Array {
	const target = copy ? new Float32Array(vMut) : vMut;
	for (let i = 0; i < vMut.length; i++) {
		target[i] = vMut[i] - other[i];
	}
	return target;
}
/**
 * Scale each element of a Float32Array by a factor of k.
 * @param vMut the first operand, which may be mutated (see last parameter).
 * @param k the scaling factor.
 * @param copy if true this function will not mutate the first operand, returning a new Float32Array as the result of the operation.
 * If false, this function will mutate the first operand, hopefully improving performance by recycling already allocated space.
 * @returns a Float32Array.
 */
export function scale(
	vMut: Float32Array,
	k: number,
	copy: boolean,
): Float32Array {
	const target = copy ? new Float32Array(vMut) : vMut;
	for (let i = 0; i < vMut.length; i++) {
		target[i] = vMut[i] * k;
	}
	return target;
}
/**
 * Compute the norm of a Float32Array.
 * @param v the Float32Array of which the norm will be computed.
 * @returns a number.
 */
export function norm(v: Float32Array): number {
	let sumOfSquares = 0;
	for (let i = 0; i < v.length; i++) {
		sumOfSquares += v[i] * v[i];
	}
	return Math.sqrt(sumOfSquares);
}
