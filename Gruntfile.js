/**
 *   Vextension-Web | Copyright © 2021 | vironlab.eu | All Rights Reserved.
 *      ___    _______                        ______         ______
 *      __ |  / /___(_)______________ _______ ___  / ______ ____  /_
 *      __ | / / __  / __  ___/_  __ \__  __ \__  /  _  __ '/__  __ \
 *      __ |/ /  _  /  _  /    / /_/ /_  / / /_  /___/ /_/ / _  /_/ /
 *      _____/   /_/   /_/     \____/ /_/ /_/ /_____/\__,_/  /_.___/
 *    ____  _______     _______ _     ___  ____  __  __ _____ _   _ _____
 *   |  _ \| ____\ \   / / ____| |   / _ \|  _ \|  \/  | ____| \ | |_   _|
 *   | | | |  _|  \ \ / /|  _| | |  | | | | |_) | |\/| |  _| |  \| | | |
 *   | |_| | |___  \ V / | |___| |__| |_| |  __/| |  | | |___| |\  | | |
 *   |____/|_____|  \_/  |_____|_____\___/|_|   |_|  |_|_____|_| \_| |_|
 *
 *   This program is free software: you can redistribute it and/or modify it
 *   under the terms of the GNU Lesser General Public License as published by
 *   the Free Software Foundation, either version 3 of the License,
 *   or (at your option) any later version.
 *   This program is distributed in the hope that it will be useful,
 *   but WITHOUT ANY WARRANTY; without even the implied warranty
 *   of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
 *   See the GNU General Public License for more details.
 *   You should have received a copy of the GNU Lesser General Public License along with this program.
 *
 *   If not, see <http://www.gnu.org/licenses/>.
 *
 *   Contact:
 *
 *     Discordserver:   https://discord.gg/wvcX92VyEH
 *     Website:         https://vironlab.eu/
 *     Mail:            contact@vironlab.eu
 *
 */

'use strict'; // https://www.w3schools.com/js/js_strict.asp

module.exports = (grunt) => {
    var fs = require('fs');
    var gzip = require('gzip-js');
    var CLIEngine = require('eslint').CLIEngine;

    var stripJSONComments = require('strip-json-comments');

    function readOptionalJSON(filepath) {
        let data = {};
        try {
            data = JSON.parse(
                stripJSONComments(
                    fs.readFileSync(filepath, {
                        encoding: 'utf8',
                    }),
                ),
            );
        } catch (e) {}
        return data;
    }

    if (!grunt.option('filename')) {
        grunt.option('filename', 'vextension-web.js');
    }

    var banner = `
/**
 * Vextension-Web v<%= pkg.version %>| Copyright (C) 2021 | vironlab.eu
 * Licensed under the MIT License

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
 * Repository: 
 *     Github:          https://github.com/VironLab/vextension-web
 *     NPM:             https://www.npmjs.com/package/vextension-web
 * Contact:
 *     Discordserver:   https://discord.gg/wvcX92VyEH
 *     Website:         https://vironlab.eu/
 *     Mail:            contact@vironlab.eu
 *
 */\n`;

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        dst: readOptionalJSON('dist/.destination.json'),
        authors: {
            prior: ['depascaldc <depascaldc@gmail.com>'],
            order: 'count',
        },
        watch: {
            files: ['src/**/*.js'],
            tasks: ['uglify', 'compare_size'],
        },
        build: {
            all: {
                dest: 'dist/vextension-web.js',
                included: ['vextension'],
            },
        },
        uglify: {
            all: {
                files: {
                    "dist/<%= grunt.option('filename').replace('.js', '.min.js') %>": "dist/<%= grunt.option('filename') %>",
                },
                options: {
                    preserveComments: false,
                    sourceMap: true,
                    sourceMapName: "dist/<%= grunt.option('filename').replace('.js', '.min.map') %>",
                    report: 'min',
                    output: {
                        ascii_only: true,
                    },
                    banner: banner,
                    compress: {
                        hoist_funs: false,
                        loops: false,
                    },
                },
            },
        },
        compare_size: {
            files: ['src/<%= pkg.name %>.js', 'dist/<%= pkg.name %>.min.js'],
            options: {
                compress: {
                    gz: function (contents) {
                        return gzip.zip(contents, {}).length;
                    },
                },
                cache: 'build/.sizecache.json',
            },
        },
    });

    // Load grunt tasks from NPM packages
    require('load-grunt-tasks')(grunt);

    // Integrate Vextension-Web special tasks
    grunt.loadTasks('build/tasks');

    grunt.registerTask('default', ['build:*:*', 'uglify', 'compare_size', 'update-authors']);
};
