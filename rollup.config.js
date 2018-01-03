import babel from 'rollup-plugin-babel';
import babelrc from 'babelrc-rollup';
import nodeResolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';

// const pkg = require('./package.json');
//const external = Object.keys(pkg.dependencies);

export default {
	entry: 'src/index.js',
	plugins: [
		babel(babelrc()),
		nodeResolve(),
		commonjs()
	],
	//external,
	targets: [{
		dest: 'dist/index.js',
		format: 'cjs',
		sourceMap: true
	}, {
		dest: 'dist/index.mjs',
		format: 'es',
		sourceMap: true
	}]
};

