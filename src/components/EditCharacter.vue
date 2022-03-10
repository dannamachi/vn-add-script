<template>
    <!-- Modal -->
    <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">
                    <div v-if='!context.isEditing'>New {{ context.type }} <span v-if='context.type =="flag" || context.type == "optionFlag"'> {{ context.setterFlag ? "that is being set" : "that is needed" }}</span></div>
                    <div v-else>Edit {{ context.type }} <span v-if='context.type =="flag" || context.type == "optionFlag"'>{{ context.setterFlag ? "that is being set" : "that is needed" }}</span></div>
                </h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <div v-if='!context.isEditing'>
                    <p v-if='context.type != "flag" && context.type != "optionFlag"'>Enter to add new {{ context.type }}:</p>

                    <!-- comp to add new global stuff-->
                    <EditFlag v-if='context.type == "flag" || context.type == "optionFlag"' v-bind:context="getEditContext()" @add-exp="onEditFlag" />
                    <div v-else-if="context.type == 'nickable'">
                        <p>
                            name: <input type="text" v-model="nName" maxlength="40" @keypress.enter.prevent="onEditNickable()"/>
                        </p>
                        <p>
                            default nickname: <input type="text" v-model="nNick" maxlength="40" @keypress.enter.prevent="onEditNickable()"/>
                        </p>
                        <p>
                            default pronoun: <input type="text" v-model="nPronoun" maxlength="40" @keypress.enter.prevent="onEditNickable()"/>
                        </p>
                    </div>
                    <AddGlobalStuff v-else v-bind:stuffType='context.type' @add-exp='onAddSprite' />

                    <div v-if='context.success=="yes"' class="alert alert-success" role="alert">
                        new {{ context.type }} added !
                    </div>
                    <div v-else-if='context.success=="no"' class="alert alert-danger" role="alert">
                        cannot add that {{ context.type }} ! try another value ^^
                    </div>
                </div>
                <div v-else>
                    <div v-if='context.type == "flag" || context.type == "optionFlag"'>
                        <EditFlag v-bind:context="getEditContext()" @add-exp="onEditFlag" />
                    </div>
                    <div v-else-if='context.type == "nickable"'>
                        <p>Enter to change nickable from name '{{ this.context.old.name }}', nickname {{ this.context.old.defaultNick }} and pronoun '{{ this.context.old.defaultPronoun }}':</p>
                        <p>
                            name: <input type="text" v-model="nName" maxlength="40" @keypress.enter.prevent="onEditNickable()"/>
                        </p>
                        <p>
                            default nickname: <input type="text" v-model="nNick" maxlength="40" @keypress.enter.prevent="onEditNickable()"/>
                        </p>
                        <p>
                            default pronoun: <input type="text" v-model="nPronoun" maxlength="40" @keypress.enter.prevent="onEditNickable()"/>
                        </p>
                    </div>
                    <div v-else>
                        <p>Enter to change from '{{ this.context.oldName }}':</p>
                        <input type="text" v-model="nameValue" maxlength="40" @keypress.enter.prevent="onAddSprite(null)"/>
                    </div>
                    <div v-if='context.success=="yes"' class="alert alert-success" role="alert">
                        {{ context.type}} updated !
                    </div>
                    <div v-else-if='context.success=="no"' class="alert alert-danger" role="alert">
                        cannot update {{ context.type }} ! try another value ^^
                    </div>
                </div>
            </div>
            </div>
        </div>
    </div>
</template>

<script>
import AddGlobalStuff from './AddGlobalStuff.vue'
import EditFlag from './EditFlag.vue'

export default {
    props: ['context'],
    components: {
        AddGlobalStuff,
        EditFlag
    },
    data() {
        return {
            nameValue: "",
            nName: '',
            nNick: "",
            nPronoun: ""
        }
    },
    methods: {
        onEditNickable() {
            if (this.nName != '' && this.nPronoun != '' && this.nNick != '') {
                this.$emit('addExp', {
                    nName: this.nName,
                    nick: this.nNick,
                    pronoun: this.nPronoun
                })
                this.nName = ''
                this.nNick = ''
                this.nPronoun = ''
            }
        },
        onEditFlag(stuff) {
            if (this.context.scene != '') {
                this.$emit('addExp', {
                    scene: this.context.scene,
                    item: stuff
                })
            } else if (this.context.type == 'optionFlag') {
                this.$emit('addExp', {
                    option: this.context.optionIndex,
                    item: stuff
                })
            } else {
                this.$emit('addExp', { item: stuff})
            }
        },
        getEditContext() {
            var stuff = {
                editing: this.context.isEditing,
                setterFlag: this.context.setterFlag
            }
            if (this.context.isEditing) {
                stuff.type = this.context.old.type
                stuff.oldName = this.context.old.name
                if (this.context.old.type == 'score' || this.context.old.type == 'more' || this.context.old.type == 'less') stuff.oldScore = this.context.old.score
                if (this.context.old.type == 'value' || this.context.old.type == 'diff') stuff.oldValue = this.context.old.value
            }
            return stuff
        },
        onAddSprite(stuff) {
            if (this.context.isEditing) {
                if (this.context.oldName == this.nameValue) return;
                this.$emit('editChara', {
                    oldName: this.context.oldName,
                    newName: this.nameValue
                })
            } else {
                if (this.context.second == 'sprite') {
                    stuff.addToDisplay = {
                        scene: this.context.scene,
                        line: this.context.line
                    }
                } else if (this.context.second == 'speaker') {
                    stuff.selectSpeaker = {
                        scene: this.context.scene,
                        line: this.context.line
                    }
                } else if (this.context.second == 'expression') {
                    stuff.char = this.context.sprite
                    stuff.selectExpression = {
                        scene: this.context.scene,
                        line: this.context.line,
                        sprite: this.context.sprite
                    }
                } else if (this.context.second == 'position') {
                    stuff.selectPosition = {
                        scene: this.context.scene,
                        line: this.context.line,
                        sprite: this.context.sprite
                    }
                }
                this.$emit('addExp', stuff)
            }
            
        }
    }
}
</script>

<style scoped>

</style>