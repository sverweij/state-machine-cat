module.exports = {
    forbidden: [
        {
            "name": "no-deprecated-core",
            "comment": "Warn about dependencies on deprecated core modules.",
            "severity": "warn",
            "from": {},
            "to": {"dependencyTypes": ["core"], "path": "^(punycode|domain|constants|sys|_linklist)$"}
        },
        {
            name: 'no-deprecated-npm',
            comment: 'These npm modules are deprecated - find an alternative.',
            severity: 'warn',
            from: {},
            to: {
                dependencyTypes: [
                    'deprecated'
                ]
            }
        },
        {
            name: 'not-to-unresolvable',
            comment: 'Don\'t allow dependencies on modules dependency-cruiser can\'t resolve ' +
                     'to files on disk (which probably means they don\'t exist)',
            severity: 'error',
            from: {},
            to: {
                couldNotResolve: true
            }
        },
        {
            name: 'no-non-package-json',
            severity: 'error',
            comment: 'Don\'t allow dependencies to packages not in package.json (except from within node_modules)',
            from: {
                pathNot: '^node_modules'
            },
            to: {
                dependencyTypes: [
                    'unknown',
                    'undetermined',
                    'npm-no-pkg',
                    'npm-unknown'
                ]
            }
        },
        {
            name: 'optional-deps-used',
            severity: 'info',
            comment: 'nothing serious - but just check you have some serious try/ catches around the ' +
                     'import/ requires of these',
            from: {},
            to: {
                dependencyTypes: [
                    'npm-optional'
                ]
            }
        },
        {
            name: 'no-circular',
            severity: 'warn',
            comment: 'Warn in case there\'s circular dependencies',
            from: {},
            to: {
                circular: true
            }
        },
        {
            "name": "no-orphans",
            "severity": "error",
            "comment": "Inform in case there's orphans hiding in the code base",
            "from": {"orphan": true, "pathNot": "\\.d\\.ts$"},
            "to": {}
        },
        {
            name: 'no-duplicate-dep-types',
            comment: 'Warn if a dependency occurs in your package.json more than once (technically:' +
                     'has more than one dependency type)',
            severity: 'warn',
            from: {},
            to: {
                moreThanOneDependencyType: true
            }
        }
    ]
};
