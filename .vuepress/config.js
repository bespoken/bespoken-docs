module.exports = {
    title: "Bespoken Documentation",
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
        '@vuepress/medium-zoom',
        'vuepress-plugin-nprogress',
        'vuepress-plugin-reading-progress',
        'vuepress-plugin-smooth-scroll',
        {
            name: 'dynamic-meta',
            extendPageData($page) {
                console.info('page: ' + JSON.stringify($page.frontmatter, null, 2))
                // Ensure $page.path is correct, and manually add base if needed for absolute URLs
                const baseUrl = 'https://read.bespoken.ai'; // Get site base URL
                // $page.frontmatter.head = $page.frontmatter.head || [];
                
                // Add Canonical URL
                // $page.frontmatter.head.push([
                // 'link',
                // { rel: 'canonical', href: `${baseUrl}${$page.path}` }
                // ]);
                let canonicalUrl = baseUrl + $page.frontmatter.permalink
                if (!canonicalUrl.endsWith('/')) {
                    canonicalUrl = canonicalUrl + '/'
                }
                $page.frontmatter.canonicalUrl = canonicalUrl
                
                // Add Open Graph URL (example)
                // $page.frontmatter.head.push([
                //     'meta', { property: 'og:url', content: canonicalUrl }
                // ]);
            }
        }
    ],
    description: "Bespoken AI Documentation",
    head: [
        ['link', { rel: 'icon', href: '/logo.png' }],
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
        bespokenUri: "https://bespoken.ai/",
        lastUpdated: true,
        logo: "/assets/images/logo-black.png",

        nav: [
            //{ text: "Dashboard", link: "/dashboard/" },
            //{ text: "Testing Guides per platform", link: "/functional/introduction/" },
            //{ text: "CLI", link: "/training/ivr/load/overview/" },
            //{ text: "Training", link: "/training/overview" },
            //{ text: "API", link: "/api/overview" },
            //{ text: "FAQ", link: "/end-to-end/faq" },
        ],
        sidebar: [
            getDashboardSidebar(),
            getGuidesSidebar(),
            getMonitoringSidebar(),
            //getCLISidebar(),
            getAPISidebar(),
            getFAQSidebar(),
            getTrainingSidebar()
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

function getDashboardSidebar() {
    return {
        path: "/dashboard/",
        title: "Dashboard",
        collapsable: true,
        children: [
            '/dashboard/',
            'dashboard/projects',
            'dashboard/test-suites',
            'dashboard/virtual-devices',
            'dashboard/data-tables',
            'dashboard/test-page',
            'dashboard/history',
            'dashboard/manage-organization'
        ]
    };
}

function getGuidesSidebar() {
    return {
        path: "/guides/",
        title: "Platform Guides",
        collapsable: true,
        children: [
            '/guides/',
            'guides/alexa-google',
            'guides/watson',
            'guides/ivr',
            'guides/webchat',
            'guides/whatsapp'
        ]
    };
}

function getMonitoringSidebar() {
    return {
        path: "/monitoring/",
        title: "Monitoring",
        collapsable: true,
        children: [
            '/monitoring/',
        ]
    };
}

function getFAQSidebar() {
    return {
        path: "/faq/",
        title: "FAQ",
        collapsable: true,
        children: [
            '/faq/',
        ]
    };
}

function getCLISidebar() {
    return {
        path: "/cli/",
        title: "CLI",
        collapsable: true,
        children: [
            '/cli/',
        ]
    };
}

function getTrainingSidebar() {
    return {
        path: "/training/overview",
        title: "Training",
        collapsable: true,
        children: [
            '/training/overview',
            '/training/ivr/overview',
            '/training/chatbot/overview'
        ]
    };
}

function getAPISidebar() {
    return {
        path: "/api/",
        title: "API",
        collapsable: true,
        children: [
            "/api/overview",
            "/api/test-api",
            "/api/integration"
        ]
    };
}

function getUnitTestingSidebar() {
    return [
        {
            title: "Unit Testing",
            collapsable: true,
            children: [
                "getting-started",
                "guide",
                "guide-google",
                "use-cases",
                "faq",
            ]
        }
    ];
}
function getEndToEndSidebar() {
    return [
        {
            title: "Functional Testing",
            collapsable: true,
            children: [
                "getting-started",
                "setup",
                "guide",
                "ivr",
                "chat",
                "watson",
                "device-api",
                "test-api",
                "faq",
            ]
        }
    ];
}


function getTrainingIVRFunctional() {
    return [
        {
            title: "IVR Functional Testing",
            collapsable: false,
            children: [
                "overview",
                "subscribe",
                "device",
                "test",
                "homophones",
                "voices",
                "end-of-speech",
                "reporting",
                "going-further"
            ]
        }
    ];
}
