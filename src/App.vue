<template>
  <!-- nav bar -->
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
          <li class='nav-item mx-1'>
            <button class="btn btn-primary" @click='addNewScene()'>add scene</button>
          </li>
          <!-- download -->
          <li class='nav-item mx-1'>
              <HelloWorld v-bind:jsonArr='scriptObj' />
          </li>
        </ul>
      </div>
    </div>
  </nav>

  <!-- section info tab -->
  <ul class="nav nav-tabs" id="myTab" role="tablist">
    <li class="nav-item" role="presentation">
      <button class="nav-link active" id="home-tab" data-bs-toggle="tab" data-bs-target="#home" type="button" role="tab" aria-controls="home" aria-selected="true">section info</button>
    </li>
    <li class="nav-item" role="presentation">
      <button class="nav-link" id="profile-tab" data-bs-toggle="tab" data-bs-target="#profile" type="button" role="tab" aria-controls="profile" aria-selected="false">load section</button>
    </li>
    <li class="nav-item" role="presentation">
      <button class="nav-link" id="contact-tab" data-bs-toggle="tab" data-bs-target="#contact" type="button" role="tab" aria-controls="contact" aria-selected="false">characters & flags</button>
    </li>
  </ul>
  <div class="tab-content" id="myTabContent">
    <div class="tab-pane show active" id="home" role="tabpanel" aria-labelledby="home-tab">
      <div class='pt-2 pb-2'>
      <p>name: 
        <input v-model='scriptObj.meta__name' />
      </p>
      <p>author: 
        <input v-model='scriptObj.meta__author' />
      </p>
      <div>{{ scriptObj.meta__scount }} scene(s), {{ scriptObj.meta__ccount - 1 }} characters (excl. default narrator)</div>
      </div>
    </div>
    <div class="tab-pane" id="profile" role="tabpanel" aria-labelledby="profile-tab">
      <div class='mt-2 mb-2'>
      <div v-if='errMsg != ""' class="alert alert-danger" role="alert">
        {{ errMsg }}
      </div>
      <textarea name="text" placeholder="paste script text here..." v-model='inputJSON'></textarea>
      <div><button class='btn btn-info' type='button' @click='loadScript()'>load section</button></div>
      </div>
    </div>
    <div class="tab-pane" id="contact" role="tabpanel" aria-labelledby="contact-tab">
      <div class="mt-1 mb-1">
        <div class='dropdown mt-1 mb-1'>
          <button class="btn btn-secondary dropdown-toggle" type="button" id='dropdownMenuButtonEChara' data-bs-toggle="dropdown" aria-expanded="false">
            select character to edit
          </button>
          <ul class="dropdown-menu" aria-labelledby="dropdownMenuButtonEChara">
            <li v-for='(speaking2, index21) in getAllSprites(true)' :key='index21'>
              <button type='button' class='dropdown-item' data-bs-toggle="modal" data-bs-target="#exampleModal" @click='updateModalContext({
                scene: "",
                line: "",
                isEditing: true,
                second: "",
                type: "character",
                oldName: speaking2.name
                })'>{{ speaking2.name }}</button>
            </li>
            <li class='dropdown-item'>
              <button @click='updateModalContext({
                scene: "",
                line: "",
                isEditing: false,
                type: "character",
                second: ""
                })' type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal">
                add new character
              </button>
            </li>
          </ul>
        </div>
        <div class='dropdown mt-1 mb-1'>
          <button class="btn btn-secondary dropdown-toggle" type="button" id='dropdownMenuButtonFlag' data-bs-toggle="dropdown" aria-expanded="false">
            flags required by section
          </button>
          <ul class="dropdown-menu" aria-labelledby='dropdownMenuButtonFlag'>
            <li class='dropdown-item' v-for='(flag, index22) in scriptObj.meta__flagList' :key='index22'>
              <button type='button' class='btn btn-link' @click='removeFlag(flag)'>[x]</button>
              <button class='btn btn-link' @click='updateModalContext({
                scene: "",
                line: "",
                isEditing: true,
                second: "",
                type: "flag",
                setterFlag: false,
                old: flag
                })' data-bs-toggle="modal" data-bs-target="#exampleModal">{{ getFlagDisplay(flag) }}</button>
            </li>
            <li class='dropdown-item'>
              <button @click='updateModalContext({
                scene: "",
                line: "",
                isEditing: false,
                type: "flag",
                second: "",
                setterFlag: false
                })' type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal">
                add new flag
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>

  <!-- accordion for scene list -->
  <div class="accordion card" id="sceneList">

    <div class="accordion-item card" v-for='(scene, index) in getScenes()' :key="'scene' + scene.keyName">
      <h3 class='accordion-header' :id='"sceneHeading"+scene.keyName'>
        <button class='accordion-button' type='button' data-bs-toggle='collapse' :data-bs-target='"#sceneCollapse"+scene.keyName' aria-expanded="true" :aria-controls='"sceneCollapse"+scene.keyName'>
          {{ scriptObj["scene__" + scene.keyName].name }} {{index}}
        </button>
      </h3>
      <div :id='"sceneCollapse"+scene.keyName' :class="{'accordion-collapse':true, collapse: true, show: index == scriptObj.meta__scount - 1}" :aria-labelledby='"sceneHeading"+scene.keyName' data-bs-parent="#sceneList">
        <div class='accordion-body'>

          <!-- (DEV) sceneID: {{ scene.keyName }} -->
          <div>scene: <input v-model='scriptObj["scene__" + scene.keyName].name' /> written by: <input v-model='scriptObj["scene__" + scene.keyName].author' /></div>

          <!-- section to display line for edit -->
          <div class='card-body container-fluid'>
            <div v-for='(line, index2) in getLines(scene)' class='row mb-3 lineBox' :key='index2'>
              <p>~~o0o~~</p>
              <!-- (DEV) lineID: {{ line.keyName }} -->
              <!-- if not display same, show current display list, add new display char -->

              <!-- <div class='container-lg' :id="'collapseExample' + line.keyName">

                <div class='row lineBox'> -->
                  <!-- show current display sprites -->
                  <div class='card border-primary col-sm-8 pt-2'>
                    <div class='card-title'>
                      <!-- add new char to display -->
                      <div v-if="getSprites(line).length >= 3">3 sprites only !</div>
                      <div class='dropdown' v-else>
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
                          <li class='dropdown-item'>
                            <button @click='updateModalContext({
                              scene: scene.keyName,
                              line: line.keyName,
                              isEditing: false,
                              type: "character",
                              second: "sprite"
                              })' type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal">
                              add new character
                            </button>
                          </li>
                        </ul>
                      </div>
                    </div>
                    <div class='row justify-content-md-center'>
                      <div 
                        v-for='(sprite, index4) in getSprites(line)' 
                        :key='index4' 
                        class='col-auto card mx-2 mb-2 pb-1'>
                        <div>
                          <a class='btn-link' @click='removeSpriteFromDisplay(scene.keyName, line.keyName, sprite.keyName)'>[x]</a>
                          showing: {{ scriptObj["scene__" + scene.keyName]["line__" + line.keyName]["sprite__" + sprite.keyName].name }}
                        </div>
                        <div>
                          <!-- section for expressions -->
                          <div class="dropdown">
                            <button class="btn btn-secondary dropdown-toggle" type="button" :id="'dropdownMenuButtonExpression'+scene.keyName+line.keyName+sprite.keyName" data-bs-toggle="dropdown" aria-expanded="false">
                              ({{ scriptObj["scene__" + scene.keyName]["line__" + line.keyName]["sprite__" + sprite.keyName].exp }})
                            </button>
                            <ul class="dropdown-menu" :aria-labelledby="'dropdownMenuButtonExpression'+scene.keyName+line.keyName+sprite.keyName">
                              <li v-for='(charExp, index5) in getExpressions(sprite.keyName)' :key='index5'>
                                <button type='button' class='dropdown-item' @click='selectExpression(scene.keyName, line.keyName, sprite.keyName, charExp)'>{{ charExp }}</button>
                              </li>
                              <li class='dropdown-item'>
                                <button @click='updateModalContext({
                                  scene: scene.keyName,
                                  line: line.keyName,
                                  sprite: sprite.keyName,
                                  isEditing: false,
                                  second: "expression",
                                  type: "expression"
                                  })' type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal">
                                  add new expression
                                </button>
                              </li>
                            </ul>
                          </div>

                          <!-- section for positions -->
                          <div class="dropdown">
                            <button class="btn btn-secondary dropdown-toggle" type="button" :id="'dropdownMenuButtonPosition'+scene.keyName+line.keyName+sprite.keyName" data-bs-toggle="dropdown" aria-expanded="false">
                              at {{ scriptObj["scene__" + scene.keyName]["line__" + line.keyName]["sprite__" + sprite.keyName].pos }} 
                            </button>
                            <ul class="dropdown-menu" :aria-labelledby="'dropdownMenuButtonPosition'+scene.keyName+line.keyName+sprite.keyName">
                              <li v-for='(cPos, index6) in scriptObj.meta__posList' :key='index6'>
                                <button type='button' class='dropdown-item' @click='selectPosition(scene.keyName, line.keyName, sprite.keyName, cPos)'>{{ cPos }}</button>
                              </li>
                              <li class='dropdown-item'>
                                <button @click='updateModalContext({
                                  scene: scene.keyName,
                                  line: line.keyName,
                                  sprite: sprite.keyName,
                                  isEditing: false,
                                  second: "position",
                                  type: "position"
                                  })' type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal">
                                  add new position
                                </button>
                              </li>
                            </ul>
                          </div>

                          <!-- <input type="checkbox" v-model='scriptObj["scene__" + scene.keyName]["line__" + line.keyName]["sprite__" + sprite.keyName].included' />displayed -->
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class='card border-primary col-sm-4 pb-2 pt-2'>
                    <!-- speaker section -->
                    <div class='card-title'>
                        <div class="dropdown">
                          <button class="btn btn-secondary dropdown-toggle" type="button" :id="'dropdownMenuButtonSpeaker'+scene.keyName+line.keyName" data-bs-toggle="dropdown" aria-expanded="false">
                            speaking: {{ scriptObj["scene__" + scene.keyName]["line__" + line.keyName].speaker.name }}
                          </button>                    
                          <!-- button to add line (indexed unique name) -->
                          <button class="btn btn-link" @click='onAddLine(scene.keyName, line.keyName, line.next)'>add line</button>

                          <ul class="dropdown-menu" :aria-labelledby="'dropdownMenuButtonSpeaker'+scene.keyName+line.keyName">
                            <li v-for='(speaking, index8) in getAllSprites()' :key='index8'>
                              <button type='button' class='dropdown-item' @click='selectSpeaker(scene.keyName, line.keyName, speaking)'>{{ speaking.name }}</button>
                            </li>
                            <li class='dropdown-item'>
                              <button @click='updateModalContext({
                                scene: scene.keyName,
                                line: line.keyName,
                                isEditing: false,
                                second: "speaker",
                                type: "character"
                                })' type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal">
                                add new character
                              </button>
                            </li>
                          </ul>
                        </div>
                      </div>

                    <!-- text section -->
                    <textarea class='card-body' name="text" maxlength='350' placeholder="write something here, enter to add new line" @keypress.enter.prevent='onAddLine(scene.keyName, line.keyName, line.next)' v-model='scriptObj["scene__" + scene.keyName]["line__" + line.keyName].text'></textarea>
                  </div>

                <!-- </div>

              </div> -->
            </div>
          </div>

          <p>~~o0o~~</p>
          <!-- other scene info section -->
          <button class="btn btn-secondary" type="button" data-bs-toggle="collapse" :data-bs-target="'#collapseBGOST' + scene.keyName" aria-expanded="false" :aria-controls="'collapseBGOST' + scene.keyName">
            toggle background and music
          </button>
          <div class='collapse container-lg' :id='"collapseBGOST" + scene.keyName'>
            <div class='row'>
              <!-- bg section -->
              <div class="col dropdown">
                <button class="btn btn-secondary dropdown-toggle" type="button" :id="'dropdownMenuButtonBG'+scene.keyName" data-bs-toggle="dropdown" aria-expanded="false">
                  background: {{ scriptObj["scene__" + scene.keyName].background }}
                </button>                    
                <ul class="dropdown-menu" :aria-labelledby="'dropdownMenuButtonBG'+scene.keyName">
                  <li v-for='(bg, index10) in scriptObj.meta__bgList' :key='index10'>
                    <button type='button' class='dropdown-item'  @click='selectBG(scene.keyName, bg)'>{{ bg }}</button>
                  </li>
                  <li class='dropdown-item'>
                    <button @click='updateModalContext({
                      scene: scene.keyName,
                      line: "",
                      isEditing: false,
                      second: "",
                      type: "background"
                      })' type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal">
                      add new background
                    </button>
                  </li>
                </ul>
              </div>

              <!-- ost section  -->
              <div class="col dropdown">
                <button class="btn btn-secondary dropdown-toggle" type="button" :id="'dropdownMenuButtonOST'+scene.keyName" data-bs-toggle="dropdown" aria-expanded="false">
                  music: {{ scriptObj["scene__" + scene.keyName].ost }}
                </button>                
                <ul class="dropdown-menu" :aria-labelledby="'dropdownMenuButtonOST'+scene.keyName">
                  <li v-for='(ost, index11) in scriptObj.meta__ostList' :key='index11'>
                    <button type='button' class='dropdown-item'  @click='selectOST(scene.keyName, ost)'>{{ ost }}</button>
                  </li>
                  <li class='dropdown-item'>
                    <button @click='updateModalContext({
                      scene: scene.keyName,
                      line: "",
                      isEditing: false,
                      second: "",
                      type: "music"
                      })' type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal">
                      add new music
                    </button>
                  </li>
                </ul>
              </div>

              <!-- flag section -->
              <div class='col dropdown'>
                <button class="btn btn-secondary dropdown-toggle" type="button" id='dropdownMenuButtonFlagSet' data-bs-toggle="dropdown" aria-expanded="false">
                  flags given by scene
                </button>
                <ul class="dropdown-menu" aria-labelledby='dropdownMenuButtonFlagSet'>
                  <li class='dropdown-item' v-for='(flag2, index23) in scene.meta__flagList' :key='index23'>
                    <button type='button' class='btn btn-link' @click='removeFlagFromScene(scene.keyName, flag2)'>[x]</button>
                    <button class='btn btn-link' @click='updateModalContext({
                      scene: scene.keyName,
                      line: "",
                      isEditing: true,
                      second: "",
                      type: "flag",
                      setterFlag: true,
                      old: flag2
                      })' data-bs-toggle="modal" data-bs-target="#exampleModal">{{ getFlagDisplay(flag2, true) }}</button>
                  </li>
                  <li class='dropdown-item'>
                    <button @click='updateModalContext({
                      scene: scene.keyName,
                      line: "",
                      isEditing: false,
                      type: "flag",
                      second: "",
                      setterFlag: true
                      })' type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal">
                      add new flag
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div class='text-muted'>
            lines: {{ getLines(scene).length }}
            <!-- button to add line (indexed unique name) -->
            <button class="btn btn-link" @click='onAddScene(scene.keyName, scene.next)'>add scene</button>
          </div>
        </div>
      </div>
    </div>

  </div>

  <!-- modal to edit character -->
  <EditCharacter v-bind:context='modalContext' @add-exp='onModalProcess' @edit-chara='onEditChara' />

</template>

<script>
import HelloWorld from './components/HelloWorld.vue'
import EditCharacter from './components/EditCharacter.vue'
import { v4 as uuidv4 } from 'uuid';
import clone from 'just-clone';
import { reactive } from "vue";
// let copiedPerson = JSON.parse(JSON.stringify(person));

export default {
  name: 'App',
  components: {
    HelloWorld,
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
      'meta__endName'     : '',

      // flags
      'meta__flagList' : []
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
    removeFlag(stuff) {
      var found = -1;
      for (var i=0; i<this.scriptObj.meta__flagList.length; i++) {
        if (this.scriptObj.meta__flagList[i].name == stuff.name) {
          found = i
          break
        }
      }
      this.scriptObj.meta__flagList.splice(found,1)
    },

    onEditFlagFromScene(sstuff) {
      var stuff = sstuff.item
      var found = -1
      for (var i=0; i < this.scriptObj['scene__' + sstuff.scene].meta__flagList.length; i++) {
        if (this.scriptObj['scene__' + sstuff.scene].meta__flagList[i].name == stuff.name) {
          if (this.scriptObj['scene__' + sstuff.scene].meta__flagList[i].name != stuff.oldName) {
            this.modalContext.success = 'no'
            return;
          } 
        }
        if (this.scriptObj['scene__' + sstuff.scene].meta__flagList[i].name == stuff.oldName) {
          found = i
        }
      }

      if (found == -1) {
        this.modalContext.success = 'no'
        return;
      }
      this.scriptObj['scene__' + sstuff.scene].meta__flagList.splice(found, 1)
      delete stuff['oldName']

      this.scriptObj['scene__' + sstuff.scene].meta__flagList.push(stuff);
      this.modalContext.success = 'yes'
      this.modalContext.old = stuff
    },
    onAddFlagFromScene(sstuff) {
      // NOTE: backward compatible meta
      var stuff = sstuff.item
      for (var pos of this.scriptObj['scene__' + sstuff.scene].meta__flagList) {
        if (pos.name == stuff.name) {
          this.modalContext.success = 'no'
          return;
        }
      }
      this.scriptObj['scene__' + sstuff.scene].meta__flagList.push(stuff);
      this.modalContext.success = 'yes'
    },
    onAddFlag(stuff) {
      for (var pos of this.scriptObj.meta__flagList) {
        if (pos.name == stuff.name) {
          this.modalContext.success = 'no'
          return;
        }
      }
      this.scriptObj.meta__flagList.push(stuff);
      this.modalContext.success = 'yes'
    },
    onEditFlag(stuff) {
      var found = -1
      for (var i=0; i < this.scriptObj.meta__flagList.length; i++) {
        if (this.scriptObj.meta__flagList[i].name == stuff.name) {
          if (this.scriptObj.meta__flagList[i].name != stuff.oldName) {
            this.modalContext.success = 'no'
            return;
          } 
        }
        if (this.scriptObj.meta__flagList[i].name == stuff.oldName) {
          found = i
        }
      }

      if (found == -1) {
        this.modalContext.success = 'no'
        return;
      }
      this.scriptObj.meta__flagList.splice(found, 1)
      delete stuff['oldName']

      this.scriptObj.meta__flagList.push(stuff);
      this.modalContext.success = 'yes'
      this.modalContext.old = stuff
    },
    onModalProcess(stuff) {
      // console.log(stuff)
      if (this.modalContext.type == 'background') this.onAddBG(stuff)
      else if (this.modalContext.type == 'music') this.onAddOST(stuff)
      else if (this.modalContext.type == 'character' && !this.modalContext.isEditing) {
        this.onAddSprite(stuff)
      } else if (this.modalContext.type == 'expression' && !this.modalContext.isEditing) {
        this.onAddExpression(stuff)
      } else if (this.modalContext.type == 'position' && !this.modalContext.isEditing) {
        this.onAddPosition(stuff)
      } else if (this.modalContext.type == 'flag') {
        if (this.modalContext.isEditing) {
          if (!this.modalContext.setterFlag) this.onEditFlag(stuff)
          else this.onEditFlagFromScene(stuff)
        }
        else {
          if (!this.modalContext.setterFlag) this.onAddFlag(stuff)
          else this.onAddFlagFromScene(stuff)
        }
      }
    },
    onEditChara(stuff) {
      // check no duplicate
      if (stuff.newName == '__narrator') {
        this.modalContext.success = 'no'
        return;
      }
      for (const [key, value] of Object.entries(this.scriptObj)) {
        if (key.startsWith('char__')) {
          if (value.keyName == stuff.newName) {
            this.modalContext.success = 'no'
            return;
          }
        }
      }

      // clone char data
      var newChar = clone(this.scriptObj['char__' + stuff.oldName])
      newChar.keyName = stuff.newName,
      newChar.name = stuff.newName
      this.scriptObj['char__' + stuff.newName] = newChar
      // delete old
      delete this.scriptObj['char__' + stuff.oldName]

      // update all existing data with new char name
      for (const [key,value] of Object.entries(this.scriptObj)) {
        if (key.startsWith('scene__')) {
          for (const [key1, value1] of Object.entries(value)) {
            if (key1.startsWith('line__')) {
              for (const [key2, value2] of Object.entries(value1)) {
                if (key2 == 'sprite__' + stuff.oldName) {
                  // add new
                  var newObj = clone(value2)
                  newObj.keyName = stuff.newName
                  newObj.name = stuff.newName
                  this.scriptObj[key][key1]['sprite__' + stuff.newName] = newObj
                  // delete old
                  delete this.scriptObj[key][key1][key2]
                } 
                else if (key2 == 'speaker' && value2.keyName == stuff.oldName) {
                  this.scriptObj[key][key1].speaker = this.scriptObj['char__' + stuff.newName]
                }
              }
            }
          }
        }
      }
      this.modalContext.success = 'yes'
      this.modalContext.oldName = stuff.newName
    },

    updateModalContext(newUpdate) {
      for (const [key, value] of Object.entries(newUpdate)) {
        this.modalContext[key] = value
      }

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
          this.modalContext.success = 'no'
          return;
        }
      }
      this.scriptObj.meta__bgList.push(bgObj.bg);
      this.modalContext.success = 'yes'
    },
    onAddOST(ostObj) {
      for (var ost of this.scriptObj.meta__ostList) {
        if (ost == ostObj.ost) {
          this.modalContext.success = 'no'
          return;
        }
      }
      this.scriptObj.meta__ostList.push(ostObj.ost);
      this.modalContext.success = 'yes'
    },
    onAddPosition(posObj) {
      for (var pos of this.scriptObj.meta__posList) {
        if (pos == posObj.pos) {
          this.modalContext.success = 'no'
          return;
        }
      }
      this.scriptObj.meta__posList.push(posObj.pos);

      // select pos
      if (posObj.selectPosition) {
        this.selectPosition(posObj.selectPosition.scene, posObj.selectPosition.line, posObj.selectPosition.sprite, posObj.pos)
      }
      this.modalContext.success = 'yes'
    },
    onAddExpression(expObj) {
      for (const [key, value] of Object.entries(this.scriptObj)) {
        if (key.startsWith('char__')) {
          if (value.keyName == expObj.char && value.keyName != '__narrator') {
            if (value.expList.includes(expObj.exp)) {
              this.modalContext.success = 'no'
              return;
            } else {
              value.expList.push(expObj.exp)
              break;
            }

          }
        }
      }

      // select exp
      if (expObj.selectExpression) {
        this.selectExpression(expObj.selectExpression.scene, expObj.selectExpression.line, expObj.selectExpression.sprite, expObj.exp)
      }
      this.modalContext.success = 'yes'
    },

    getFlagDisplay(flag, setter=false) {
      if (flag.type == 'flag') return (setter ? 'give ' : 'need ') + flag.name 
      if (flag.type == 'score') return flag.name + ' = ' + flag.score
      if (flag.type == 'value') return flag.name + ' : ' + flag.value
      if (flag.type == 'more') return flag.name + ' > ' + flag.score
      if (flag.type == 'less') return flag.name + ' < ' + flag.score
      if (flag.type == 'diff') return flag.name + ' =/= ' + flag.value
      return 'invalid flag'
    },
    getAllSprites(noNar=false) {
      var sList = []
      for (const [key, value] of Object.entries(this.scriptObj)) {
        if (key.startsWith('char__')) {
          if (!noNar) sList.push(value)
          else if (key != 'char____narrator') sList.push(value)
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
        ost: this.scriptObj.meta__ostList[0],
        meta__flagList: []
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
