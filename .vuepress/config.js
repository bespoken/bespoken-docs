module.exports = {
    title: "Bespoken Docs",
    plugins: [
        [
            'google-analytics-4',
            {
                // your gtag tracking ID
                gtag: 'G-WVSYLZ119Q'
            },
        ],
        '@vuepress/back-to-top',
        '@vuepress/last-updated',
        'vuepress-plugin-nprogress',
        'vuepress-plugin-reading-progress',
        'vuepress-plugin-smooth-scroll',
    ],
    description: "Bespoken Documentation",
    head: [
        ['link', { rel: 'icon', href: '/favicon.ico' }],
        ['link', { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Open+Sans' }],
        ['script', { src: 'https://cdn.tailwindcss.com' }],
        ['script', { src: 'https://code.jquery.com/jquery-3.6.3.js' }],
        ['link', { href: "/override.css", rel: "stylesheet", type: "text/css" }]
    ],
    markdown: {
        extractHeaders: ['h2', 'h3', 'h4']
    },
    themeConfig: {
        algolia: {
            apiKey: '36d68ce99344a644d0bc7667b5ee4003',
            indexName: 'bespoken',
            debug: true
        },
        bespokenUri: "https://bespoken.io/",
        lastUpdated: true,
        logo: "/assets/images/BespokenLogo-small.png",

        nav: [
            { text: "Dashboard", link: "/dashboard/" },
            //{ text: "Testing Guides per platform", link: "/functional/introduction/" },
            { text: "CLI", link: "/training/ivr/load/overview/" },
            { text: "TRAINING", link: "/training/overview" },
            { text: "API", link: "/api/overview" },
            { text: "FAQ", link: "/end-to-end/faq" },
        ],
        sidebar: [
            getDashboardSidebar(),
            getAPISidebar()
        ],
    },
    // https://stackoverflow.com/questions/53874577/vuepress-how-to-get-the-processed-image-filename
    chainWebpack: (config, isServer) => {
        config.module.rule('vue').uses.store.get('vue-loader').store.get('options').transformAssetUrls = {
            video: ['src', 'poster'],
            source: 'src',
            img: 'src',
            image: ['xlink:href', 'href'],
            a: 'href'
        };
    }
}

function getAPISidebar() {
    return {
        path: "/api/overview",
        title: "API",
        collapsable: true,
        children: [
            "",
            "cli",
            "integration"
        ]
    };
}

function getDashboardSidebar() {
    return {
        path: "/dashboard/",
        title: "Dashboard",
        collapsable: true,
        children: [
            '/dashboard/',
            'dashboard/test-suites',
            'dashboard/virtual-devices',
            'dashboard/test-page',
            'dashboard/history',
            'dashboard/manage-organization'
        ]
    }
        ;
}
