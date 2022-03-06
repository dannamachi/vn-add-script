<template>
<div class='container'>
    <div v-if='!context.editing' class='row'>
        <div class='col-sm-4 d-flex align-items-start'>
            <div class="nav nav-pills flex-column me-6" id="myTab" role="tablist" aria-orientation="vertical">
                <button class="nav-link active" id="flag-flag-tab" data-bs-toggle="pill" data-bs-target="#flag-flag" type="button" role="tab" aria-controls="flag-flag" aria-selected="true">{{ context.setterFlag ? 'flag' : 'has flag'}}</button>

                <button class="nav-link" id="flag-score-tab" data-bs-toggle="pill" data-bs-target="#flag-score" type="button" role="tab" aria-controls="flag-score" aria-selected="false">{{ context.setterFlag ? 'score' : 'equal score'}}</button>

                <button v-if="!context.setterFlag" class="nav-link" id="flag-more-tab" data-bs-toggle="pill" data-bs-target="#flag-more" type="button" role="tab" aria-controls="flag-more" aria-selected="false">higher score</button>

                <button v-if="!context.setterFlag" class="nav-link" id="flag-less-tab" data-bs-toggle="pill" data-bs-target="#flag-less" type="button" role="tab" aria-controls="flag-less" aria-selected="false">lower score</button>

                <button class="nav-link" id="flag-value-tab" data-bs-toggle="pill" data-bs-target="#flag-value" type="button" role="tab" aria-controls="flag-value" aria-selected="false">{{ context.setterFlag ? 'value' : 'equal value'}}</button>

                <button v-if="!context.setterFlag" class="nav-link" id="flag-diff-tab" data-bs-toggle="pill" data-bs-target="#flag-diff" type="button" role="tab" aria-controls="flag-diff" aria-selected="false">not value</button>

                <button class="nav-link" id="flag-inc-tab" data-bs-toggle="pill" data-bs-target="#flag-inc" type="button" role="tab" aria-controls="flag-inc" aria-selected="false">increase score</button>

                <button class="nav-link" id="flag-dec-tab" data-bs-toggle="pill" data-bs-target="#flag-dec" type="button" role="tab" aria-controls="flag-dec" aria-selected="false">decrease score</button>
            </div>
        </div>
        <div class="tab-content col-sm-8" id="myTabContent">
            <p class='mb-5'>Enter to add new {{ context.setterFlag ? 'setter' : 'condition' }}flag:</p>
            <div class="tab-pane show active" id="flag-flag" role="tabpanel" aria-labelledby="flag-flag-tab">
                {{ context.setterFlag ? "give " : 'need '}}<input type="text" placeholder='flag name' v-model="flagName" maxlength="40" @keypress.enter.prevent="addExp('flag')"/>
            </div>
            <div class="tab-pane" id="flag-score" role="tabpanel" aria-labelledby="flag-score-tab">
                <p><input type="text" placeholder='flag name' v-model="flagName" maxlength="40" @keypress.enter.prevent="addExp('score')"/></p>
                <p>equals</p>
                <p><input type="number" placeholder='flag score' v-model="flagScore" @keypress.enter.prevent="addExp('score')"/></p>
            </div>
            <div v-if="!context.setterFlag" class="tab-pane" id="flag-more" role="tabpanel" aria-labelledby="flag-more-tab">
                <p><input type="text" placeholder='flag name' v-model="flagName" maxlength="40" @keypress.enter.prevent="addExp('more')"/></p>
                <p>is more than</p>
                <p><input type="number" placeholder='flag score' v-model="flagScore" @keypress.enter.prevent="addExp('more')"/></p>
            </div>
            <div v-if="!context.setterFlag" class="tab-pane" id="flag-less" role="tabpanel" aria-labelledby="flag-less-tab">
                <p><input type="text" placeholder='flag name' v-model="flagName" maxlength="40" @keypress.enter.prevent="addExp('less')"/></p>
                <p>is less than</p>
                <p><input type="number" placeholder='flag score' v-model="flagScore" @keypress.enter.prevent="addExp('less')"/></p>
            </div>
            <div class="tab-pane" id="flag-value" role="tabpanel" aria-labelledby="flag-value-tab">
                <p><input type="text" placeholder='flag name' v-model="flagName" maxlength="40" @keypress.enter.prevent="addExp('value')"/></p>
                <p>{{ context.setterFlag ? " is" : " has the value"}}</p>
                <p><input type="text" placeholder='flag value' v-model="flagValue" maxlength="40" @keypress.enter.prevent="addExp('value')"/></p>
            </div>
            <div v-if="!context.setterFlag" class="tab-pane" id="flag-diff" role="tabpanel" aria-labelledby="flag-diff-tab">
                <p><input type="text" placeholder='flag name' v-model="flagName" maxlength="40" @keypress.enter.prevent="addExp('diff')"/></p>
                <p>does not have the value</p>
                <p><input type="text" placeholder='flag value' v-model="flagValue" maxlength="40" @keypress.enter.prevent="addExp('diff')"/></p>
            </div>
            <div class="tab-pane" id="flag-inc" role="tabpanel" aria-labelledby="flag-inc-tab">
                <p><input type="text" placeholder='flag name' v-model="flagName" maxlength="40" @keypress.enter.prevent="addExp('inc')"/></p>
                <p>increases by</p>
                <p><input type="number" placeholder='increase value' v-model="flagScore" @keypress.enter.prevent="addExp('inc')"/></p>
            </div>
            <div class="tab-pane" id="flag-dec" role="tabpanel" aria-labelledby="flag-dec-tab">
                <p><input type="text" placeholder='flag name' v-model="flagName" maxlength="40" @keypress.enter.prevent="addExp('dec')"/></p>
                <p>decreases by</p>
                <p><input type="number" placeholder='decrease value' v-model="flagScore" @keypress.enter.prevent="addExp('dec')"/></p>
            </div>
        </div>
    </div>
    <div v-else>
        <div v-if='context.type == "flag"'>
            <p>Enter to change from {{ context.setterFlag ? "giving " : "having "}} {{ this.context.oldName }}:</p>
            <input type="text" placeholder='new flag name' v-model="flagName" maxlength="40" @keypress.enter.prevent="addExp('flag')"/>
        </div>
        <div v-else-if='context.type == "score"'>
            <p>Enter to change from {{ this.context.oldName }} = {{ this.context.oldScore }}</p>
            <p><input type="text" placeholder='new flag name' v-model="flagName" maxlength="40" @keypress.enter.prevent="addExp('score')"/>{{ " = " }}
            <input type="number" placeholder='new flag score' v-model="flagScore" @keypress.enter.prevent="addExp('score')"/></p>
        </div>
        <div v-else-if='context.type == "value"'>
            <p>Enter to change from {{ this.context.oldName }} : {{ this.context.oldValue }}</p>
            <p><input type="text" placeholder='new flag name' v-model="flagName" maxlength="40" @keypress.enter.prevent="addExp('value')"/>{{ " : "}}
            <input type="text" placeholder='new flag value' v-model="flagValue" maxlength="40" @keypress.enter.prevent="addExp('value')"/></p>
        </div>
        <div v-else-if='context.type == "more"'>
            <p>Enter to change from {{ this.context.oldName + " > " }}{{ this.context.oldScore }}</p>
            <p><input type="text" placeholder='new flag name' v-model="flagName" maxlength="40" @keypress.enter.prevent="addExp('more')"/>
            {{ " > "}}<input type="number" placeholder='new flag score' v-model="flagScore" @keypress.enter.prevent="addExp('more')"/></p>
        </div>
        <div v-else-if='context.type == "less"'>
            <p>Enter to change from {{ this.context.oldName + " < " }}{{ this.context.oldScore }}</p>
            <p><input type="text" placeholder='new flag name' v-model="flagName" maxlength="40" @keypress.enter.prevent="addExp('less')"/>
            {{ " < "}}<input type="number" placeholder='new flag score' v-model="flagScore" @keypress.enter.prevent="addExp('less')"/></p>
        </div>
        <div v-else-if='context.type == "diff"'>
            <p>Enter to change from {{ this.context.oldName }} =/= {{ this.context.oldValue }}</p>
            <p><input type="text" placeholder='new flag name' v-model="flagName" maxlength="40" @keypress.enter.prevent="addExp('diff')"/>
            {{ " =/= " }}<input type="text" placeholder='new flag value' v-model="flagValue" maxlength="40" @keypress.enter.prevent="addExp('diff')"/></p>
        </div>
        <div v-else-if='context.type == "inc"'>
            <p>Enter to change from {{ this.context.oldName + " + " }}{{ this.context.oldScore }}</p>
            <p><input type="text" placeholder='new flag name' v-model="flagName" maxlength="40" @keypress.enter.prevent="addExp('inc')"/>
            {{ " < "}}<input type="number" placeholder='new increase value' v-model="flagScore" @keypress.enter.prevent="addExp('inc')"/></p>
        </div>
        <div v-else-if='context.type == "dec"'>
            <p>Enter to change from {{ this.context.oldName + " - " }}{{ this.context.oldScore }}</p>
            <p><input type="text" placeholder='new flag name' v-model="flagName" maxlength="40" @keypress.enter.prevent="addExp('dec')"/>
            {{ " < "}}<input type="number" placeholder='new decrease value' v-model="flagScore" @keypress.enter.prevent="addExp('dec')"/></p>
        </div>
        <div v-else>
            something went wrong ^^
        </div>
    </div>
</div>
</template>

<script>
export default {
    props: ['context'],
    data() {
        return {
            flagName: "",
            flagScore: 0,
            flagValue: ""
        }
    },
    methods: {
        addExp(flagType) {
            var stuff = {
                name: this.flagName,
                type: flagType
            }
            if (this.context.editing) {
                stuff.oldName = this.context.oldName
            }
            if (flagType == 'flag' && stuff.name != "") {
                this.$emit("addExp", stuff)
                this.flagName = ""
            } else if ((flagType == 'score' || flagType == 'more' || flagType == 'less' || flagType == 'inc' || flagType == 'dec') && stuff.name != "" && !isNaN(this.flagScore)) {
                stuff.score = this.flagScore
                this.$emit("addExp", stuff)
                this.flagName = ""
                this.flagScore = 0
            } else if ((flagType == 'value' || flagType == 'diff') && stuff.name != "" && this.flagValue != "") {
                stuff.value = this.flagValue
                this.$emit("addExp", stuff)
                this.flagName = ""
                this.flagValue = ""
            }
        }
    }
}
</script>

<style scoped>

</style>