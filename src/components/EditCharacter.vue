<template>
    <!-- Modal -->
    <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">
                    <div v-if='!context.isEditing'>New Character</div>
                    <div v-else>Edit Character</div>
                </h5>
                <button type="button" @click='closeModal()' class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <div v-if='!context.isEditing'>
                    <p>Enter to add new character:</p>
                    <!-- comp to add new global character -->
                    <AddGlobalStuff class='col' v-bind:stuffType='"character"' @add-exp='onAddSprite' />
                    <div v-if='context.success=="yes"' class="alert alert-success" role="alert">
                        new character added !
                    </div>
                    <div v-else-if='context.success=="no"' class="alert alert-danger" role="alert">
                        cannot add that character ! try another name ^^
                    </div>
                </div>
                <div v-else>
                    <p>Enter to change name from '{{ this.context.oldName }}':</p>
                    <input type="text" v-model="nameValue" maxlength="40" @keypress.enter.prevent="onAddSprite(null)"/>
                    <div v-if='context.success=="yes"' class="alert alert-success" role="alert">
                        character name updated !
                    </div>
                    <div v-else-if='context.success=="no"' class="alert alert-danger" role="alert">
                        cannot update character ! try another name ^^
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

export default {
    props: ['context'],
    components: {
        AddGlobalStuff
    },
    data() {
        return {
            nameValue: ""
        }
    },
    methods: {
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
                }
                this.$emit('addExp', stuff)
            }
            
        }
    }
}
</script>

<style scoped>

</style>