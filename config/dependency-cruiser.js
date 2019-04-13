module.exports = {
    extends: 'dependency-cruiser/configs/recommended-strict',
    forbidden: [
        {
            name: 'optional-deps-used',
            severity: 'error',
            comment: 'we don\'t want optional dependencies at the moment',
            from: {},
            to: {
                dependencyTypes: [
                    'npm-optional'
                ]
            }
        },
        {
            name: 'not-to-test',
            comment: 'Don\'t allow dependencies from outside the test folder to test',
            severity: 'error',
            from: {
                pathNot: '^test'
            },
            to: {
                path: '^test'
            }
        },
        {
            name: 'not-to-spec',
            comment: 'Don\'t allow dependencies to (typescript/ javascript/ coffeescript) spec files',
            severity: 'error',
            from: {},
            to: {
                path: '\\.spec\\.js$'
            }
        },
        {
            name: 'fs-only-from-cli',
            comment: 'Only allow fs access from the cli modules (and test)',
            severity: 'error',
            from: {
                pathNot: '^(src/cli|test)'
            },
            to: {
                dependencyTypes: [
                    'core'
                ],
                path: '^fs$'
            }
        },
        {
            name: 'not-to-dev-dep',
            severity: 'error',
            comment: 'Don\'t allow dependencies from src to a development only package',
            from: {
                path: '^src'
            },
            to: {
                dependencyTypes: [
                    'npm-dev'
                ]
            }
        },
        {
            name: 'prefer-no-lodash',
            comment: 'We prefer depending on lodash modules (so no require("lodash"); require("lodash/blah") is ok',
            severity: 'info',
            from: {},
            to: {
                path: 'lodash/'
            }
        },
        {
            name: 'no-parser-to-render',
            comment: 'Parser code shall not depend on render code',
            severity: 'error',
            from: {
                path: '^src/parse'
            },
            to: {
                path: '^src/render'
            }
        },
        {
            name: 'no-render-to-parse',
            comment: 'Render code shall not directly depend on parser code',
            severity: 'error',
            from: {
                path: '^src/render'
            },
            to: {
                path: '^src/parse'
            }
        },
        {
            name: 'no-deps-on-cli',
            comment: 'Nothing shall depend on the cli code',
            severity: 'error',
            from: {
                pathNot: '^src/cli|^bin|^test/cli'
            },
            to: {
                path: '^src/cli|^bin'
            }
        }
    ]
    ,
    options: {
        moduleSystems: [
            'cjs'
        ]
        // not necessary anymore as it is already in dependency-cruiser/configs/recommended
        // doNotFollow: 'node_modules'
    }
};
