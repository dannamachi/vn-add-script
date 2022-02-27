<template>
  <img alt="my logo" src="./assets/icon_cropped.png">
  <h2>script:
    <input v-model='scriptObj.meta__name' />
  </h2>
  <p>author: 
    <input v-model='scriptObj.meta__author' />
  </p>
  <p>scenes: {{ scriptObj.meta__scount }} scene(s)</p>
  <p>charas: {{ scriptObj.meta__ccount - 1 }} charas (excluding default narrator)</p>

  <!-- section to display scene for edit -->
  <div v-for='(scene, index) in getScenes()' :key="index">
    scene: <input v-model='scriptObj["scene__" + scene.keyName].name' />
    author: <input v-model='scriptObj["scene__" + scene.keyName].author' />
    <!-- bg section -->
    <AddGlobalStuff @add-exp='onAddBG' />
    background:
    <select v-model='scriptObj["scene__" + scene.keyName].background'>
      <option disabled value="">new background - add above</option>
      <div v-for='(bg, index10) in scriptObj.meta__bgList' :key='index10'>
        <option value='bg'>{{ bg }}</option>
      </div>
    </select>
    <!-- ost section  -->
    <AddGlobalStuff @add-exp='onAddOST' />
    music:
    <select v-model='scriptObj["scene__" + scene.keyName].ost'>
      <option disabled value="">new music - add above</option>
      <div v-for='(ost, index11) in scriptObj.meta__ostList' :key='index11'>
        <option value='ost'>{{ ost }}</option>
      </div>
    </select>
    <!-- section to display line for edit -->
    <div v-for='(line, index2) in getLines(scene)' :key='index2'>
      <!-- if not display same, show current display list, add new display char -->
      <input v-if='scriptObj["scene__" + scene.keyName]["line__" + line.keyName].displaySame' type="checkbox" v-model='scriptObj["scene__" + scene.keyName]["line__" + line.keyName].displaySame' />same display ?
      <div v-if="!line.displaySame">
        <!-- show current display sprites -->
        <div v-for='(sprite, index4) in getSprites(line)' :key='index4' :class='{ incChara: scriptObj["scene__" + scene.keyName]["line__" + line.keyName]["sprite__" + sprite.keyName].included, notIncChara: !(scriptObj["scene__" + scene.keyName]["line__" + line.keyName]["sprite__" + sprite.keyName].included) }'>
          chara display name: 
          <input v-model='scriptObj["scene__" + scene.keyName]["line__" + line.keyName]["sprite__" + sprite.keyName].name' />
          chara expression:
          <!-- section for expressions -->
          <select v-model='scriptObj["scene__" + scene.keyName]["line__" + line.keyName]["sprite__" + sprite.keyName].exp'>
            <option disabled value="">new expression - add below</option>
            <div v-for='(charExp, index5) in getExpressions(sprite.keyName)' :key='index5'>
              <option value='charExp'>{{ charExp }}</option>
            </div>
          </select>
          <!-- comp to add new global expression -->
          <AddGlobalStuff v-bind:char='sprite.keyName' @add-exp='onAddExpression' />
          chara pos
          <!-- section for positions -->
          <select v-model='scriptObj["scene__" + scene.keyName]["line__" + line.keyName]["sprite__" + sprite.keyName].pos'>
            <option disabled value="">new position - add below</option>
            <div v-for='(cPos, index6) in scriptObj.meta__posList' :key='index6'>
              <option value='cPos'>{{ cPos }}</option>
            </div>
          </select>
          <!-- comp to add new global position -->
          <AddGlobalStuff @add-exp='onAddPosition' />
          <input type="checkbox" v-model='scriptObj["scene__" + scene.keyName]["line__" + line.keyName]["sprite__" + sprite.keyName].included' />include chara ?
        </div>
        <!-- add new char to display -->
        <div v-for='(gSprite, index9) in getAllSprites()' :key='index9'>
          <div v-if='!isSpriteAddedToLine(gSprite.keyName, line)'>
            <button @click='addSpriteToDisplay(scene.keyName, line.keyName, gSprite.keyName)'>{{ gSprite.name }}</button>
          </div>
        </div>
      </div>
      <!-- comp to add new global character -->
      <AddGlobalStuff @add-exp='onAddSprite' />
      <!-- speaker section -->
      chara speaking:
      <select v-model='scriptObj["scene__" + scene.keyName]["line__" + line.keyName]["sprite__" + sprite.keyName].speaker'>
        <option disabled value="">new speaker - add above</option>
        <div v-for='(speaking, index8) in getAllSprites()' :key='index8'>
          <option value='speaking'>{{ speaking }}</option>
        </div>
      </select>
      <!-- text section -->
      showing text:
        <textarea name="text" maxlength='350' placeholder="storytelling..." v-model='scriptObj["scene__" + scene.keyName]["line__" + line.keyName].text'></textarea>
      <p>-----</p>
      <!-- button to add line (indexed unique name) -->
      <button @click='onAddLine(scene.keyName, line.keyName, line.next ? line.next.keyName : "")'>Add Line</button>
      <p>-----</p>
    </div>
    <p>=========</p>
    <!-- button to add line (indexed unique name) -->
    <button @click='onAddScene(scene.keyName, scene.next ? scene.next.keyName : "")'>Add Scene</button>
    <p>=========</p>
  </div>

  <!-- component to download json -->
  <HelloWorld v-bind:jsonArray='scriptObj' />
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'
import AddGlobalStuff from './components/AddGlobalStuff.vue'
import { v4 as uuidv4 } from 'uuid';

// let copiedPerson = JSON.parse(JSON.stringify(person));

export default {
  name: 'App',
  components: {
    HelloWorld,
    AddGlobalStuff
  },
  data() {
    return {
      scriptObj: {
        'meta__name'    : "New Script",
        'meta__author'  : 'Cool Author',
        'meta__updated' : Date.now(),
        'meta__scount'  : 0,
        'meta__ccount'  : 1,
        'meta__posList' : ['center', 'left', 'right'],
        'meta__bgList'  : ['none'],
        'meta__ostList' : ['none'],
        // default narrator character
        'char__narrator': {
          keyName   : '__narrator',
          name      : ''
        },
        // linked list start end
        'meta__startName'   : '',
        'meta__endName'     : ''
      }
    }
  },
  created() {
    // create new scene upon init
    if (this.getScenes().length == 0) {
      onAddScene('', '')
    }
  },
  methods: {
    isSpriteAddedToLine(spriteName, line) {
      for (var sp of this.getSprites(line)) {
        if (sp.keyName == spriteName) return true;
      }
      return false;
    },
    addSpriteToDisplay(sceneName, lineName, spriteName) {
      // check sprite not alr added
      for (const[key2, value2] of this.scriptObj['scene__' + sceneName]['line__' + lineName]) {
        if (key2 == 'sprite__' + spriteName) {
          return;
        }
      }
      // fetch sprite
      var spriteObj = null;
      for (const [key, value] of this.scriptObj) {
        if (key == 'char__' + spriteName) {
          spriteObj = value;
        }
      }
      if (spriteObj == null) return;
      spriteObj.pos = 'center'
      spriteObj.exp = 'neutral'
      spriteObj.included = true
      // push to line
      this.$set(this.scriptObj['scene__' + sceneName]['line__' + lineName], 'sprite__' + spriteName, spriteObj);
    },
    onAddSprite(spObj) {
      if (spObj.sprite == 'narrator') {
        return;
      }
      for (const [key, value] of this.scriptObj) {
        if (key.startsWith('char__')) {
          if (value.keyName == spObj.sprite) {
            return;
          }
        }
      }
      this.$set(this.scriptObj, 'char__' + spObj.sprite, {
        keyName: spObj.sprite,
        name: spObj.sprite,
        expList: ['neutral']
      })
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
      for (const [key, value] of this.scriptObj) {
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
      for (const [key, value] of this.scriptObj) {
        if (key.startsWith('char__')) {
          sList.push(value)
        }
      }
      return sList;
    },
    getExpressions(spriteName) {
      var expList = []
      for (const [key, value] of this.scriptObj) {
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
      for (const [key, value] of line) {
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
      while (true) {
        if ('line__' + line.keyName == scene.meta__endName) {
          break;
        } else {
          console.log('adding:' + line.keyName)
          lineList.push(line);
          line = line.next;
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
      while (true) {
        if ('scene__' + scene.keyName == this.scriptObj.meta__endName) {
          break;
        } else {
          console.log('adding:' + scene.keyName)
          sceneList.push(scene);
          scene = scene.next;
        }
      }
      return sceneList;
    },
    // unique indexed name
    // second char list
    onAddLine(sceneName, lastName, nextName) {
      // fetch lines
      var lastLine = this.scriptObj['scene__' + sceneName]['line__' + lastName]
      var nextLine = null
      if (nextName != "") nextLine = this.scriptObj['scene__' + sceneName]['line__' + nextName]
      // new line
      var uniqueID = uuidv4(); // ⇨ '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d'
      var newLine = {
        keyName = uniqueID,
        speaker: '',
        text: '',
        next: nextLine,
        previous: lastLine,
        displaySame: true
      }
      // add previous display sprites by default
      for (const [key, value] of lastLine) {
        if (key.startsWith('sprite__')) {
          newLine['sprite__' + value.keyName] = value
        }
      }
      // add to script obj
      this.$set(this.$scriptObj['scene__' + sceneName], 'line__' + uniqueID, newLine)
      // adjust lines in chain
      this.$set(lastLine, 'next', newLine)
      if (nextLine) this.$set(nextLine, 'previous', newLine)
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
        name = 'new scene',
        author: this.scriptObj.meta__author,
        keyName = uniqueID,
        next: nextScene,
        previous: lastScene,
        background: 'none',
        ost: 'none'
      }

      // add to script obj
      this.$set(this.$scriptObj, 'scene__' + uniqueID, newScene)
      this.scriptObj.meta__scount += 1
      // adjust lines in chain
      if (lastScene) this.$set(lastScene, 'next', newScene)
      if (nextScene) this.$set(nextScene, 'previous', newScene)
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
