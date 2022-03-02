# VN Script Builder

## Description
No longer will the writing for a VN-like dialogue system have to be done within the game code. No more will we be tortured by manual formatting from Google Docs or text files. Unless you are using Renpy, this will help you cleanly separate coding and dialogue writing for a VN-like game.

## Live version
https://mochimochi95.itch.io/script-writer

## Features
* Add new characters, lines and scenes in a script
* Select speaking character and edit text showing for each line
* Add and remove characters to be displayed as sprite in a line (max 3)
* Add and select custom position and expression for each sprite in a line
* Automatic same display and speaking characters with new line
* Export and download script as JSON file
* Load existing script to continue editing

## Usage
Exported JSON file contains metadata for VN-like dialogue system that can be imported into game code without any manual formatting needed (choice logic to be implemented in the game code, this only supports the writing of separate scenes and lines identified by unique IDs). Output JSON looks like this:
```
{
    'meta__name'    : "New script", // default script name
    'meta__author'  : 'Cool Author', // default script author
    'meta__updated' : new Date().toString(), // default updated time
    'meta__scount'  : 0, // number of scenes
    'meta__ccount'  : 1, // number of characters/sprites
    'meta__posList' : ['center', 'left', 'right'], // list of sprite positions
    'meta__bgList'  : ['none'], // list of backgrounds
    'meta__ostList' : ['none'], // list of scene music

    'meta__startName'   : '', // ID of first scene
    'meta__endName'     : '', // ID of last scene

    'scene__someSceneID' : {
        name        : 'someSceneName',
        author      : 'someSceneAuthor',
        keyName     : 'someSceneID',
        next        : 'nextSceneID', // ID of next scene
        previous    : 'lastSceneID', // ID of previous scene
        background  : 'someSceneBackground',
        ost         : 'someSceneMusic',

        'meta__startName' : '', // ID of first line
        'meta__endName'   : '', // ID of last line

        'line__someLineID' : {
            keyName   : 'someLineID',
            speaker   : 'someLineSpeaker',
            text      : 'someLineTest',
            next      : 'nextLineID', // ID of next line
            previous  : 'lastLineID', // ID of last line

            'sprite__someCharacterID': {
                keyName   : 'someCharacterID',
                name      : 'someCharacterName',
                pos       : 'somePosition',
                exp       : 'someExpression'
            } // a sprite object

        } // a line object

    }, // a scene object

    'char____narrator': {
        keyName   : '__narrator',
        name      : 'narrator',
        expList   : []
    }, // default narrator character

    'char__someCharacterID': {
        keyName   : 'someCharacterID',
        name      : 'someCharacterName',
        expList   : []
    } // a character object
}
```

## Development
### Setup
```
npm install
```
### Run locally
```
npm start
```
### Build for deployment
```
npm run build
```
