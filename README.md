# VirtuaWin Wallpaper Switcher

### Set virtual desktop wallpaper from a search of [Pixabay](https://pixabay.com/).

I have used [VirtuaWin](https://virtuawin.sourceforge.io/) for my virtual desktop manager for many years. It is customizable and works great. I also use [VirtuaWallpapersPlus](https://virtuawin.sourceforge.io/?page_id=50) to set different wallpapers on each virtual desktop. I like to keep my wallpaper fresh but I don't want the hassle of looking for backgrounds. I decided to write a Node.js app to do it for me using a list of search terms. To sweeten the deal, I asked my family to send me inspirational quotes and Bible verses that the Node.js app could then print onto the bottom right corner of the wallpaper images.

Note that this app has an extremely specific use case, but it could be adapted for other purposes.

## Usage

### Prerequities
- VirtuaWin with the VirtuaWallpapersPlus module
- VirtualWin configured to use 4 desktops
- VirtuaWallpapersPlus configured to use the 'Unique wallpapers' mode
- Node.js and npm installed

### Setup
- Clone this repo down to a folder and run `npm install` to set up _node_modules_
- Get your Pixabay API key at https://pixabay.com/accounts/register/
- Rename _config.EXAMPLE.js_ to _config.js_ and open it for editing
    - Enter your API key value for `apiKey`
    - Edit the `searchTerms` and `phrases` lists as desired
- Set up a reoccuring task in Windows Task Scheduler to run `node path\index.js` where _path_ is the folder path where you saved the app

## Author
Chris M. Sissons
https://kryptech.name

## License
MIT licensed
