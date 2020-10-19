const https = require('https');
const fs = require('fs');
const Jimp = require('jimp');

const { apiKey, numPerPage, searchTerms, phrases } = require('./config');

const searchTerm = encodeURI(searchTerms[Math.floor(Math.random() * searchTerms.length)]);

// Not currently used
const maxUploadDate = Math.round((new Date()).getTime() / 1000) // Today
                        - (365 * 24 * 60 * 60); // Minus 1 year

console.log('Search for: ' + searchTerm);

// E.g. C:\Users\<USERNAME>\AppData\Roaming\VirtuaWin
const VirtuaWinDir = (process.env.APPDATA || process.env.HOME + '/.local/share') + '/VirtuaWin/';

// https://pixabay.com/api/docs/#api_search_images
https.get('https://pixabay.com/api/?key=' + apiKey + '&q=' + searchTerm + '&image_type=photo&orientation=horizontal&min_width=1920&min_height=1080&safesearch=true&per_page=' + numPerPage, (resp) => {
    let data = '';

    // A chunk of data has been recieved.
    resp.on('data', (chunk) => {
        data += chunk;
    });

    // The whole response has been received. Print out the result.
    resp.on('end', () => {
        console.log('Got image list');
        const json = JSON.parse(data);
        //console.log(json);
        let numPhotos = parseInt(json.totalHits);
        if (!numPhotos) {
            console.error('No results');
            waitForKey();
            return;
        }
        if (numPhotos > numPerPage) numPhotos = numPerPage;
        let selectedPhoto;
        try {
            selectedPhoto = json.hits[Math.floor(Math.random() * numPhotos)];
        } catch (err) {
            console.error('Error getting specific image: ' + err);
            waitForKey();
            return;
        }
        console.log('Selected ' + selectedPhoto.pageURL);
        const phrase = phrases[Math.floor(Math.random() * phrases.length)];
        processImg(selectedPhoto, phrase);
    });

}).on('error', err => {
    console.error('Error accessing API: ' + err.message);
    waitForKey();
});

async function processImg(imgInfo, phrase) {

    let image;
    try {
        image = await Jimp.read(imgInfo.largeImageURL); // fullHDURL
        console.log('Got image file');
    } catch(err) {
        console.error('Error reading image: ' + err);
        waitForKey();
        return;
    }

    image.cover(1920, 1080); // Scale with cropping

    // Load font
    let fgFont, bgFont;
    try {
        fgFont = await Jimp.loadFont(Jimp.FONT_SANS_16_WHITE);
        bgFont = await Jimp.loadFont(Jimp.FONT_SANS_16_BLACK);
    } catch(err) {
        console.error('Error loading font: ' + err);
        waitForKey();
        return;
    }
    
    const marginX = 20;
    const marginY = 115;
    
    // Add text about image
    let text = 'By ' + imgInfo.user + '\n' + imgInfo.pageURL;
    printText(image, text, bgFont, fgFont, marginX, marginY, 1920 - marginX - marginX, 1080, Jimp.VERTICAL_ALIGN_TOP);
    
    // Add phrase text
    text = 'From ' + phrase.from + '\n\n' + phrase.text;
    if (phrase.source) text += '\n\n- ' + phrase.source;
    printText(image, text, bgFont, fgFont, 1920 / 2, -marginY, 1920 / 2 - marginX, 1080, Jimp.VERTICAL_ALIGN_BOTTOM);

    try {
        await image.writeAsync(VirtuaWinDir + 'wallpaper0.bmp');
        console.log('Resized and saved image');
    } catch(err) {
        console.error('Error resizing / saving image: ' + err);
        waitForKey();
        return;
    }
    
    try {
        renameFiles();
    } catch(err) {
        console.error(err); // Friendly error
        waitForKey();
        return;
    }
    console.log('Done!');

}

/**
 * Write text onto image with a shadow / border; handles line breaks
 * @param {*} image Jimp image
 * @param {string} text Text to write on image
 * @param {*} bgFont Jimp background (shadow) font
 * @param {*} fgFont Jimp foreground font
 * @param {number} startX Left position to start text
 * @param {number} startY Top position to start text
 * @param {number} maxWidth Right position to wrap text
 * @param {number} maxHeight Bottom position to cut off text
 * @param {8|32} alignmentY Vertical alignment: Jimp.VERTICAL_ALIGN_TOP or Jimp.VERTICAL_ALIGN_BOTTOM
 */
function printText(image, text, bgFont, fgFont, startX, startY, maxWidth, maxHeight, alignmentY) {

    const paragraphs = (text || '').split('\n');
    let lastY = startY;
    let dir, startI, endI, i;
    if (alignmentY === Jimp.VERTICAL_ALIGN_BOTTOM) {
        dir = -1;
        startI = paragraphs.length - 1;
        endI = 0;
    } else {
        dir = 1;
        startI = 0;
        endI = paragraphs.length - 1;
    }
    i = startI;
    while (true) {
        if (alignmentY === Jimp.VERTICAL_ALIGN_BOTTOM && i < startI) {
            lastY -= Jimp.measureTextHeight(fgFont, paragraphs[i + 1], maxWidth);
        }
        for (let x = -1; x <= 2; x++) {
            for (let y = -1; y <= 2; y++) {
                image.print(bgFont, startX + x, lastY + y, {
                    text: paragraphs[i],
                    alignmentX: Jimp.HORIZONTAL_ALIGN_RIGHT,
                    alignmentY: alignmentY
                }, maxWidth, maxHeight);
            }
        }
        
        image.print(fgFont, startX, lastY, {
            text: paragraphs[i],
            alignmentX: Jimp.HORIZONTAL_ALIGN_RIGHT,
            alignmentY: alignmentY
        }, maxWidth, maxHeight);

        if (i === endI) {
            break;
        }
        i += dir;

        if (alignmentY !== Jimp.VERTICAL_ALIGN_BOTTOM) {
            lastY += Jimp.measureTextHeight(fgFont, paragraphs[i], maxWidth) * dir;
        }
    }

}

function renameFiles() {
    for (let i = 4; i >= 0; i--) {
        try {
            fs.renameSync(VirtuaWinDir + 'wallpaper' + i + '.bmp', VirtuaWinDir + 'wallpaper' + (i + 1) + '.bmp');
        } catch(err) {
            throw 'Error renaming ' + VirtuaWinDir + 'wallpaper' + i + '.bmp: ' + err;
        }
    }
    try {
        fs.unlinkSync(VirtuaWinDir + 'wallpaper5.bmp'); // Delete the highest
    } catch(err) {
        throw 'Error deleting ' + VirtuaWinDir + 'wallpaper5.bmp: ' + err;
    }
    console.log('Renamed files');
}

function waitForKey() {
    console.log('\nPress any key to close');
    process.stdin.setRawMode(true);
    process.stdin.resume();
    process.stdin.on('data', process.exit.bind(process, 0));
}
