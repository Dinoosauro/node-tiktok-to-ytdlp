# tiktok-to-ytdlp-node
A Node.JS script that uses [tiktok-to-ytdlp](https://github.com/Dinoosauro/tiktok-to-ytdlp) with Puppeteer to fetch video URLs from a TikTok webpage.
## Example

```
const script = require("./script")("https://www.tiktok.com/@mrbeast");

let webpage = await script.create();
let videoArray = await webpage.start();
```
## Importing the script:

When you import this script, you might want to pass some arguments to it. In the following order:

- Webpage link (Necessary)
- Custom options (an Object like ```scriptOptions``` in the console script, only with the options you want to change)
- Cookies (Highly reccomended; see below)
- Custom script (if it isn't provided, it'll be automatically fetched from GitHub)
- The mode Puppeteer should be started (false -> headful; true -> old headless; "new" -> new headless; default: "new")
### Import cookies:
TikTok will usually require you to sign in to view content that isn't a single video. To do that, you'll need to pass cookies to Puppeteer. 

To do that, you can use the [EditThisCookie](https://chrome.google.com/webstore/detail/editthiscookie/fngmhnnpilhplaeedifhccceomclgfbg/) extension. With that, export your cookies as a JSON file, and then pass them to the script.

```
const script = require("./script")(link, JSON.parse(require("fs").readFileSync("./cookies.json", "utf-8")))
```
## Script functions
All functions are asynchronous. 
### create:
Start Puppeteer, and open the TikTok link. 

Note that this will return another object, that will be used for necessary for all the other tasks. You'll no longer need to use the original script.

```
const script = require("./script")("https://www.tiktok.com/@mrbeast");

let webpage = await script.create();
```

### start:
Load the script into the webpage. This'll return an array of video URLs when the page has finished scrolling.

```
let webpage = await script.create();
let videoArray = await webpage.start();
```
### getUntil:
Get the videos fetched from the script up to that moment. You can use this to start doing _something_ with the video URLs while the script is still running.

```
let webpage = await script.create();
let videoArray = webpage.start(); // Do this without async, so that the page starts scrolling

setTimeout(() => {await webpage.getUntil()}, 5000);
```

### close
Close the browser. Remember to do this when you've got all the video URLs, since the script won't automatically close the browser.

```
let webpage = await script.create();
await webpage.close();
```

## Important notice:
The user is responsible for every consequence the usage of this tool might have. Take this script only as an example on how Puppeteer could be used.

For the actions TikTok might take, read their Terms of Service. 

Once again, I don't claim any responsibilties at all for the usage of this script and the eventual consequences.