import typescript from 'rollup-plugin-typescript';
import replace from 'rollup-plugin-replace'
// import babel   from 'rollup-plugin-babel'
// import uglify from 'rollup-plugin-uglify';

const pkg = require('./package.json');

export default {
    entry: './src/main/index.ts',
    plugins: [
        typescript({
            typescript: require('typescript')
        }),
        replace({
            '@VERSION@': pkg.version
        })
        // babel(),
        // uglify()
    ],
    globals: {
        // 'jquery': 'jQuery'
    },
    external: Object.keys(pkg.dependencies),
    targets: [
        {
            dest: './dist/index.js',
            // format: 'iife',
            format: 'umd',
            moduleName: 'veng',
            sourceMap: true
        },
        {
            dest: './dist/lib/index.js',
            format: 'es',
            sourceMap: true
        }
    ]
}
