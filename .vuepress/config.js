module.exports = {
    title: "Bespoken Docs",
    plugins: [
      [
        '@vuepress/google-analytics',
        {
          'ga': 'G-WVSYLZ119Q',
          'gm': 'G-WVSYLZ119Q'
        }
      ]
    ],
    description: "Bespoken Documentation",
    head: [
      //['link', { rel: 'icon', href: '/favicon.ico' }]
      ['script', { src: 'https://cdn.tailwindcss.com'} ],
      ['script', { src: 'https://code.jquery.com/jquery-3.6.3.js'}],
      ['link', { href: "/override.css", rel: "stylesheet", type: "text/css" }]
    ],
    themeConfig: {
        algolia: {
            apiKey: '36d68ce99344a644d0bc7667b5ee4003',
            indexName: 'bespoken',
            debug: true
        },
        bespokenUri: "https://bespoken.io/",
        logo: "/assets/images/BespokenLogo-small.png",
        
        nav: [
            { text: "ACCURACY TESTING", link: "https://bespoken.io/accuracy-testing/" },
            { text: "FUNCTIONAL TESTING", link: "/end-to-end/getting-started/" },
            { text: "LOAD TESTING", link: "https://bespoken.io/ivr-load-testing/"},
            { text: "MONITORING", link: "https://bespoken.io/monitoring/" },
            { text: "TRAINING", link: "/training/overview" },
            { text: "FAQ", link: "/end-to-end/faq" },
        ],
        sidebar: {
            "/end-to-end/": getEndToEndSidebar(),
            "/training/ivr/functional/": getTrainingIVR(),
            "/training/chatbot/functional/": getTrainingChatbot()
        },
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

function getCliSidebar() {
    return [
        {
            title: "CLI & Proxy",
            collapsable: true,
            children: [
                "getting-started",
                "commands",
                "faq"
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
            title: "Functional Testing",
            collapsable: true,
            children: [
                "getting-started",
                "setup",
                "guide",
                "ivr",
                "chat",
                "api",
                "faq",
            ]
        }
    ];
}


function getTrainingIVR() {
  return [
      {
          title: "IVR Functional Testing",
          collapsable: true,
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


function getTrainingChatbot() {
  return [
      {
          title: "Chatbot Functional Testing",
          collapsable: true,
          children: [
              "overview",
              "subscribe",
              "device",
              "configure",
              "recordings",
              "test",
              "jquery",
              "sample"
          ]
      }
  ];
}
