import { MT19937 } from "./mersenne_twister";


export const grad3 : [number, number, number][] = [
	[1,1,0], [-1,1,0], [1,-1,0], [-1,-1,0],
	[1,0,1], [-1,0,1], [1,0,-1], [-1,0,-1],
	[0,1,1], [0,-1,1], [0,1,-1], [0,-1,-1],
];

export const grad4 : [number, number, number, number][] = [
	[0,1,1,1], [0,1,1,-1], [0,1,-1,1], [0,1,-1,-1], [0,-1,1,1], [0,-1,1,-1], [0,-1,-1,1], [0,-1,-1,-1],
	[1,0,1,1], [1,0,1,-1], [1,0,-1,1], [1,0,-1,-1],	[-1,0,1,1], [-1,0,1,-1], [-1,0,-1,1], [-1,0,-1,-1],
	[1,1,0,1], [1,1,0,-1], [1,-1,0,1], [1,-1,0,-1],	[-1,1,0,1], [-1,1,0,-1], [-1,-1,0,1], [-1,-1,0,-1],
	[1,1,1,0], [1,1,-1,0], [1,-1,1,0], [1,-1,-1,0],	[-1,1,1,0], [-1,1,-1,0], [-1,-1,1,0], [-1,-1,-1,0],
];

export const permutations = [
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

export const simplex: [number, number, number, number][] =  [
    [0,1,2,3],[0,1,3,2],[0,0,0,0],[0,2,3,1],[0,0,0,0],[0,0,0,0],[0,0,0,0],[1,2,3,0],
    [0,2,1,3],[0,0,0,0],[0,3,1,2],[0,3,2,1],[0,0,0,0],[0,0,0,0],[0,0,0,0],[1,3,2,0],
    [0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],
    [1,2,0,3],[0,0,0,0],[1,3,0,2],[0,0,0,0],[0,0,0,0],[0,0,0,0],[2,3,0,1],[2,3,1,0],
    [1,0,2,3],[1,0,3,2],[0,0,0,0],[0,0,0,0],[0,0,0,0],[2,0,3,1],[0,0,0,0],[2,1,3,0],
    [0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],
    [2,0,1,3],[0,0,0,0],[0,0,0,0],[0,0,0,0],[3,0,1,2],[3,0,2,1],[0,0,0,0],[3,1,2,0],
    [2,1,0,3],[0,0,0,0],[0,0,0,0],[0,0,0,0],[3,1,0,2],[0,0,0,0],[3,2,0,1],[3,2,1,0]
];

export function dot2(a: [number, number, ...number[]], b: [number, number, ...number[]]){
	return a[0] * b[0] + a[1] * b[1];
}

export function dot3(a: [number, number, number, ...number[]], b: [number, number, number, ...number[]]){
	return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
}

export function dot4(a: [number, number, number, number, ...number[]], b: [number, number, number, number, ...number[]]){
	return a[0] * b[0] + a[1] * b[1] + a[2] * b[2] + a[3] * b[3];
}

export function lerp(a: number, b: number, t: number){
	return (1-t)*a + t*b;
}

export function fade(t: number){
	// 6t^5 - 15t^4 + 10t^3
	return t * t * t * (t * (t*6 - 15) + 10);
}

export function getPermutations(seed: number, length: number = 256){
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