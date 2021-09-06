import { Noise3d } from "./interface";
import { MT19937 } from "./mersenne_twister";

const gradients : [number, number, number][] = [
	[1,1,0], [-1,1,0], [1,-1,0], [-1,-1,0],
	[1,0,1], [-1,0,1], [1,0,-1], [-1,0,-1],
	[0,1,1], [0,-1,1], [0,1,-1], [0,-1,-1],
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

function dot(a: [number, number, number], b: [number, number, number]){
	return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
}

function lerp(a: number, b: number, t: number){
	return (1-t)*a + t*b;
}

function fade(t: number){
	// 6t^5 - 15t^4 + 10t^3
	return t * t * t * (t * (t*6 - 15) + 10);
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

export function Perlin3d(seed?: number) : Noise3d{

	const perms = (seed != undefined) ? getPermutations(seed) : permutations;

	function p(i: number): number{
		return perms[i & 255];
	}

	return function(x: number, y: number, z: number): number{

		// x, y, z, integers parts
		const xi = Math.floor(x);
		const yi = Math.floor(y);
		const zi = Math.floor(z);

		// x, y, z, decimal parts
		const xd = x - xi;
		const yd = y - yi;
		const zd = z - zi;

		// x, y, z, fade
		const xf = fade(xd);
		const yf = fade(yd);
		const zf = fade(zd);

		const gi000 = p(xi+0 + p(yi+0 + p(zi+0))) % 12;
		const gi001 = p(xi+0 + p(yi+0 + p(zi+1))) % 12;
		const gi010 = p(xi+0 + p(yi+1 + p(zi+0))) % 12;
		const gi011 = p(xi+0 + p(yi+1 + p(zi+1))) % 12;
		const gi100 = p(xi+1 + p(yi+0 + p(zi+0))) % 12;
		const gi101 = p(xi+1 + p(yi+0 + p(zi+1))) % 12;
		const gi110 = p(xi+1 + p(yi+1 + p(zi+0))) % 12;
		const gi111 = p(xi+1 + p(yi+1 + p(zi+1))) % 12;

		const g000 = gradients[gi000];
		const g001 = gradients[gi001];
		const g010 = gradients[gi010];
		const g011 = gradients[gi011];
		const g100 = gradients[gi100];
		const g101 = gradients[gi101];
		const g110 = gradients[gi110];
		const g111 = gradients[gi111];

		const n000 = dot(g000, [xd-0, yd-0, zd-0]);
		const n001 = dot(g001, [xd-0, yd-0, zd-1]);
		const n010 = dot(g010, [xd-0, yd-1, zd-0]);
		const n011 = dot(g011, [xd-0, yd-1, zd-1]);
		const n100 = dot(g100, [xd-1, yd-0, zd-0]);
		const n101 = dot(g101, [xd-1, yd-0, zd-1]);
		const n110 = dot(g110, [xd-1, yd-1, zd-0]);
		const n111 = dot(g111, [xd-1, yd-1, zd-1]);

		const nx00 = lerp(n000, n100, xf);
		const nx01 = lerp(n001, n101, xf);
		const nx10 = lerp(n010, n110, xf);
		const nx11 = lerp(n011, n111, xf);

		const nxy0 = lerp(nx00, nx10, yf);
		const nxy1 = lerp(nx01, nx11, yf);

		const nxyz = lerp(nxy0, nxy1, zf);

		return nxyz;
	};
}