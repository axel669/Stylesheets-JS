const sheet = SSJS.create();

sheet.attr['data-title'] = 'test';
sheet.addStyles({
    "html, body": {
        padding: 0,
        margin: 0,
        backgroundColor: () => theme.test
    },
    '@keyframes': {
        from: {
            transform: 'translate(0px, 0px)'
        },
        to: {
            transform: 'translate(100px, 100px)'
        }
    },
    'flex-group': {
        display: ['-webkit-flex', 'flex'],
        userSelect: 'none'
    }
});

const theme = {
    test: "teal"
};

sheet.attach();

console.log(sheet.render());
theme.test = "cyan";
console.log(sheet.render("min"));
