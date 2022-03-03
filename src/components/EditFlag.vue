<template>
    <div v-if='!context.editing'>
        <ul class="nav nav-tabs" id="myTab" role="tablist">
        <li class="nav-item" role="presentation">
            <button class="nav-link active" id="flag-flag-tab" data-bs-toggle="tab" data-bs-target="#flag-flag" type="button" role="tab" aria-controls="flag-flag" aria-selected="true">{{ context.setterFlag ? 'flag' : 'has flag'}}</button>
        </li>
        <li class="nav-item" role="presentation">
            <button class="nav-link" id="flag-score-tab" data-bs-toggle="tab" data-bs-target="#flag-score" type="button" role="tab" aria-controls="flag-score" aria-selected="false">{{ context.setterFlag ? 'score' : 'equal score'}}</button>
        </li>
        <li v-if="!context.setterFlag" class="nav-item" role="presentation">
            <button class="nav-link" id="flag-more-tab" data-bs-toggle="tab" data-bs-target="#flag-more" type="button" role="tab" aria-controls="flag-more" aria-selected="false">higher score</button>
        </li>
        <li v-if="!context.setterFlag" class="nav-item" role="presentation">
            <button class="nav-link" id="flag-less-tab" data-bs-toggle="tab" data-bs-target="#flag-less" type="button" role="tab" aria-controls="flag-less" aria-selected="false">lower score</button>
        </li>
        <li class="nav-item" role="presentation">
            <button class="nav-link" id="flag-value-tab" data-bs-toggle="tab" data-bs-target="#flag-value" type="button" role="tab" aria-controls="flag-value" aria-selected="false">{{ context.setterFlag ? 'value' : 'equal value'}}</button>
        </li>
        <li v-if="!context.setterFlag" class="nav-item" role="presentation">
            <button class="nav-link" id="flag-diff-tab" data-bs-toggle="tab" data-bs-target="#flag-diff" type="button" role="tab" aria-controls="flag-diff" aria-selected="false">not value</button>
        </li>
        </ul>
        <div class="tab-content" id="myTabContent">
            <div class="tab-pane show active" id="flag-flag" role="tabpanel" aria-labelledby="flag-flag-tab">
                {{ context.setterFlag ? "give " : 'need '}}<input type="text" placeholder='flag name' v-model="flagName" maxlength="40" @keypress.enter.prevent="addExp('flag')"/>
            </div>
            <div class="tab-pane" id="flag-score" role="tabpanel" aria-labelledby="flag-score-tab">
                <p><input type="text" placeholder='flag name' v-model="flagName" maxlength="40" @keypress.enter.prevent="addExp('score')"/> equals</p>
                <p><input type="number" placeholder='flag score' v-model="flagScore" @keypress.enter.prevent="addExp('score')"/></p>
            </div>
            <div v-if="!context.setterFlag" class="tab-pane" id="flag-more" role="tabpanel" aria-labelledby="flag-more-tab">
                <p><input type="text" placeholder='flag name' v-model="flagName" maxlength="40" @keypress.enter.prevent="addExp('more')"/> is more than</p>
                <p><input type="number" placeholder='flag score' v-model="flagScore" @keypress.enter.prevent="addExp('more')"/></p>
            </div>
            <div v-if="!context.setterFlag" class="tab-pane" id="flag-less" role="tabpanel" aria-labelledby="flag-less-tab">
                <p><input type="text" placeholder='flag name' v-model="flagName" maxlength="40" @keypress.enter.prevent="addExp('less')"/> is less than</p>
                <p><input type="number" placeholder='flag score' v-model="flagScore" @keypress.enter.prevent="addExp('less')"/></p>
            </div>
            <div class="tab-pane" id="flag-value" role="tabpanel" aria-labelledby="flag-value-tab">
                <p><input type="text" placeholder='flag name' v-model="flagName" maxlength="40" @keypress.enter.prevent="addExp('value')"/>{{ context.setterFlag ? " is" : " has the value"}}</p>
                <p><input type="text" placeholder='flag value' v-model="flagValue" maxlength="40" @keypress.enter.prevent="addExp('value')"/></p>
            </div>
            <div v-if="!context.setterFlag" class="tab-pane" id="flag-diff" role="tabpanel" aria-labelledby="flag-diff-tab">
                <p><input type="text" placeholder='flag name' v-model="flagName" maxlength="40" @keypress.enter.prevent="addExp('diff')"/> does not have the value</p>
                <p><input type="text" placeholder='flag value' v-model="flagValue" maxlength="40" @keypress.enter.prevent="addExp('diff')"/></p>
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
            {{ " < "}}<input type="number" placeholder='new flag score' v-model="flagValue" @keypress.enter.prevent="addExp('less')"/></p>
        </div>
        <div v-else-if='context.type == "diff"'>
            <p>Enter to change from {{ this.context.oldName }} =/= {{ this.context.oldValue }}</p>
            <p><input type="text" placeholder='new flag name' v-model="flagName" maxlength="40" @keypress.enter.prevent="addExp('diff')"/>
            {{ " =/= " }}<input type="text" placeholder='new flag score' v-model="flagScore" maxlength="40" @keypress.enter.prevent="addExp('diff')"/></p>
        </div>
        <div v-else>
            something went wrong ^^
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
                if (this.context.oldName == this.flagName) return
                stuff.oldName = this.context.oldName
            }
            if (flagType == 'flag' && stuff.name != "") {
                this.$emit("addExp", stuff)
                this.flagName = ""
            } else if ((flagType == 'score' || flagType == 'more' || flagType == 'less') && stuff.name != "" && !isNaN(this.flagScore)) {
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