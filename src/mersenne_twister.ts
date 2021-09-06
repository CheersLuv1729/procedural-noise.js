

export function MT19937(seed: number){

	// This code is adapted from the example pseudo code presented on wikipedia
	// https://en.wikipedia.org/wiki/Mersenne_Twister

	const [n, m, a] = [624, 397, 0x9908B0DF];
	const f = 1812433253;
	const [u, d] = [11, 0xFFFFFFFF];
	const [s, b] = [ 7, 0x9D2C5680];
	const [t, c] = [15, 0xEFC60000];
	const l = 18;

	const UPPER = 0x80000000;
	const LOWER = 0x7FFFFFFF;

	let mt = new Array<number>(n);
	let index = n+1;

	seed_mt(seed);

	function seed_mt(s: number){
		mt[0] = s >>> 0;
    	for (index = 1; index < n; index++) {
			// This is functionally equivalent to the below snippet from wikipedia
			// MT[i] := lowest w bits of (f * (MT[i-1] xor (MT[i-1] >> (w-2))) + i)
			//
			// JavaScript bit shifting operates on 32-bit integers, whereas the example uses 64-bits
			// Therefore the number has to be split up into smaller parts as to not be truncated when
			// multiplied by f
			const mask = 0xffff;
			const s = mt[index - 1] ^ (mt[index-1] >>> 30);
			mt[index] = ((((s >> 16 & mask) * f) << 16) + (s & mask) * f + index) >>> 0;
    	}
	}

	function twist(){
		for(let i = 0; i < n; i++){
			const x = (mt[i] & UPPER) + (mt[(i+1) % n] & LOWER);
			let xA = x >>> 1;
			if(x % 2) xA ^= a;
			mt[i] = mt[(i+m) % n] ^ xA;
		}
		index = 0;
	}

	return function extract_number(){
		if(index >= n){
			if(index > n){
				const val = 5489;
				console.warn(`Mersenne Twister Generator was never seeded! Seeding with constant value ${val}`);
				seed_mt(val);
			}
			twist();
		}

		let y = mt[index++];
		y ^= (y >>> u) & d;
		y ^= (y << s) & b;
		y ^= (y << t) & c;
		y ^= (y >>> l);

		return y >>> 0;
	}
}