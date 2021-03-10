const Constants = require('./constants');
const Helpers   = require('./helpers');

const initGlobals = (grunt) => {
    // ----- global info -----
    global.node_modules_paths = Constants.node_modules_paths;
    global.release_config     = Constants.release_config;

    // ----- release info -----
    global.is_release = Helpers.isRelease(grunt);
    if (global.is_release) {
        global.release_target = Helpers.getReleaseTarget(grunt);
    }

    // ----- section -----
    global.section = Constants.config.section;

    // ----- branch info -----
    if (global.release_target) {
        global.release_info = global.release_config[global.release_target];

        if (!global.release_info.target_repo) {
            global.release_info.target_repo = global.release_info.origin;
        }
        global.release_info.clone_folder = Helpers.getGhpagesCloneFolder();

        global.branch_prefix = '';
        global.branch        = global.release_info.target_folder;

        if (global.release_target === 'staging') {
            grunt.option('cleanup', true); // always cleanup when releasing to staging
        }
    } else {
        global.branch_prefix = Constants.config.branch_prefix;
        global.branch        = grunt.option('branch');
    }

    // ----- paths -----
    global.dist = Helpers.getDistPath();
    global.path = grunt.option('path');

    // ----- compile templates -----
    global.compileCommand = params => Helpers.generateCompileCommand(params);
};

module.exports = {
    initGlobals,
};
