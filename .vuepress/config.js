module.exports = {
    title: "Bespoken Docs",
    description: "Bespoken Documentation",
    themeConfig: {
        algolia: {
            apiKey: '36d68ce99344a644d0bc7667b5ee4003',
            indexName: 'bespoken',
            debug: true
        },
        bespokenUri: "https://bespoken.io/",
        logo: "/assets/images/BespokenLogo-small.png",
        head: [
            ['link', { rel: 'icon', href: '/favicon.ico' }]
        ],
        nav: [
            { text: "CLI AND PROXY", link: "/cli/getting-started" },
            { text: "UNIT TESTING", link: "/unit-testing/getting-started" },
            { text: "END-TO-END TESTING", link: "/end-to-end/getting-started" },
            { text: "CONTINUOUS TESTING", link: "https://bespoken.io/blog/monitor-alexa-skills-or-google-actions/" },
        ],
        sidebar: {
            "/cli/": getCliSidebar(),
            "/unit-testing/": getUnitTestingSidebar(),
            "/end-to-end/": getEndToEndSidebar(),
        },
    }
}

function getCliSidebar() {
    return [
        {
            title: "CLI & Proxy",
            collapsable: true,
            children: [
                "getting-started",
                "commands",
            ],
        }, {
            title: "Tutorials",
            collapsable: true,
            children: [
                "tutorials/debugging-locally",
                "tutorials/tutorial-flask-ask-python",
                "tutorials/tutorial-lambda-nodejs",
                "tutorials/tutorial-local-server-java",
            ]
        }
    ];
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
            title: "End-to-end Testing",
            collapsable: true,
            children: [
                "getting-started",
                "guide",
                "api",
                "setup",
                "faq",
            ]
        }
    ];
}
