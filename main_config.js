const adminComponents = [
    {
        name: 'project',
        items: [
            {name: "name", type: "text", lang: true},
            {name: "caption", type: "text", lang: true},
            {name: "description", type: "text", lang: true},
            {name: "date", type: "text", lang: false},
            {name: "cover", type: "file"},
        ],
        params: {
            name: 'project',
            gotFileList: false,
            gotImagesList: true,
            adminPath: true,
            gotTypes: false,
            freeAccess: true,
            buyable: false,
            unique: false,
            types: false,
            multi_lang: true,
            langs: ["fr", "en"],
            filePath: "img/"
        }
    },
    {
        name: 'item',
        items: [
            {name: "name", type: "text", lang: true},
            {name: "caption", type: "text", lang: true},
            {name: "description", type: "text", lang: true},
            {name: "shop_description", type: "text", lang: true},
            {name: "producer", type: "text", lang: false},
            {name: "producer_website", type: "text", lang: false},
            {name: "date", type: "text", lang: false},
            {name: "price", type: "number"},
            {name: "stock", type: "number"},
            {name: "cover", type: "file"},
            {name: "shop_cover", type: "file"},
            {name: "fee_france", type: "number" },
            {name: "fee_euro_zone1", type: "number" },
            {name: "fee_euro_zone2", type: "number" },
            {name: "fee_euro_zone3", type: "number" },
            {name: "fee_world", type: "number" },
        ],
        params: {
            name: 'item',
            gotFileList: false,
            gotImagesList: true,
            adminPath: true,
            gotTypes: true,
            freeAccess: true,
            buyable: true,
            unique: false,
            types: true,
            multi_lang: true,
            langs: ["fr", "en"],
            filePath: "img/"
        },
        types: [
            {
                name: "colors",
                items: [
                    { name: "color", type: "text", lang: false },
                    { name: "shop_cover", type: "file" },
                    { name: "small", type: "file"},
                    { name: "medium", type: "file"},
                    { name: "large", type: "file"},
                ]
            }
        ]
    }
];

const Onces = [
    { 
        name: 'about',
        entries: [
            {name: "tel", type: "text", lang: false},
            {name: "mail", type: "text", lang: false},
            {name: "bio", type: "text", lang: true},
            {name: "prizes", type: "text", lang: true},
            {name: "exhibs", type: "text", lang: true},
        ]
    },
    {
        name: "navbar",
        entries: [
            {name: "name", lang: true},
            {name: "title", lang: true},
            {name: "index", lang: true},
            {name: "about", lang: true},
            {name: "shop", lang: true},
        ]
    }
]
