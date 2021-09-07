import { getPermutations, permutations, fade, lerp, grad3, dot3 } from "./common";
import { Noise3d } from "./interface";

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

		const g000 = grad3[gi000];
		const g001 = grad3[gi001];
		const g010 = grad3[gi010];
		const g011 = grad3[gi011];
		const g100 = grad3[gi100];
		const g101 = grad3[gi101];
		const g110 = grad3[gi110];
		const g111 = grad3[gi111];

		const n000 = dot3(g000, [xd-0, yd-0, zd-0]);
		const n001 = dot3(g001, [xd-0, yd-0, zd-1]);
		const n010 = dot3(g010, [xd-0, yd-1, zd-0]);
		const n011 = dot3(g011, [xd-0, yd-1, zd-1]);
		const n100 = dot3(g100, [xd-1, yd-0, zd-0]);
		const n101 = dot3(g101, [xd-1, yd-0, zd-1]);
		const n110 = dot3(g110, [xd-1, yd-1, zd-0]);
		const n111 = dot3(g111, [xd-1, yd-1, zd-1]);

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