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
            comment: 'We prefer depending on (so no require("lodash") - but require("lodash/") is ok',
            severity: 'info',
            from: {},
            to: {
                path: 'lodash/'
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
