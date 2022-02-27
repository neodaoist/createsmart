<template>
    <div class="wizard">
        <div @click="goTo('choice')" :class="['step', {active: (step === 'choice'), completed:['form', 'split', 'confirm'].indexOf(step) !== -1}]">
            <div class="number">1</div>
            <div class="separator"></div>
        </div>
        <div @click="goTo('form')" :class="['step', {active: (step === 'form'), completed:['split', 'confirm'].indexOf(step) !== -1}]">
            <div class="number">2</div>
            <div class="separator"></div>
        </div>
        <div @click="goTo('split')" :class="['step', {active: (step === 'split'), completed:['confirm'].indexOf(step) !== -1}]">
            <div class="number">3</div>
            <div class="separator"></div>
        </div>
        <div @click="goTo('confirm')" :class="['step', {active: (step === 'confirm')}]">
            <div class="number">4</div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        step: {
            required: true
        }
    },

    methods: {
        goTo(step) {
            this.$emit('navigate', step);
        }
    }
}
</script>


<style lang="scss" scoped>
.wizard {
    display: flex;
    justify-content: center;
    align-items: center;

    .step {
        display: flex;
        align-items: center;

        .number {
            border-radius: 50%;
            width: 30px;
            height: 30px;
            line-height: 30px;
            text-align: center;
            background-color: hsla(0, 0%, 100%, .16);
        }

        .separator {
            width: 50px;
            height: 2px;
            background-color: hsla(0, 0%, 100%, .16);
        }

        &.active {
            .number {
                background-color: #0d6efd;
                color: white;
            }
        }

        &.completed {
            .number {
                color: white;
                background-color: #58D68D;
            }

            .separator {
                background-color: #58D68D;
            }
        }
    }
}
</style>
