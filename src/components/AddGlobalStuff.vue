<template>
    <div>
        <input type="text" :placeholder='"add new " + stuffType' v-model="newExp" maxlength="40" @keypress.enter.prevent="addExp"/>
        <!-- <button @click="addCategory()">Add category</button> -->
    </div>
</template>

<script>
export default {
    props: ['char', 'stuffType'],
    data() {
        return {
            newExp: ""
        }
    },
    methods: {
        addExp() {
            if (this.newExp != "") {
                if (this.stuffType == 'expression') {
                    this.$emit("addExp", {
                        char: this.char,
                        exp: this.newExp
                    })
                } else if (this.stuffType == 'position') {
                    this.$emit("addExp", {
                        pos: this.newExp
                    })
                } else if (this.stuffType == 'sprite') {
                    this.$emit("addExp", {
                        sprite: this.newExp
                    })
                } else if (this.stuffType == 'background') {
                    this.$emit("addExp", {
                        bg: this.newExp
                    })
                } else if (this.stuffType == 'music') {
                    this.$emit("addExp", {
                        ost: this.newExp
                    })
                }
                this.newExp = ""
            }
        }
    }
}
</script>

<style scoped>

</style>