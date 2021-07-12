const {
    resolve
} = require("path");

module.exports = function (grunt) {

    const fs = require("fs");
    const path = require("path");
    const rollup = require("rollup");

    const inputFileName = "vextension-web.js";

    const srcFolder = path.resolve(`${ __dirname }/../../src`);

    const read = function (fileName) {
        return grunt.file.read(`${ srcFolder }/${ fileName }`);
    };

    const wrapper = read("wrapper.js").split("\/\/ @CODE");

    const inputRollupOptions = {
        input: `${ srcFolder }/vextension-web.js`
    };

    const outputRollupOptions = {
        format: "esm",
        intro: wrapper[0].replace(/\n*$/, ""),
        outro: wrapper[1].replace(/^\n*/, "")
    };

    const fileOverrides = new Map();

    function getOverride(filePath) {
        return fileOverrides.get(path.resolve(filePath));
    }

    function setOverride(filePath, source) {
        fileOverrides.set(path.resolve(filePath), source);
    }

    grunt.registerMultiTask('build', 'Build Vextension-Web,', async function () {

        grunt.log.writeln("Starting Vextension-Web run build...\n");
        const done = this.async();

        try {

            let name = grunt.option("filename");
            let version = grunt.config("pkg.version");
            let included = this.data.included

            name = name ? `dist/${ name }` : this.data.dest;


            setOverride(inputRollupOptions.input, read(inputFileName).replace('export default vextension;', "\n"));
            if (included.length) {
                setOverride(inputRollupOptions.input, getOverride(inputRollupOptions.input) + included.map(module => `import "./${module}.js";`).join("\n"));
            }

            const bundle = await rollup.rollup({
                ...inputRollupOptions,
                plugins: [{
                    name: "vexension-file-overrides",
                    load(id) {
                        if (fileOverrides.has(id)) {
                            return fileOverrides.get(id);
                        }
                        return null;
                    }
                }]
            });

            const {
                output: [{
                    code
                }]
            } = await bundle.generate(outputRollupOptions);

            const ocmpiled = code.replace(/@VERSION/g, version)

            grunt.file.write(name, ocmpiled);
            grunt.log.ok(`File '${ name }' created.`);

            done();

        } catch (error) {
            done(error);
        }
    })
}