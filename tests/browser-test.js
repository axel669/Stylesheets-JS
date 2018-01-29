console.log(ssjs);

const sheet = ssjs.create();

sheet.addStyles({
    "html, body": {
        padding: 0,
        margin: 0
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
        display: ['-webkit-flex', 'flex']
    }
});

console.log(
    sheet.stuff
);
console.log(sheet.renderText(true));
