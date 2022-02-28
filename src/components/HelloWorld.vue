<template>
  <div class="hello">
    <!-- show some content stats here -->
    <!-- button -->
    <button @click='downloadJson()'>Download script file</button>
  </div>
</template>

<script>
import clone from 'just-clone';

export default {
  name: 'HelloWorld',
  props: {
    jsonArr: Object
  },
  methods: {
    cleanObject() {
      var deleteDict = {}
      var exportObject = clone(this.jsonArr)
      for (const [key, value] of Object.entries(exportObject)) {
        if (key.startsWith('scene__')) {
          deleteDict[key] = {}
          for (const [key1, value1] of Object.entries(value)) {
            if (key1.startsWith('line__')) {
              deleteDict[key][key1] = {}
              for (const [key2, value2] of Object.entries(value1)) {
                if (key2.startsWith('sprite__')) {
                  if (!value2.included) {
                    deleteDict[key][key1][key2] = value2
                  }
                }
              }
            }
          }
        }
      }

      for (const [scene,stuff1] of Object.entries(deleteDict)) {
        for (const [line,stuff2] of Object.entries(stuff1)) {
          for (const [sprite, stuff3] of Object.entries(stuff2)) {
            stuff3
            delete exportObject[scene][line][sprite]
          }
        }
      }

      exportObject.meta__updated = new Date().toString()
      return exportObject
    },
    downloadJson() {
      var exportObj = this.cleanObject()
      require("downloadjs")(JSON.stringify(exportObj), exportObj.meta__name + "__" + exportObj.meta__author + ".json", "text/plain");
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
