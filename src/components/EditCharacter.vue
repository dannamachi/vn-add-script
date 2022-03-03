<template>
    <!-- Modal -->
    <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">
                    <div v-if='!context.isEditing'>New {{ context.type }} {{ context.type =="flag" && context.setterFlag ? "that is being set" : "that is needed" }}</div>
                    <div v-else>Edit {{ context.type }} {{ context.type =="flag" && context.setterFlag ? "that is being set" : "that is needed" }}</div>
                </h5>
                <button type="button" @click='closeModal()' class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <div v-if='!context.isEditing'>
                    <p v-if='context.type != "flag"'>Enter to add new {{ context.type }}:</p>

                    <!-- comp to add new global stuff-->
                    <EditFlag v-if='context.type == "flag"' v-bind:context="getEditContext()" @add-exp="onEditFlag" />
                    <AddGlobalStuff v-else v-bind:stuffType='context.type' @add-exp='onAddSprite' />

                    <div v-if='context.success=="yes"' class="alert alert-success" role="alert">
                        new {{ context.type }} added !
                    </div>
                    <div v-else-if='context.success=="no"' class="alert alert-danger" role="alert">
                        cannot add that {{ context.type }} ! try another value ^^
                    </div>
                </div>
                <div v-else>
                    <div v-if='context.type == "flag"'>
                        <EditFlag v-bind:context="getEditContext()" @add-exp="onEditFlag" />
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
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                <!-- <button type="button" class="btn btn-primary">Save changes</button> -->
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
            nameValue: ""
        }
    },
    methods: {
        onEditFlag(stuff) {
            this.$emit('addExp', stuff)
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
        closeModal() {
            this.$emit('closeModal')
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