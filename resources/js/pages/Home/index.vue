<template>
    <div style="color:#adafca">
        <template v-if="step === 'login'">
            <div class="text-center">
                <button class="btn btn-primary" @click="connectWallet" style="padding:15px 30px">Connect Wallet</button>
            </div>
        </template>

        <template v-else-if="submitted === true">
            <div class="text-center">
                <div style="width:60px; height:60px; line-height:70px; background-color: #58D68D; color:white; border-radius:50%; display: inline-block; vertical-align: middle">
                    <i class="fas fa-check" style="font-size: 2rem"></i>
                </div>
                <div style="font-size: 2rem; color:white;">Congrats!</div>
            </div>

            <div class="text-center" style="margin-top: 30px">
                <button class="btn btn-primary" @click="restart">Mint another one</button>
            </div>
        </template>

        <template v-else>
            <div style="background-color: #21262a; padding: 10px; border-radius: 5px; margin-bottom: 15px">
                <strong>Connected Wallet</strong>
                <div style="margin-top:5px; font-size: 1.2rem; color:white">{{ wallet.substr(0, 10) }}...{{ wallet.substr(-10) }}</div>
            </div>

            <wizard :step="step" @navigate="onNavigate"></wizard>

            <div style="margin-top: 30px; text-align: center">
                <!-- Step 1 : 1/1 or X edition -->
                <div v-show="step === 'choice'">
                    <h2 style="margin-bottom: 30px">What type of smart-art would you like to mint?</h2>

                    <button @click="selectSingleNft" :class="['btn', edition === 'single' ? 'btn-success' : 'btn-primary' ]"
                            style="width:150px; padding:10px 0; margin-right: 10px; font-size: 1.2rem">
                        1/1
                    </button>

                    <button @click="selectMultipleNft" :class="['btn', edition === 'multi' ? 'btn-success' : 'btn-primary' ]"
                            style="width:150px; padding:10px 0; margin-left: 10px; font-size: 1.2rem">
                        Edition of X
                    </button>
                </div>

                <!-- Step 2 :  Form Step -->
                <div v-show="step === 'form'">
                    <h2 style="margin-bottom: 30px">Give your NFT a name and upload your media</h2>

                    <form class="text-start" @submit.prevent="submitForm">
                        <div>
                            <label style="margin-bottom: 5px">Name</label>
                            <input type="text" required class="form-control" v-model="name" placeholder="Name"/>
                        </div>

                        <div style="margin-top: 15px">
                            <label style="margin-bottom: 5px">Quantity</label>
                            <input type="number" required min="1" :readonly="edition === 'single'" v-model="quantity" class="form-control" placeholder="10" style="width:80px"/>
                        </div>

                        <div style="margin-top: 15px">
                            <label style="margin-bottom: 5px">Description</label>
                            <textarea type="text" class="form-control" v-model="description" placeholder="Description"></textarea>
                        </div>

                        <div style="margin-top: 15px">
                            <div class="upload" style="text-align: center; border:solid 1px #e0e0e0; padding:30px">
                                <template v-if="media === ''">
                                    <div @click="openFilepicker">Upload your media here</div>
                                </template>
                                <template v-else>
                                    <img :src="media" style="max-height: 150px"/>
                                </template>

                            </div>
                        </div>

                        <div style="margin-top: 15px; text-align: center">
                            <input type="submit" class="btn btn-primary" style="padding:15px 60px" value="Next">
                        </div>
                    </form>
                </div>

                <!-- Step 3 : Split step -->
                <div v-if="step === 'split'">
                    <h2 style="margin-bottom: 30px">Set your ownership and royalty splits 🤝️</h2>

                    <apexchart height="350" type="pie" v-bind="splitChart"></apexchart>

                    <template v-for="(value, key) in splits">
                        <div :key="key" style="display: flex; align-items: center; margin-bottom: 3px">

                            <div style="text-align: left; flex:1">
                                <div v-if="key === 'owner'">Address</div>
                                <input type="text" class="form-control" v-model="value.address"/>
                            </div>

                            <div style="margin-left: 10px; text-align: left">
                                <div v-if="key === 'owner'">%</div>
                                <input type="number" class="form-control" min="1" max="100" v-model="value.percent" style="width:80px"/>
                            </div>

                            <div style="width:70px; text-align: center">
                                <template v-if="value.address === wallet">
                                    <div style="margin-top:25px">Owner</div>
                                </template>
                                <template v-else>
                                    <span @click="deleteSplit(key)" style="color:red; cursor: pointer">Delete</span>
                                </template>

                            </div>
                        </div>
                    </template>

                    <div style="text-align: left; color:#0d6efd; padding:5px 0; cursor:pointer" @click="addSplit">
                        Add a split
                    </div>

                    <div style="margin-top: 15px; text-align: center">
                        <input type="button" @click="submitSplits" class="btn btn-primary" style="padding:15px 60px" value="Next">
                    </div>
                </div>

                <div v-if="step === 'confirm'">
                    <template v-if="submitted === false">
                        <div style="font-size:2rem">You are ready to mint your first NFT !</div>

                        <button class="btn btn-success" style="background-color: #58D68D; padding:10px 30px; margin-top: 30px" @click="mint">Mint Now</button>
                    </template>
                    <template v-else>
                        <div style="font-size:1.2rem; color:white">Please wait... We are minting your NFT</div>
                    </template>

                </div>
            </div>

        </template>
    </div>
</template>

<script>
import Wizard from './Wizard';
import VueApexCharts from 'vue-apexcharts';
import Vue from "vue";

export default {

    components: {
        Wizard,
        apexchart: VueApexCharts
    },

    computed: {
        splitChart() {
            let series = [];

            for (let i in this.splits) {
                if (this.splits[i].percent !== '' && this.splits[i].percent !== null) {
                    series.push(parseInt(this.splits[i].percent));
                }
            }

            return {
                series:  series,
                options: {
                    legend: {
                        show: false
                    }
                },
            };
        }
    },

    methods: {
        onNavigate(step) {
            if (step === 'choice') {
                this.goToChoiceStep();
            } else if (step === 'form') {
                if (this.step === 'split' || this.step === 'confirm') {
                    this.goToFormStep();
                }
            }
        },

        connectWallet() {
            this.wallet = '0xD3E902535BEB3a87ae3a4E8F81d8EB44c0b95Fc8';

            if (this.splits === null) {
                this.splits = {};

                Vue.set(this.splits, 'owner', {address: this.wallet, percent: 100});
            }

            this.goToChoiceStep();
        },

        restart() {
            this.step = 'choice';

            this.submitted = false;
        },

        // Choice Step

        goToChoiceStep() {
            this.step = 'choice';
        },

        selectSingleNft() {
            this.edition = 'single';

            this.quantity = 1;

            this.goToFormStep();
        },

        selectMultipleNft() {
            this.edition = 'multi';

            this.quantity = '';

            this.goToFormStep();
        },

        // Form Step

        goToFormStep() {
            this.step = 'form';
        },

        openFilepicker() {
            this.picker.open();
        },

        submitForm() {
            this.goToSplitStep();
        },

        // Split step

        goToSplitStep() {
            this.step = 'split';
        },

        addSplit() {
            let random = (Math.random() + 1).toString(36).substring(7);

            Vue.set(this.splits, random, {address: '', percent: '', error: false});
        },

        deleteSplit(key) {
            let splits = _.clone(this.splits);

            delete splits[key];

            this.splits = splits;
        },

        submitSplits() {
            let errorsCount = 0;

            for (let i in this.splits) {
                if (this.splits[i].percent !== '' && this.splits[i].address === '') {
                    this.splits[i].error = true;
                    errorsCount++;
                } else {
                    this.splits[i].error = false;
                }
            }

            if (errorsCount === 0) {
                this.goToConfirmStep();
            }
        },

        // Confirm Step

        goToConfirmStep() {
            this.step = 'confirm';
        },

        mint() {
            this.submitted = null;

            setTimeout(() => {
                this.submitted = true;
            }, 2500);
        }
    },

    beforeMount() {
    },

    mounted() {
        this.picker = window.filestack.picker({
            fromSources:          ["local_file_system", "instagram", "facebook"],
            storeTo:              {
                path: "/"
            },
            onFileUploadFinished: (result) => {
                this.media = result.url;
            }
        });
    },

    data() {
        return {
            step:        'login',
            wallet:      null,
            edition:     null,
            name:        '',
            quantity:    '',
            description: '',
            media:       '',
            splits:      null,
            submitted:   false
        }
    }
}
</script>

<style lang="scss" scoped>
h2 {
    color: white;
    font-size: 1.5rem;
    text-align: center;
}
</style>
