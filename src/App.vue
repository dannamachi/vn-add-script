<template>
  <img alt="my logo" src="./assets/icon_cropped.png" width='200' height='200'>
  <h2>script:
    <input v-model='scriptObj.meta__name' />
  </h2>
  <p>author: 
    <input v-model='scriptObj.meta__author' />
  </p>
  <p>scenes: {{ scriptObj.meta__scount }} scene(s)</p>
  <p>charas: {{ scriptObj.meta__ccount - 1 }} charas (excluding default narrator)</p>

  <!-- section to display scenes for edit -->
  <div v-for='(scene, index) in getScenes()' :key="index">
    (DEV) sceneID: {{ scene.keyName }}
    scene: <input v-model='scriptObj["scene__" + scene.keyName].name' />
    author: <input v-model='scriptObj["scene__" + scene.keyName].author' />
    lines: {{ getLines(scene).length }}
    <!-- bg section -->
    background: {{ scriptObj["scene__" + scene.keyName].background }}
    select background
    <div v-for='(bg, index10) in scriptObj.meta__bgList' :key='index10'>
        <button @click='selectBG(scene.keyName, bg)'>{{ bg }}</button>
      </div>
    add custom background
    <AddGlobalStuff @add-exp='onAddBG' v-bind:stuffType='"background"'/>

    <!-- ost section  -->
    music: {{ scriptObj["scene__" + scene.keyName].ost }}
    select music
    <div v-for='(ost, index11) in scriptObj.meta__ostList' :key='index11'>
        <button @click='selectOST(scene.keyName, ost)'>{{ ost }}</button>
    </div>
    add custom music
        <AddGlobalStuff @add-exp='onAddOST' v-bind:stuffType='"music"'/>
    <!-- section to display line for edit -->
    <div v-for='(line, index2) in getLines(scene)' :key='index2'>
      (DEV) lineID: {{ line.keyName }}
      <!-- if not display same, show current display list, add new display char -->
      <input v-if='scriptObj["scene__" + scene.keyName]["line__" + line.keyName].displaySame' type="checkbox" v-model='scriptObj["scene__" + scene.keyName]["line__" + line.keyName].displaySame' />same display ?
      <div v-if="!line.displaySame">
        <!-- show current display sprites -->
        <div 
          v-for='(sprite, index4) in getSprites(line)' 
          :key='index4' 
          :class='{ 
            incChara: scriptObj["scene__" + scene.keyName]["line__" + line.keyName]["sprite__" + sprite.keyName].included,
            notIncChara: !(scriptObj["scene__" + scene.keyName]["line__" + line.keyName]["sprite__" + sprite.keyName].included) }'>
          sprite's display name (if speaker): 
          <input v-model='scriptObj["scene__" + scene.keyName]["line__" + line.keyName]["sprite__" + sprite.keyName].name' />
          sprite expression: {{ scriptObj["scene__" + scene.keyName]["line__" + line.keyName]["sprite__" + sprite.keyName].exp }}
          <!-- section for expressions -->
          select expression
          <div v-for='(charExp, index5) in getExpressions(sprite.keyName)' :key='index5'>
            <button @click='selectExpression(scene.keyName, line.keyName, sprite.keyName, charExp)'>{{ charExp }}</button>
          </div>

          add custom expression
          <!-- comp to add new global expression -->
          <AddGlobalStuff v-bind:stuffType='"expression"' v-bind:char='sprite.keyName' @add-exp='onAddExpression' />
          sprite position: {{ scriptObj["scene__" + scene.keyName]["line__" + line.keyName]["sprite__" + sprite.keyName].pos }}
          <!-- section for positions -->

          select position
          <div v-for='(cPos, index6) in scriptObj.meta__posList' :key='index6'>
            <button @click='selectPosition(scene.keyName, line.keyName, sprite.keyName, cPos)'>{{ cPos }}</button>
          </div>

          add custom position
          <!-- comp to add new global position -->
          <AddGlobalStuff v-bind:stuffType='"position"' @add-exp='onAddPosition' />

          <input type="checkbox" v-model='scriptObj["scene__" + scene.keyName]["line__" + line.keyName]["sprite__" + sprite.keyName].included' />include sprite ?
        </div>
        <!-- add new char to display -->
        add sprite to display ?
        <div v-for='(gSprite, index9) in getAllSprites()' :key='index9'>
          <div v-if='!isSpriteAddedToLine(gSprite.keyName, line)'>
            <button @click='addSpriteToDisplay(scene.keyName, line.keyName, gSprite.keyName)'>{{ gSprite.name }}</button>
          </div>
        </div>
      </div>
      <!-- comp to add new global character -->
      add possible speaker
      <AddGlobalStuff v-bind:stuffType='"sprite"' @add-exp='onAddSprite' />
      <!-- speaker section -->
      speaker: {{ scriptObj["scene__" + scene.keyName]["line__" + line.keyName].speaker.name }}
      select speaker
      <div v-for='(speaking, index8) in getAllSprites()' :key='index8'>
          <button @click='selectSpeaker(scene.keyName, line.keyName, speaking)'>{{ speaking.name }}</button>
        </div>
      <!-- text section -->
      showing text:
        <textarea name="text" maxlength='350' placeholder="storytelling..." v-model='scriptObj["scene__" + scene.keyName]["line__" + line.keyName].text'></textarea>
      <p>-----</p>
      <!-- button to add line (indexed unique name) -->
      <button @click='onAddLine(scene.keyName, line.keyName, line.next)'>Add Line</button>
      <p>-----</p>
    </div>
    <p>=========</p>
    <!-- button to add line (indexed unique name) -->
    <button @click='onAddScene(scene.keyName, scene.next)'>Add Scene</button>
    <p>=========</p>
  </div>

  <!-- component to download json -->
  <HelloWorld v-bind:jsonArr='scriptObj' />
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'
import AddGlobalStuff from './components/AddGlobalStuff.vue'
import { v4 as uuidv4 } from 'uuid';
import { reactive } from "vue";
// let copiedPerson = JSON.parse(JSON.stringify(person));

export default {
  name: 'App',
  components: {
    HelloWorld,
    AddGlobalStuff
  },
  setup() {
    const scriptObj = reactive({
      'meta__name'    : "New Script",
      'meta__author'  : 'Cool Author',
      'meta__updated' : new Date().toString(),
      'meta__scount'  : 0,
      'meta__ccount'  : 1,
      'meta__posList' : ['center', 'left', 'right'],
      'meta__bgList'  : ['none'],
      'meta__ostList' : ['none'],
      // default narrator character
      'char____narrator': {
        keyName   : '__narrator',
        name      : 'narrator',
        expList   : []
      },
      // linked list start end
      'meta__startName'   : '',
      'meta__endName'     : ''
    })
    return { scriptObj }
  },
  created() {
    // create new scene upon init
    if (this.getScenes().length == 0) {
      this.onAddScene('', '')
    }
  },
  methods: {
    selectBG(sceneName, bg) {
      this.scriptObj["scene__" + sceneName].background = bg
    },
    selectOST(sceneName, ost) {
      this.scriptObj["scene__" + sceneName].ost = ost
    },
    selectSpeaker(sceneName, lineName, speaker) {
      this.scriptObj["scene__" + sceneName]["line__" + lineName].speaker = speaker
    },
    selectExpression(sceneName, lineName, spriteName, exp) {
      this.scriptObj["scene__" + sceneName]["line__" + lineName]["sprite__" + spriteName].exp = exp
    },
    selectPosition(sceneName, lineName, spriteName, pos) {
      this.scriptObj["scene__" + sceneName]["line__" + lineName]["sprite__" + spriteName].pos = pos
    },
    isSpriteAddedToLine(spriteName, line) {
      if (spriteName == "__narrator") return true
      for (var sp of this.getSprites(line)) {
        if (sp.keyName == spriteName) return true;
      }
      return false;
    },
    addSpriteToDisplay(sceneName, lineName, spriteName) {
      // check sprite not alr added
      for (const[key2, value2] of Object.entries(this.scriptObj['scene__' + sceneName]['line__' + lineName])) {
        value2
        if (key2 == 'sprite__' + spriteName) {
          return;
        }
      }
      // fetch sprite
      var spriteObj = null;
      for (const [key, value] of Object.entries(this.scriptObj)) {
        if (key == 'char__' + spriteName) {
          spriteObj = value;
        }
      }
      if (spriteObj == null) return;
      spriteObj.pos = 'center'
      spriteObj.exp = 'neutral'
      spriteObj.included = true
      // push to line
      this.scriptObj['scene__' + sceneName]['line__' + lineName]['sprite__' + spriteName] = spriteObj
    },
    onAddSprite(spObj) {
      if (spObj.sprite == '__narrator') {
        return;
      }
      for (const [key, value] of Object.entries(this.scriptObj)) {
        if (key.startsWith('char__')) {
          if (value.keyName == spObj.sprite) {
            return;
          }
        }
      }
      this.scriptObj['char__' + spObj.sprite] = {
        keyName: spObj.sprite,
        name: spObj.sprite,
        expList: ['neutral']
      }
      this.scriptObj.meta__ccount += 1
    },
    onAddBG(bgObj) {
      for (var bg of this.scriptObj.meta__bgList) {
        if (bg == bgObj.bg) {
          return;
        }
      }
      this.scriptObj.meta__bgList.push(bgObj.bg);
    },
    onAddOST(ostObj) {
      for (var ost of this.scriptObj.meta__ostList) {
        if (ost == ostObj.ost) {
          return;
        }
      }
      this.scriptObj.meta__ostList.push(ostObj.ost);
    },
    onAddPosition(posObj) {
      for (var pos of this.scriptObj.meta__posList) {
        if (pos == posObj.pos) {
          return;
        }
      }
      this.scriptObj.meta__posList.push(posObj.pos);
    },
    onAddExpression(expObj) {
      for (const [key, value] of Object.entries(this.scriptObj)) {
        if (key.startsWith('char__')) {
          if (value.keyName == expObj.char && value.keyName != '__narrator') {
            value.expList.push(expObj.exp)
            break;
          }
        }
      }
    },
    getAllSprites() {
      var sList = []
      for (const [key, value] of Object.entries(this.scriptObj)) {
        if (key.startsWith('char__')) {
          sList.push(value)
        }
      }
      return sList;
    },
    getExpressions(spriteName) {
      var expList = []
      for (const [key, value] of Object.entries(this.scriptObj)) {
        if (key.startsWith('char__')) {
          if (value.keyName == spriteName && value.keyName != '__narrator') {
            for (var e of value.expList) {
              expList.push(e)
            }
            break;
          }
        }
      }
      return expList;
    },
    getSprites(line) {
      var sList = []
      for (const [key, value] of Object.entries(line)) {
        if (key.startsWith('sprite__')) {
          sList.push(value)
        }
      }
      return sList;
    },
    getLines(scene) {
      var lineList = []
      var line = null
      for (const [key, value] of Object.entries(scene)) {
        if (key == scene.meta__startName) {
          line = value;
          break;
        }
      }

      if (!line) { return []}
      // evolution recursive baby ( sure hope this doesn't fuck me over )
      var hey = true
      while (hey) {
        lineList.push(line);
        if ('line__' + line.keyName == scene.meta__endName) {
          hey = false
          break;
        } else {
          line = scene["line__" + line.next]
        }
      }
      return lineList;
    },
    getScenes() {
      var sceneList = []
      var scene = null
      for (const [key, value] of Object.entries(this.scriptObj)) {
        if (key == this.scriptObj.meta__startName) {
          scene = value;
          break;
        }
      }
      
      if (!scene) { return []}
      // evolution recursive baby ( sure hope this doesn't fuck me over )
      var hey = true
      while (hey) {
        sceneList.push(scene);
        if ('scene__' + scene.keyName == this.scriptObj.meta__endName) {
          hey = false
          break;
        } else {
          scene = this.scriptObj["scene__" + scene.next];
        }
      }
      return sceneList;
    },
    // unique indexed name
    // second char list
    onAddLine(sceneName, lastName, nextName) {
      // fetch lines
      var lastLine = null
      if (lastName != '') lastLine = this.scriptObj['scene__' + sceneName]['line__' + lastName]
      var nextLine = null
      if (nextName != "") nextLine = this.scriptObj['scene__' + sceneName]['line__' + nextName]
      // new line
      var uniqueID = uuidv4(); // ⇨ '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d'
      var newLine = {
        keyName : uniqueID,
        speaker: this.scriptObj.char____narrator,
        text: '',
        next: nextName,
        previous: lastName,
        displaySame: true
      }
      // add previous display sprites and speaker by default
      if (lastLine) {
        for (const [key, value] of Object.entries(lastLine)) {
          if (key.startsWith('sprite__')) {
            newLine['sprite__' + value.keyName] = value
          }
        }
        newLine.speaker = lastLine.speaker
      }
      // add to script obj
      this.scriptObj['scene__' + sceneName]['line__' + uniqueID] = newLine
      // adjust lines in chain
      if (lastLine) this.scriptObj['scene__' + sceneName]['line__' + lastName].next = uniqueID
      else this.scriptObj['scene__' + sceneName].meta__startName = 'line__' + uniqueID
      if (nextLine) this.scriptObj['scene__' + sceneName]['line__' + nextName].previous = uniqueID
      else this.scriptObj['scene__' + sceneName].meta__endName = 'line__' + uniqueID
    },
    // unique indexed keyname
    // editable name
    // linked list linking
    // mark starting object (if first scene) with scene__
    // mark ending object (if last) with scene__
    onAddScene(lastName, nextName) {
      // fetch scenes
      var lastScene = null
      if (lastName != '') lastScene = this.scriptObj['scene__' + lastName]
      var nextScene = null
      if (nextName != "") nextScene = this.scriptObj['scene__' + nextName]
      // new scene
      var uniqueID = uuidv4(); // ⇨ '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d'
      var newScene = {
        name : 'new scene',
        author: this.scriptObj.meta__author,
        keyName : uniqueID,
        next: nextName,
        previous: lastName,
        background: this.scriptObj.meta__bgList[0],
        ost: this.scriptObj.meta__ostList[0]
      }

      // add to script obj
      this.scriptObj['scene__' + uniqueID] = newScene
      this.scriptObj.meta__scount += 1

      // add one line
      this.onAddLine(uniqueID, '', '')
      
      // adjust lines in chain
      if (lastScene) this.scriptObj['scene__' + lastName].next = uniqueID
      else this.scriptObj.meta__startName = 'scene__' + uniqueID
      if (nextScene) this.scriptObj['scene__' + nextName].previous = uniqueID
      else this.scriptObj.meta__endName = 'scene__' + uniqueID
    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

.incChara {
  text-decoration: none;
}

.notIncChara {
  text-decoration: line-through;
}
</style>
