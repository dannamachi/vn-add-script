# VN Script Builder

## Description
No longer will the writing for a VN-like dialogue system have to be done within the game code. No more will we be tortured by manual formatting from Google Docs or text files. Unless you are using Renpy, this will help you cleanly separate coding and dialogue writing for a VN-like game.

## Live version
https://mochimochi95.itch.io/script-writer

## Features
* Add new characters, lines and scenes in a section
* Select speaking character and edit text showing for each line
* Add and remove characters to be displayed as sprite in a line (max 3)
* Add and select custom position and expression for each sprite in a line
* Automatic same display and speaking characters with new line
* Export and download script as JSON file
* Load existing section script to continue editing
* Add, edit and remove flags for section and each scene
* Connect sections using preceding section id
* Add and edit options for 1 choice per section
* Add, edit and insert nickables (character nicknames and pronouns) 
* Export and import asset metadata to use across sections

## Usage
Exported JSON file contains metadata for VN-like dialogue system that can be imported into game code without any manual formatting needed, ~~branching logic to be implemented in the game code, this only supports the writing of separate scenes and lines identified by unique IDs~~ branching can be set with flags, section link and choice.

### Output JSON looks like this:
```
{
    'meta__id'      : 'someSectionID', // unique section ID
    'meta__name'    : "New section", // default section name
    'meta__author'  : 'Cool Author', // default section author
    'meta__updated' : new Date().toString(), // default updated time
    'meta__scount'  : 0, // number of scenes
    'meta__ccount'  : 1, // number of characters/sprites
    'meta__previous': 'someOtherSectionID', // section ID from preceding section

    'meta__posList' : ['center', 'left', 'right'], // list of sprite positions
    'meta__bgList'  : ['someBackground'], // list of backgrounds
    'meta__ostList' : ['someMusic'], // list of scene music

    'meta__flagList': [
        { name: 'some flag', type: 'flag' } // basic flag object
    ], // list of flags required by section
    'meta__flagGList': [
        { name: 'some flag', type: 'flag' } // basic flag object
    ], // list of flags given by section

    'meta__startName'   : '', // ID of first scene
    'meta__endName'     : '', // ID of last scene

    'nicks': [
        {
            name: '', // unique name
            pronoun: '', // pronoun to be inserted
            defaultPronoun: '', // default pronoun
            nick: '', // nickname to be inserted
            defaultNick: '' // default nickname
        } // basic nickable object
    ], // list of nickables

    'choice' : {
        prompt: '',
        options: [
            {
                name: '',
                required: [
                    { name: 'some flag', type: 'flag' }
                ], // flags required to activate option
                giving: [
                    { name: 'some flag', type: 'flag' }
                ] // flags given by option
            } // basic option object
        ]
    },

    'scene__someSceneID' : {
        'name'        : 'someSceneName',
        'author'      : 'someSceneAuthor',
        'keyName'     : 'someSceneID',
        'next'        : 'nextSceneID', // ID of next scene
        'previous'    : 'lastSceneID', // ID of previous scene
        'background'  : 'someSceneBackground',
        'ost'         : 'someSceneMusic',

        'meta__flagList'  : [], // lists of flag that scene will give

        'meta__startName' : '', // ID of first line
        'meta__endName'   : '', // ID of last line

        'line__someLineID' : {
            'keyName'   : 'someLineID',
            'speaker'   : 'someLineSpeaker',
            'text'      : 'someLineTest',
            'next'      : 'nextLineID', // ID of next line
            'previous'  : 'lastLineID', // ID of last line

            'sprite__someCharacterID': {
                'keyName'   : 'someCharacterID',
                'name'      : 'someCharacterName',
                'pos'       : 'somePosition',
                'exp'       : 'someExpression'
            } // a sprite object

        } // a line object

    }, // a scene object

    'char____narrator': {
        'keyName'   : '__narrator',
        'name'      : 'narrator',
        'expList'   : []
    }, // default narrator character

    'char__someCharacterName': {
        'keyName'   : 'someCharacterName',
        'name'      : 'someCharacterName',
        'expList'   : ['someExpression']
    } // a character object
}
```

### Nickables
If any nickname/pronoun has been inserted, it will be in the script text as such:
```
// nickname
{@unique name@}
// pronoun
{!unique name!}
```
By parsing the script text, checking for the bounding symbols and getting a match in the list of nickables using the unique name, the correct nickname/pronoun can be replaced in the script text.

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
