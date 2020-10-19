module.exports = {
    /** Pixabay API key; ENTER YOUR API KEY HERE */
    apiKey: 'YOUR_PIXABAY_API_KEY_HERE',
    /** Pixabay search results per page - the image will be selected randomly from this page */
    numPerPage: 20,
    /** Pixabay search terms; CUSTOMIZE AS DESIRED */
    searchTerms: [
        'nebula', 
        'red panda', 
        'glacier', 
        'WHATEVER OTHER TERMS HERE' 
    ],
    /** Quotes and such to stamp on the images; CUSTOMIZE AS DESIRED */
    phrases: [
        {
            text: `No book is really worth reading at the age of ten which is not equally - and often far more - worth reading at the age of fifty and beyond.`,
            source: `C.S. Lewis`,
            from: 'YOUR FRIEND'
        }, {
            text: `"If we really knew the future glory for us, it would make the worst times bearable and the best times leaveable."`,
            source: `John Newton`,
            from: 'ANOTHER FRIEND'
        }, {
            text: `May the God of hope fill you with all joy and peace in believing, so that by the power of the Holy Spirit you may abound in hope.`,
            source: `Romans 15:13`,
            from: 'SOMEONE ELSE'
        }
    ]
};
