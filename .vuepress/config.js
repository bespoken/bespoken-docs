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
      ['link', { rel: 'icon', href: '/favicon.ico' }],
      ['link', { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Open+Sans'}],
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
            { text: "ACCURACY TESTING", link: "/training/ivr/accuracy/overview/" },
            { text: "FUNCTIONAL TESTING", link: "/end-to-end/getting-started/" },
            { text: "LOAD TESTING", link: "/training/ivr/load/overview/"},
            { text: "MONITORING", link: "/training/ivr/monitoring/overview/" },
            { text: "TRAINING", link: "/training/overview" },
            { text: "CLI", link: "/cli/getting-started" },
            { text: "FAQ", link: "/end-to-end/faq" },
        ],
        sidebar: {
            "/end-to-end/": getEndToEndSidebar(),
            "/training/ivr/accuracy/": getTrainingIVRAccuracy(),
            "/training/ivr/functional/": getTrainingIVRFunctional(),
            "/training/ivr/monitoring/": getTrainingIVRMonitoring(),
            "/training/chatbot/functional/": getTrainingChatbotFunctional(),
            "/training/chatbot/monitoring/": getTrainingChatbotMonitoring(),
            "/cli/": getCliSidebar()
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
            title: "CLI",
            collapsable: true,
            children: [
                "getting-started",
                "commands",
                "faq"
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


function getTrainingIVRMonitoring() {
  return [
      {
          title: "IVR Monitoring",
          collapsable: false,
          children: [
              "overview"
          ]
      }
  ];
}

function getTrainingIVRAccuracy() {
  return [
      {
          title: "IVR Accuracy Testing",
          collapsable: false,
          children: [
              "overview"
          ]
      }
  ];
}


function getTrainingChatbotFunctional() {
  return [
      {
          title: "Chatbot Functional Testing",
          collapsable: false,
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


function getTrainingChatbotMonitoring() {
  return [
      {
          title: "Chatbot Monitoring",
          collapsable: false,
          children: [
              "overview"
          ]
      }
  ];
}
