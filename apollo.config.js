module.exports = {
    client: {
        service: {
        name: 'authfront',
        // URL to the GraphQL API
        url: 'http://localhost:3001/graphql',
        },
        // Files processed by the extension
        includes: [
        'src/**/*.vue',
        'src/**/*.js',
        ],
    },
}