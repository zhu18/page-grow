// zhu18 at 2023.1.29
//import buble from 'rollup-plugin-buble';
//import rollup  from 'rollup';
import { rollup } from "rollup";
import { eslint } from "rollup-plugin-eslint"; // eslint
import terser  from '@rollup/plugin-terser';// 压缩
import typescript  from '@rollup/plugin-typescript';// ts转js
import nodeResolve  from '@rollup/plugin-node-resolve';// 解析node_modules第三方以来关系
import commonjs  from '@rollup/plugin-commonjs';// cjs
import filesize  from 'rollup-plugin-filesize'; // 报告：大小
import progress  from 'rollup-plugin-progress';// 展示打包进度
import {visualizer}  from 'rollup-plugin-visualizer'; //报告：统计

export default {
		input: 'src/index.ts',
		plugins: [
			nodeResolve({
				mainFields: ['module', 'main'],
			}),
			// commonjs(),
			// eslint({
			//   throwOnError: true,
			//   throwOnWarning: true,
			// }),
			typescript(),
			// terser({
			// 	output: {
			// 	  comments: /@preserve|@license|@cc_on/i
			// 	}
			//   }),
			filesize(),
			progress({
			  clearLine: false
			}),
			// visualizer({
			//   filename: './dist/report.html',
			// }),
		],
	//	external: ['axios','lodash.merge','dtc','gsap','hotkeys-js','howler','crypto-js','upng-js', 'xlsx', 'lodash-es'],
		output: [
			{
				format: 'cjs',
				file: './dist/index.cjs.js',
				indent: '\t',
			},
			{
				format: 'esm',
				file: './dist/index.esm.js',
				indent: '\t',
			}
		]
}
