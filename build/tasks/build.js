/**
 * Vextension-Web | Copyright (C) 2021 | vironlab.eu
 * Licensed under the MIT License
 *
 * ___    _______                        ______         ______
 * __ |  / /___(_)______________ _______ ___  / ______ ____  /_
 * __ | / / __  / __  ___/_  __ \__  __ \__  /  _  __ `/__  __ \
 * __ |/ /  _  /  _  /    / /_/ /_  / / /_  /___/ /_/ / _  /_/ /
 * _____/   /_/   /_/     \____/ /_/ /_/ /_____/\__,_/  /_.___/
 *
 * ____  _______     _______ _     ___  ____  __  __ _____ _   _ _____
 * |  _ \| ____\ \   / / ____| |   / _ \|  _ \|  \/  | ____| \ | |_   _|
 * | | | |  _|  \ \ / /|  _| | |  | | | | |_) | |\/| |  _| |  \| | | |
 * | |_| | |___  \ V / | |___| |__| |_| |  __/| |  | | |___| |\  | | |
 * |____/|_____|  \_/  |_____|_____\___/|_|   |_|  |_|_____|_| \_| |_|
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
 * IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
 * CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
 * TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
 * SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 *
 * You should have received a copy of the MIT License
 *
 * Contact:
 *
 * Discordserver:   https://discord.gg/wvcX92VyEH
 * Website:         https://vironlab.eu/
 * Mail:            contact@vironlab.eu
 *
 */

const { resolve } = require('path');

module.exports = function (grunt) {
    const fs = require('fs');
    const path = require('path');
    const rollup = require('rollup');

    const inputFileName = 'vextension-web.js';

    const srcFolder = path.resolve(`${__dirname}/../../src`);

    const read = function (fileName) {
        return grunt.file.read(`${srcFolder}/${fileName}`);
    };

    const wrapper = read('wrapper.js').split('// @CODE');

    const inputRollupOptions = {
        input: `${srcFolder}/vextension-web.js`,
    };

    const outputRollupOptions = {
        format: 'esm',
        intro: wrapper[0].replace(/\n*$/, ''),
        outro: wrapper[1].replace(/^\n*/, ''),
    };

    const fileOverrides = new Map();

    function getOverride(filePath) {
        return fileOverrides.get(path.resolve(filePath));
    }

    function setOverride(filePath, source) {
        fileOverrides.set(path.resolve(filePath), source);
    }

    grunt.registerMultiTask('build', 'Build Vextension-Web,', async function () {
        grunt.log.writeln('Starting Vextension-Web run build...\n');
        const done = this.async();

        try {
            let name = grunt.option('filename');
            let version = grunt.config('pkg.version');
            let included = this.data.included;

            name = name ? `dist/${name}` : this.data.dest;

            setOverride(inputRollupOptions.input, read(inputFileName).replace('export default vextension;', '').replace('export var $ = vextension;', '\n'));

            if (included.length) {
                setOverride(inputRollupOptions.input, getOverride(inputRollupOptions.input) + included.map((module) => `import "./${module}.js";`).join('\n'));
            }

            const bundle = await rollup.rollup({
                ...inputRollupOptions,
                plugins: [
                    {
                        name: 'vexension-file-overrides',
                        load(id) {
                            if (fileOverrides.has(id)) {
                                return fileOverrides.get(id);
                            }
                            return null;
                        },
                    },
                ],
            });

            const {
                output: [{ code }],
            } = await bundle.generate(outputRollupOptions);

            const ocmpiled = code.replace(/@VERSION/g, version);

            grunt.file.write(name, ocmpiled);
            grunt.log.ok(`File '${name}' created.`);

            done();
        } catch (error) {
            done(error);
        }
    });
};
