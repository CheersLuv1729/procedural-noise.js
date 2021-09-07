import { getPermutations, permutations, dot2, grad3, dot3 } from "./common";
import { Noise2d, Noise3d } from "./interface";

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