const sheet = ssjs.create();

sheet.attrs['data-title'] = 'test';
sheet.addStyles({
    "html, body": {
        padding: 0,
        margin: 0,
        backgroundColor: 'cyan'
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

// console.log(
//     JSON.stringify(
//         sheet.stuff,
//         null,
//         '  '
//     )
// );
// console.log(sheet.renderText(true));
// console.log(sheet.renderText());
sheet.attach();
