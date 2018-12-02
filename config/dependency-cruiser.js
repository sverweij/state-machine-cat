const dependencyCruiserBase = require('./dependency-cruiser-base');

module.exports = {
    forbidden: dependencyCruiserBase.forbidden.concat(
        [
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
                comment: 'Only allow fs access from the cli modules',
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
                comment: 'We want to minimize the dependency on lodash a bit - so flag dependencies that go there',
                severity: 'info',
                from: {},
                to: {
                    path: 'lodash/'
                }
            }
        ]
    ),
    options: {
        moduleSystems: [
            'cjs'
        ],
        doNotFollow: 'node_modules'
    }
};
