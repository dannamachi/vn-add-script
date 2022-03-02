<template>
  <nav class="navbar sticky-top navbar-expand-lg navbar-light bg-light">
    <div class="container-fluid">
      <a class="navbar-brand" href="#">
        <img alt="my logo" src="./assets/icon_cropped.png" width='30' height='30'>
      </a>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarScroll" aria-controls="navbarScroll" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarScroll">
        <ul class="navbar-nav me-auto my-2 my-lg-0 navbar-nav-scroll">
          <!-- script info nav -->
          <li class="nav-item">
            <a class="nav-link" href="#scriptInfo">{{ scriptObj.meta__name }}</a>
          </li>
          <!-- scene list -->
          <li class="nav-item dropdown">
            <a class="nav-link dropdown-toggle" id="navbarScrollingDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
              scenes
            </a>
            <ul class="dropdown-menu" aria-labelledby="navbarScrollingDropdown">
              <li v-for='(sceneLink, index20) in getScenes()' :key="index20">
                <a class='dropdown-item' :href='"#sceneHeading"+sceneLink.keyName'>{{ sceneLink.name }}</a>
              </li>
            </ul>
          </li>
          <!-- add scene -->
          <li class='nav-item'>
            <button class="btn btn-primary" @click='addNewScene()'>add scene</button>
          </li>
          <!-- download -->
          <li class='nav-item'>
              <HelloWorld v-bind:jsonArr='scriptObj' />
          </li>
          <!-- load script -->
          <li class="nav-item">
            <a class='nav-link' href='#loadScript'>load section</a>
          </li>
        </ul>
      </div>
    </div>
  </nav>

  <!-- script info -->
  <div class='card' id='scriptInfo'>
    <div class='card-header'>section info</div>
    <div class='card-body'>
      <p>name: 
        <input v-model='scriptObj.meta__name' />
      </p>
      <p>author: 
        <input v-model='scriptObj.meta__author' />
      </p>
    <div class='card-footer'>
      {{ scriptObj.meta__scount }} scene(s), {{ scriptObj.meta__ccount - 1 }} characters (excl. default narrator)
    </div>
    </div>
  </div>
  <div class='card' id='loadScript'>
    <div class='card-header'>load section</div>
    <div class='card-body'>
      <div v-if='errMsg != ""' class="alert alert-danger" role="alert">
        {{ errMsg }}
      </div>
      <textarea name="text" placeholder="paste script text here..." v-model='inputJSON'></textarea>
      <p><button class='btn btn-info' type='button' @click='loadScript()'>load section</button></p>
    </div>
  </div>

  <!-- accordion for scene list -->
  <div class="accordion card" id="sceneList">

    <div class="accordion-item card" v-for='(scene, index) in getScenes()' :key="index">
      <h3 class='accordion-header' :id='"sceneHeading"+scene.keyName'>
        <button class='accordion-button' type='button' data-bs-toggle='collapse' :data-bs-target='"#sceneCollapse"+scene.keyName' aria-expanded="true" :aria-controls='"sceneCollapse"+scene.keyName'>
          {{ scriptObj["scene__" + scene.keyName].name }}
        </button>
      </h3>
        <div :id='"sceneCollapse"+scene.keyName' class="accordion-collapse collapse" :aria-labelledby='"sceneHeading"+scene.keyName' data-bs-parent="#sceneList">
          <div class='accordion-body'>

            <!-- (DEV) sceneID: {{ scene.keyName }} -->
            <div class='card-header'>scene: <input v-model='scriptObj["scene__" + scene.keyName].name' /> written by: <input v-model='scriptObj["scene__" + scene.keyName].author' /></div>

            <!-- section to display line for edit -->
            <div class='card-body'>
              <div class='card' v-for='(line, index2) in getLines(scene)' :key='index2'>
                <!-- (DEV) lineID: {{ line.keyName }} -->
                <!-- if not display same, show current display list, add new display char -->

                <div class='container-lg' :id="'collapseExample' + line.keyName">

                  <div class='row'>
                    <!-- show current display sprites -->
                    <div class='col-sm-8'>
                      <div v-if='getSprites(line) == 0'>no sprite displayed</div>
                      <div class='row'>
                        <div 
                          v-for='(sprite, index4) in getSprites(line)' 
                          :key='index4' 
                          class='card col'>
                          <div class='card-header'>
                            {{ scriptObj["scene__" + scene.keyName]["line__" + line.keyName]["sprite__" + sprite.keyName].name }} ({{ scriptObj["scene__" + scene.keyName]["line__" + line.keyName]["sprite__" + sprite.keyName].exp }})
                          </div>
                          <div class='card-body'>
                            <!-- section for expressions -->
                            <div class="dropdown">
                              <button class="btn btn-secondary dropdown-toggle" type="button" :id="'dropdownMenuButtonExpression'+scene.keyName+line.keyName+sprite.keyName" data-bs-toggle="dropdown" aria-expanded="false">
                                select expression
                              </button>
                              <ul class="dropdown-menu" :aria-labelledby="'dropdownMenuButtonExpression'+scene.keyName+line.keyName+sprite.keyName">
                                <li v-for='(charExp, index5) in getExpressions(sprite.keyName)' :key='index5'>
                                  <button type='button' class='dropdown-item' @click='selectExpression(scene.keyName, line.keyName, sprite.keyName, charExp)'>{{ charExp }}</button>
                                </li>
                              </ul>
                            </div>

                            <!-- comp to add new global expression -->
                            <AddGlobalStuff v-bind:stuffType='"expression"' v-bind:char='sprite.keyName' @add-exp='onAddExpression' />

                            <!-- section for positions -->
                            <div class="dropdown">
                              <button class="btn btn-secondary dropdown-toggle" type="button" :id="'dropdownMenuButtonPosition'+scene.keyName+line.keyName+sprite.keyName" data-bs-toggle="dropdown" aria-expanded="false">
                                select position
                              </button>
                              <ul class="dropdown-menu" :aria-labelledby="'dropdownMenuButtonPosition'+scene.keyName+line.keyName+sprite.keyName">
                                <li v-for='(cPos, index6) in scriptObj.meta__posList' :key='index6'>
                                  <button type='button' class='dropdown-item' @click='selectPosition(scene.keyName, line.keyName, sprite.keyName, cPos)'>{{ cPos }}</button>
                                </li>
                              </ul>
                            </div>

                            <!-- comp to add new global position -->
                            <AddGlobalStuff v-bind:stuffType='"position"' @add-exp='onAddPosition' />

                            <button class='btn btn-link' type='button' @click='removeSpriteFromDisplay(scene.keyName, line.keyName, sprite.keyName)'>Remove</button>

                            <!-- <input type="checkbox" v-model='scriptObj["scene__" + scene.keyName]["line__" + line.keyName]["sprite__" + sprite.keyName].included' />displayed -->
                          </div>
                          <div class='card-footer'>
                            {{ scriptObj["scene__" + scene.keyName]["line__" + line.keyName]["sprite__" + sprite.keyName].pos }}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class='card col-sm-4'>
                      <!-- speaker section -->
                      <div class='card-header'> {{ scriptObj["scene__" + scene.keyName]["line__" + line.keyName].speaker.name }}</div>

                      <!-- text section -->
                      <textarea class='card-body' name="text" maxlength='350' placeholder="storytelling..." v-model='scriptObj["scene__" + scene.keyName]["line__" + line.keyName].text'></textarea>
                    </div>

                  </div>
                  <div class='row'>
                    <!-- add new char to display -->
                    <div class='col' v-if="getSprites(line).length >= 3">3 sprites only !</div>
                    <div class='col dropdown' v-else>
                      <button class="btn btn-secondary dropdown-toggle" type="button" :id="'dropdownMenuButtonDisplayAdd'+scene.keyName+line.keyName" data-bs-toggle="dropdown" aria-expanded="false">
                        add sprite
                      </button>
                      <ul class="dropdown-menu" :aria-labelledby="'dropdownMenuButtonDisplayAdd'+scene.keyName+line.keyName">
                        <div v-if="getSprites(line).length < 3">
                          <li v-for='(gSprite, index9) in getAllSprites()' :key='index9'>
                            <div v-if='!isSpriteAddedToLine(gSprite.keyName, line)'>
                              <button type='button' class='dropdown-item' @click='addSpriteToDisplay(scene.keyName, line.keyName, gSprite.keyName)'>{{ gSprite.name }}</button>
                            </div>
                          </li>
                        </div>
                        <div v-else>
                          <li class='dropdown-item'>3 sprites only !</li>
                        </div>
                        <li><hr class="dropdown-divider"></li>
                        <li class='dropdown-item'>
                          <button @click='updateModalContext(scene.keyName, line.keyName, false, "sprite")' type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal">
                            add new character
                          </button>
                        </li>
                      </ul>
                    </div>

                    <!-- comp to add new global character -->
                    <!-- <AddGlobalStuff class='col' v-bind:stuffType='"character"' @add-exp='onAddSprite' /> -->
                    <div class='col'>
                      <!-- button to add line (indexed unique name) -->
                      <button class="btn btn-primary" @click='onAddLine(scene.keyName, line.keyName, line.next)'>add line</button>
                    </div>

                    <!-- change speaker -->
                    <div class="dropdown col">
                      <button class="btn btn-secondary dropdown-toggle" type="button" :id="'dropdownMenuButtonSpeaker'+scene.keyName+line.keyName" data-bs-toggle="dropdown" aria-expanded="false">
                        select speaker
                      </button>
                      <ul class="dropdown-menu" :aria-labelledby="'dropdownMenuButtonSpeaker'+scene.keyName+line.keyName">
                        <li v-for='(speaking, index8) in getAllSprites()' :key='index8'>
                          <button type='button' class='dropdown-item' @click='selectSpeaker(scene.keyName, line.keyName, speaking)'>{{ speaking.name }}</button>
                        </li>
                        <li><hr class="dropdown-divider"></li>
                        <li class='dropdown-item'>
                          <button @click='updateModalContext(scene.keyName, line.keyName, false, "speaker")' type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal">
                            add new character
                          </button>
                        </li>
                      </ul>
                    </div>
                  </div>

                </div>
              </div>
            </div>

            <!-- bg and ost section -->
            <button class="btn btn-secondary" type="button" data-bs-toggle="collapse" :data-bs-target="'#collapseBGOST' + scene.keyName" aria-expanded="false" :aria-controls="'collapseBGOST' + scene.keyName">
              toggle background and music
            </button>
            <div class='collapse container-lg' :id='"collapseBGOST" + scene.keyName'>
              <div class='row'>
                <!-- bg section -->
                <div class='col'>
                  background: {{ scriptObj["scene__" + scene.keyName].background }}
                  <div class="dropdown">
                    <button class="btn btn-secondary dropdown-toggle" type="button" :id="'dropdownMenuButtonBG'+scene.keyName" data-bs-toggle="dropdown" aria-expanded="false">
                      select background
                    </button>
                    <ul class="dropdown-menu" :aria-labelledby="'dropdownMenuButtonBG'+scene.keyName">
                      <li v-for='(bg, index10) in scriptObj.meta__bgList' :key='index10'>
                        <button type='button' class='dropdown-item'  @click='selectBG(scene.keyName, bg)'>{{ bg }}</button>
                      </li>
                    </ul>
                  </div>
                  <AddGlobalStuff @add-exp='onAddBG' v-bind:stuffType='"background"'/>
                </div>

                <!-- ost section  -->
                <div class='col'>
                  music: {{ scriptObj["scene__" + scene.keyName].ost }}
                  <div class="dropdown">
                    <button class="btn btn-secondary dropdown-toggle" type="button" :id="'dropdownMenuButtonOST'+scene.keyName" data-bs-toggle="dropdown" aria-expanded="false">
                      select music
                    </button>
                    <ul class="dropdown-menu" :aria-labelledby="'dropdownMenuButtonOST'+scene.keyName">
                      <li v-for='(ost, index11) in scriptObj.meta__ostList' :key='index11'>
                        <button type='button' class='dropdown-item'  @click='selectOST(scene.keyName, ost)'>{{ ost }}</button>
                      </li>
                    </ul>
                  </div>
                  <AddGlobalStuff @add-exp='onAddOST' v-bind:stuffType='"music"'/>
                </div>
              </div>
            </div>

            <div class='card-footer text-muted'>
              lines: {{ getLines(scene).length }}
              <!-- button to add line (indexed unique name) -->
              <button class="btn btn-link" @click='onAddScene(scene.keyName, scene.next)'>add scene</button>
            </div>
          </div>
        </div>
    </div>

  </div>

  <!-- modal to edit character -->
  <EditCharacter v-bind:context='modalContext' @add-exp='onAddSprite' @close-modal='onCloseModal'/>

</template>

<script>
import HelloWorld from './components/HelloWorld.vue'
import AddGlobalStuff from './components/AddGlobalStuff.vue'
import EditCharacter from './components/EditCharacter.vue'
import { v4 as uuidv4 } from 'uuid';
import clone from 'just-clone';
import { reactive } from "vue";
// let copiedPerson = JSON.parse(JSON.stringify(person));

export default {
  name: 'App',
  components: {
    HelloWorld,
    AddGlobalStuff,
    EditCharacter
  },
  setup() {
    const scriptObj = reactive({
      'meta__name'    : "New section",
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
  data() {
    return {
      inputJSON: "",
      errMsg: "",
      startNum: 0,
      modalContext: {
        isEditing: false,
        isOpen: false,
        success: ''
      }
    }
  },
  watch: {
    inputJSON: function() {
      this.errMsg = ""
    }
  },
  created() {
    // create new scene upon init
    this.addNewScene()
  },
  methods: {
    onCloseModal() {
      this.modalContext.isOpen = false
      this.modalContext.success = ''
    },
    updateModalContext(scenename, linename, edit, second) {
      this.modalContext.scene = scenename
      this.modalContext.line = linename
      this.modalContext.isEditing = edit
      this.modalContext.second = second
      this.modalContext.isOpen = true
      this.modalContext.success = ''
    },
    checkScript(script) {
      var sceneCount = 0;
      var charCount = 0;
      // all meta fields
      for (const [key, value] of Object.entries(this.scriptObj)) {
        value
        if (key.startsWith('meta__' && !script[key])) {
          return false;
        }
      }
      // count scene and char
      for (const[key1, value1] of Object.entries(script)) {
        value1
        if (key1.startsWith('scene__')) sceneCount += 1
        if (key1.startsWith('char__')) charCount += 1
      }
      if (sceneCount != script.meta__scount) return false
      if (charCount != script.meta__ccount) return false
      return true
    },
    loadScript() {
      try {
        var script = JSON.parse(this.inputJSON)
        if (!this.checkScript(script)) return
        else {
          for (const [key1, value1] of Object.entries(this.scriptObj)) {
            value1
            if (!script[key1]) delete this.scriptObj[key1]
          }
          console.log(this.scriptObj)
          for (const [key, value] of Object.entries(script)) {
            this.scriptObj[key] = value
          }
        }
      }
      catch(err) {
        this.errMsg = 'invalid script text !'
      }
    },
    addNewScene() {
      var allScenes = this.getScenes()
      if (allScenes.length == 0) {
        this.onAddScene('', '')
      } else {
        this.onAddScene(allScenes[allScenes.length-1].keyName, '')
      }
    },
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
        if (sp.keyName == spriteName && sp.included) return true;
      }
      return false;
    },
    removeSpriteFromDisplay(sceneName, lineName, spriteName) {
      this.scriptObj['scene__' + sceneName]['line__' + lineName]['sprite__' + spriteName].included = false
    },
    addSpriteToDisplay(sceneName, lineName, spriteName) {
      // check sprite not alr added
      for (const[key2, value2] of Object.entries(this.scriptObj['scene__' + sceneName]['line__' + lineName])) {
        value2
        if (key2 == 'sprite__' + spriteName && value2.included) {
          return;
        }
      }
      // fetch sprite
      var spriteObj = null;
      for (const [key, value] of Object.entries(this.scriptObj)) {
        if (key == 'char__' + spriteName) {
          spriteObj = clone(value);
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
        this.modalContext.success = 'no'
        return;
      }
      for (const [key, value] of Object.entries(this.scriptObj)) {
        if (key.startsWith('char__')) {
          if (value.keyName == spObj.sprite) {
            this.modalContext.success = 'no'
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

      // add to sprite
      if (spObj.addToDisplay) {
        this.addSpriteToDisplay(spObj.addToDisplay.scene, spObj.addToDisplay.line, spObj.sprite)
      } else if (spObj.selectSpeaker) {
        this.selectSpeaker(spObj.selectSpeaker.scene, spObj.selectSpeaker.line, this.scriptObj['char__' + spObj.sprite])
      }
      this.modalContext.success = 'yes'
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
        if (key.startsWith('sprite__') && value.included) {
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
        speaker: clone(this.scriptObj.char____narrator),
        text: '',
        next: nextName,
        previous: lastName
      }
      // add previous display sprites and speaker by default
      if (lastLine) {
        for (const [key, value] of Object.entries(lastLine)) {
          if (key.startsWith('sprite__') && value.included) {
            newLine['sprite__' + value.keyName] = clone(value)
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
      this.startNum += 1
      // fetch scenes
      var lastScene = null
      if (lastName != '') lastScene = this.scriptObj['scene__' + lastName]
      var nextScene = null
      if (nextName != "") nextScene = this.scriptObj['scene__' + nextName]
      // new scene
      var uniqueID = uuidv4(); // ⇨ '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d'
      var newScene = {
        name : 'new scene ' + this.startNum.toString(),
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
</style>
