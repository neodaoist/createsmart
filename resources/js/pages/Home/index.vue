<template>
    <div class="container">

        <template v-if="steps === 'login'">
            <button class="btn btn-primary" @click="connectWallet">Connect Wallet</button>
        </template>

        <template v-else-if="steps === 'choice'">

        </template>
    </div>
</template>

<script>
export default {
    methods: {
        connectWallet() {

            // todo connect wallet

            this.goToChoiceStep();
        },

        goToChoiceStep() {
            this.steps = 'choice';
        }
    },

    data() {
        return {
            steps:  'login',
            wallet: null
        }
    }
}
</script>

<style lang="scss" scoped>

</style>
