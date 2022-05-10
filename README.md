# Mewa Webstore

HTML+CSS template of [Mewa](https://www.mewatools.com/) WebStore, a new free video creator and compositor.

This repo contains the HTML+CSS source code used by Webstore. To visit the live version of the site, go to <https://www.mewatools.com/webstore/> 


### Installation

Open a terminal and clone the repo with this command:

```
git clone https://github.com/Mewatools/mewa-webstore && cd mewa-webstore
```

You're ready to begin development!

### Development

There are 3 test reference pages:
- [addon-details.html](addon-details.html)
- [addon-list.html](addon-list.html)
- [newaddon-form.html](newaddon-form.html)

Open the test pages to check the current state of the Mewa WebStore template.

### Considerations

Behind the Mewa Webstore is a PHP server that generates the WebStore HTML. To facilitate the integration with the php server, HTML source should be kept as simple and minimal as possible.

### TODO

- [x] Define a limit to the number of characters that can be used in the addon brief description. This limit will make sure that entries in [addon-list.html](addon-list.html) are all kept with the same height;
    - Its currently set to 144 characters. This was the initial limit used on twitter posts
- [ ] Write a javascript function to generate highlighted text from the source-code text in [addon-details.html](addon-details.html)


    
