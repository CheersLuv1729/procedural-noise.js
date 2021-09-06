import { Noise2d, Noise3d } from "./interface";
import { MT19937 } from "./mersenne_twister";

// TODO:
// These are direct copies from the perlin impl
// Maybe organise them into a common file

const grad3 : [number, number, number][] = [
	[1,1,0], [-1,1,0], [1,-1,0], [-1,-1,0],
	[1,0,1], [-1,0,1], [1,0,-1], [-1,0,-1],
	[0,1,1], [0,-1,1], [0,1,-1], [0,-1,-1],
];

const grad4 : [number, number, number, number][] = [
	[0,1,1,1], [0,1,1,-1], [0,1,-1,1], [0,1,-1,-1], [0,-1,1,1], [0,-1,1,-1], [0,-1,-1,1], [0,-1,-1,-1],
	[1,0,1,1], [1,0,1,-1], [1,0,-1,1], [1,0,-1,-1],	[-1,0,1,1], [-1,0,1,-1], [-1,0,-1,1], [-1,0,-1,-1],
	[1,1,0,1], [1,1,0,-1], [1,-1,0,1], [1,-1,0,-1],	[-1,1,0,1], [-1,1,0,-1], [-1,-1,0,1], [-1,-1,0,-1],
	[1,1,1,0], [1,1,-1,0], [1,-1,1,0], [1,-1,-1,0],	[-1,1,1,0], [-1,1,-1,0], [-1,-1,1,0], [-1,-1,-1,0],
];

const permutations = [
	151,160,137,91,90,15,131,13,201,95,96,53,194,233,7,225,
	140,36,103,30,69,142,8,99,37,240,21,10,23,190,6,148,
	247,120,234,75,0,26,197,62,94,252,219,203,117,35,11,32,
	57,177,33,88,237,149,56,87,174,20,125,136,171,168,68,175,
	74,165,71,134,139,48,27,166,77,146,158,231,83,111,229,122,
	60,211,133,230,220,105,92,41,55,46,245,40,244,102,143,54,
	65,25,63,161,1,216,80,73,209,76,132,187,208,89,18,169,
	200,196,135,130,116,188,159,86,164,100,109,198,173,186,3,64,
	52,217,226,250,124,123,5,202,38,147,118,126,255,82,85,212,
	207,206,59,227,47,16,58,17,182,189,28,42,223,183,170,213,
	119,248,152,2,44,154,163,70,221,153,101,155,167,43,172,9,
	129,22,39,253,19,98,108,110,79,113,224,232,178,185,112,104,
	218,246,97,228,251,34,242,193,238,210,144,12,191,179,162,241,
	81,51,145,235,249,14,239,107,49,192,214,31,181,199,106,157,
	184,84,204,176,115,121,50,45,127,4,150,254,138,236,205,93,
	222,114,67,29,24,72,243,141,128,195,78,66,215,61,156,180
];

const simplex: [number, number, number, number][] =  [
    [0,1,2,3],[0,1,3,2],[0,0,0,0],[0,2,3,1],[0,0,0,0],[0,0,0,0],[0,0,0,0],[1,2,3,0],
    [0,2,1,3],[0,0,0,0],[0,3,1,2],[0,3,2,1],[0,0,0,0],[0,0,0,0],[0,0,0,0],[1,3,2,0],
    [0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],
    [1,2,0,3],[0,0,0,0],[1,3,0,2],[0,0,0,0],[0,0,0,0],[0,0,0,0],[2,3,0,1],[2,3,1,0],
    [1,0,2,3],[1,0,3,2],[0,0,0,0],[0,0,0,0],[0,0,0,0],[2,0,3,1],[0,0,0,0],[2,1,3,0],
    [0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],
    [2,0,1,3],[0,0,0,0],[0,0,0,0],[0,0,0,0],[3,0,1,2],[3,0,2,1],[0,0,0,0],[3,1,2,0],
    [2,1,0,3],[0,0,0,0],[0,0,0,0],[0,0,0,0],[3,1,0,2],[0,0,0,0],[3,2,0,1],[3,2,1,0]
];




function dot2(a: [number, number, ...number[]], b: [number, number, ...number[]]){
	return a[0] * b[0] + a[1] * b[1];
}

function dot3(a: [number, number, number, ...number[]], b: [number, number, number, ...number[]]){
	return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
}

function dot4(a: [number, number, number, number, ...number[]], b: [number, number, number, number, ...number[]]){
	return a[0] * b[0] + a[1] * b[1] + a[2] * b[2] + a[3] * b[3];
}

function getPermutations(seed: number, length: number = 256){
	const rand = MT19937(seed);
	const perms = new Array<number>(length);
	for(let i = 0; i < 256; i++){
		perms[i] = i;
	}
	for(let i = 0; i < perms.length; i++){
		const index = Math.floor(rand() % perms.length);
		[perms[i], perms[index]] = [perms[index], perms[i]];
	}
	return perms;
}

export function Simplex2d(seed?: number) : Noise2d{
	
	const perms = (seed != undefined) ? getPermutations(seed) : permutations;

	function p(i: number): number{
		return perms[i & 255];
	}

	return function(xin: number, yin: number): number{

		let n0, n1, n2;
		
		const F2 = (Math.sqrt(3)-1)/2;
		const s = (xin + yin) * F2;
		
		const i = Math.floor(xin + s);
		const j = Math.floor(yin + s);
		
		const G2 = (3-Math.sqrt(3))/6;
		const t = (i+j) * G2;

		const xi = i-t;
		const yi = j-t;
		const x0 = xin-xi;
		const y0 = yin-yi;

		const [i1, j1] = x0>y0 ? [1, 0] : [0, 1];

		const x1 = x0 - i1 + G2;
		const y1 = y0 - j1 + G2;
		const x2 = x0 - 1 + G2 * 2;
		const y2 = y0 - 1 + G2 * 2;

		const gi0 = p(i + p(j)) % 12;
		const gi1 = p(i + i1 + p(j + j1)) % 12;
		const gi2 = p(i + 1 + p(j + 1)) % 12;

		let t0 = 0.5 - x0*x0 - y0*y0;
		if(t0 < 0){
			n0 = 0;
		}else{
			t0 *= t0;
			n0 = t0 * t0 * dot2(grad3[gi0], [x0, y0]);
		}

		let t1 = 0.5 - x1*x1 - y1*y1;
		if(t1 < 0){
			n1 = 0;
		}else{
			t1 *= t1;
			n1 = t1 * t1 * dot2(grad3[gi1], [x1, y1]);
		}

		let t2 = 0.5 - x2*x2 - y2*y2;
		if(t2 < 0){
			n2 = 0;
		}else{
			t2 *= t2;
			n2 = t2 * t2 * dot2(grad3[gi2], [x2, y2]);
		}

		return 70 * (n0 + n1 + n2);
	}
}

export function Simplex3d(seed?: number) : Noise3d{

	const perms = (seed != undefined) ? getPermutations(seed) : permutations;

	function p(i: number): number{
		return perms[i & 255];
	}

	return function(xin: number, yin: number, zin: number): number{

		let n0, n1, n2, n3;
		
		const F3 = 1/3;
		const s = (xin + yin + zin) * F3;
		
		const i = Math.floor(xin + s);
		const j = Math.floor(yin + s);
		const k = Math.floor(zin + s);
		

		const G3 = 1/6;
		const t = (i+j+k) * G3;

		const xi = i-t;
		const yi = j-t;
		const zi = k-t;
		const x0 = xin-xi;
		const y0 = yin-yi;
		const z0 = zin-zi;

		let i1, j1, k1;
		let i2, j2, k2;

		if(x0 >= y0){
			if(y0 >= z0)     [i1, j1, k1, i2, j2, k2] = [1, 0, 0, 1, 1, 0];
			else if(x0 > z0) [i1, j1, k1, i2, j2, k2] = [1, 0, 0, 1, 0, 1];
			else             [i1, j1, k1, i2, j2, k2] = [0, 0, 1, 1, 0, 1];
		}else{
			if(y0 < z0)      [i1, j1, k1, i2, j2, k2] = [0, 0, 1, 0, 1, 1];
			else if(x0 < z0) [i1, j1, k1, i2, j2, k2] = [0, 1, 0, 0, 1, 1];
			else             [i1, j1, k1, i2, j2, k2] = [0, 1, 0, 1, 1, 0];
		}

		const x1 = x0 - i1 + G3;
		const y1 = y0 - j1 + G3;
		const z1 = z0 - k1 + G3;
		const x2 = x0 - i2 + G3 * 2;
		const y2 = y0 - j2 + G3 * 2;
		const z2 = y0 - k2 + G3 * 2;
		const x3 = x0 - 1 + G3 * 3;
		const y3 = y0 - 1 + G3 * 3;
		const z3 = z0 - 1 + G3 * 3;

		const gi0 = p(i + p(j + p(k))) % 12;
		const gi1 = p(i + i1 + p(j + j1 + p(k + k1))) % 12;
		const gi2 = p(i + i2 + p(j + j2 + p(k + k2))) % 12;
		const gi3 = p(i +  1 + p(j +  1 + p(k +  1))) % 12;

		let t0 = 0.5 - x0*x0 - y0*y0 - z0*z0;
		if(t0 < 0){
			n0 = 0;
		}else{
			t0 *= t0;
			n0 = t0 * t0 * dot3(grad3[gi0], [x0, y0, z0]);
		}

		let t1 = 0.5 - x1*x1 - y1*y1 - z1*z1;
		if(t1 < 0){
			n1 = 0;
		}else{
			t1 *= t1;
			n1 = t1 * t1 * dot3(grad3[gi1], [x1, y1, z1]);
		}

		let t2 = 0.5 - x2*x2 - y2*y2 - z2*z2;
		if(t2 < 0){
			n2 = 0;
		}else{
			t2 *= t2;
			n2 = t2 * t2 * dot3(grad3[gi2], [x2, y2, z2]);
		}

		let t3 = 0.5 - x3*x3 - y3*y3 - z3*z3;
		if(t3 < 0){
			n3 = 0;
		}else{
			t3 *= t3;
			n3 = t3 * t3 * dot3(grad3[gi3], [x3, y3, z3]);
		}

		return 32 * (n0 + n1 + n2 + n3);
	}
}