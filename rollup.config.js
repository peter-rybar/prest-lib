import typescript from 'rollup-plugin-typescript';
import replace from 'rollup-plugin-replace'
// import babel   from 'rollup-plugin-babel'
// import es2015 from 'babel-preset-es2015-rollup';
import uglify from 'rollup-plugin-uglify';
import {minify} from 'uglify-js';

const pkg = require('./package.json');

export default {
    entry: './src/main/main.ts',
    plugins: [
        typescript({
            typescript: require('typescript')
        }),
        replace({
            '@VERSION@': pkg.version
        }),
        // babel({
        //     presets: [es2015]
        // }),
        uglify({}, minify)
    ],
    globals: {
        // 'jquery': 'jQuery'
    },
    external: Object.keys(pkg.dependencies),
    targets: [
        // {
        //     dest: './dist/umd/' + pkg.name + '.js',
        //     format: 'es',
        //     sourceMap: true
        // },
        {
            dest: './dist/umd/' + pkg.name + '.js',
            // format: 'iife',
            format: 'umd',
            moduleName: 'veng',
            sourceMap: true
        }
    ]
}
