# procedural-noise.js

procedural-noise.js is a collection of noise generators and utilities written in TypeScript.

### ⚠️ This library is a work in progress 
This means:
- Breaking changes might be made at any time
- Features and improvements may be slow or nonexistant

I'm currently attending university full time and will work on this library when I can. If you have any issues, suggestions, or any other feedback feel free to leave them on the [Issue tracker](https://github.com/CheersLuv1729/procedural-noise.js/issues), I'll address them when I can.
## Usage
```typescript
import {Perlin3d, Simplex2d} from  "procedural-noise"

const seed = Date.now();

const simplex2 = Simplex2d(seed);
const perlin3 = Perlin3d(seed);

for(let i = 0; i < 8; i++){
	for(let j = 0; j < 8; j++){
		const val = simplex2(i, j);
		console.log(val);
	}
}
  
for(let i = 0; i < 4; i++){
	for(let j = 0; j < 4; j++){
		for(let k = 0; k < 4; k++){
			// For demonstration purposes
			// Perlin noise will always return 0s at integer coordinates
			const val = perlin3(i, j, k);
			console.log(val);
		}
	}
}
```
