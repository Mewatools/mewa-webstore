# Mewa Webstore

This is the official store for [Mewa](https://www.mewatools.com/), the new video creator and compositor.

## About

This site contains the source code of the [Mewa webstore](). To visit the live version of the site, go to <https://mewatools.com/webstore/> 

If you would like to contribute or make changes to the site, follow these steps:

### Install Dependencies

Make sure you have Nodejs and NPM installed. If you don't have both of them (or if you are unsure if you have them), read [this tutorial](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) to get setup.

Then, open a terminal and clone the repo with this command:

```
git clone https://github.com/Mewatools/mewa-webstore && cd mewa-webstore
```

Lastly, install NPM dependencies:

```
npm install
```

You're ready to begin development!

### Development

To begin development, run the following command:

```
npm run start
```

This will open up a hot-reloading development server at <http://localhost:8080> where you can view the site.

### Additional Notes

Note that this project uses [Prettier](https://www.prettier.io>), and automatically formats code on each commit.

Behind the Mewa Webstore is a PHP server that generates the WebStore HTML. To facilitate the integration with the server, HTML source should be kept as simple and as minimal as possible.
