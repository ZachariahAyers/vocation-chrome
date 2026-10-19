<template>
    <div class="jx-button-dock">
        <div
            ref="accordionButton"
            :class="getDockVisible ? 'jx-wrapper' : 'jx-collapsed'"
            class="jx-collapse-button"
            @click="toggleButtonContainerVisibility"
        >
            <div class="jx-tooltip">{{ getAccordionToolTipText }}</div>
            <icon-work v-if="getAccordionIconVisible" />
        </div>

        <div>
            <transition name="collapse">
                <div v-if="getDockVisible" class="jx-button-container">
                    <jx-dock-button
                        :sidebar-id="SIDEBAR_PERSONAL"
                        icon="person-badge"
                        left="true"
                        title="Personal"
                    >
                        <icon-personal />
                    </jx-dock-button>
                    <jx-dock-button
                        :sidebar-id="SIDEBAR_JOB_BOARD"
                        icon="briefcase"
                        title="Job Board"
                    >
                        <icon-job-board />
                    </jx-dock-button>
                    <jx-dock-button
                        :sidebar-id="SIDEBAR_TEMPLATES"
                        icon="newspaper"
                        title="Templates"
                    >
                        <icon-templates />
                    </jx-dock-button>
                </div>
            </transition>
        </div>
    </div>
</template>

<script>
import JxDockButton from "./JxDockButton";
import { SIDEBAR_JOB_BOARD, SIDEBAR_PERSONAL, SIDEBAR_TEMPLATES } from "../../constants/constants";
import IconPersonal from "../../assets/Icons/IconPersonal";
import IconJobBoard from "../../assets/Icons/IconJobBoard";
import IconTemplates from "../../assets/Icons/IconTemplates";
import IconWork from "../../assets/Icons/IconWork";
import { mapActions, mapGetters } from "vuex";

export default {
    name: "ButtonDock",
    components: { IconWork, IconTemplates, IconJobBoard, IconPersonal, JxDockButton },
    data: () => ({
        SIDEBAR_JOB_BOARD,
        SIDEBAR_TEMPLATES,
        SIDEBAR_PERSONAL
    }),
    computed: {
        ...mapGetters(["getAccordionIconVisible", "getAccordionToolTipText", "getDockVisible"])
    },
    methods: {
        ...mapActions(["toggleAccordionIconVisible", "updateAccordionToolTipText", "toggleDockVisible"]),
        /**
         * Toggle the button container visibility
         * Toggle the button container accordion icon
         */
        toggleButtonContainerVisibility() {
            // Hide and show the button group container
            this.toggleDockVisible();
            this.toggleAccordionIconVisible();
            this.$refs.accordionButton.classList.toggle("jx-collapsed");
            this.$refs.accordionButton.classList.remove("jx-wrapper");

            setTimeout(() => {
                this.$refs.accordionButton.classList.add("jx-wrapper");
                this.updateAccordionToolTipText(this.getDockVisible ? "Hide" : "Show");
            }, 500);
        }
    }
};
</script>

<style lang="scss" scoped>
@import "../../scss/theme";

.jx-button-dock {
    position: fixed;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    justify-content: center;
    flex-direction: column;
    pointer-events: all;
}

.jx-collapse-button {
    width: 100%;
    height: 14px;
    background-color: $info;
    outline: none;
    border: none;
    border-radius: 5px;
    color: $white;
    cursor: pointer;
    margin: auto auto 8px;
    transition: all 0.5s ease;
    box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.2);
    display: flex;
    justify-content: center;

    &:hover {
        filter: brightness(1.25);
        transform: translateY(-2px);
    }

    &:active {
        filter: brightness(0.8);
        transform: translateY(2px);
    }
}

.jx-button-container {
    max-height: 200px;
    box-shadow: 2px 2px 6px rgba(0, 0, 0, 0.2);
    display: flex;
}

.jx-collapsed {
    height: 36px;
    width: 36px;
    display: flex;
    align-items: center;
    justify-content: center;

    & svg {
        fill: $white;
        height: 30px;
    }
}

.collapse-enter-active,
.collapse-leave-active {
    transition: max-height 0.5s;
}

.collapse-enter,
.collapse-leave-to {
    max-height: 0;
}

.jx-tooltip {
    background: $gray-900;
    font-family: $font;
    font-size: 1em;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    backface-visibility: hidden;
    bottom: 100%;
    color: #fff;
    display: block;
    margin-bottom: 15px;
    opacity: 0;
    padding: 10px;
    pointer-events: none;
    position: absolute;
    width: auto;
    transform: translateY(10px);
    transition: all 0.1s ease;
    border-radius: 100px;
    box-shadow: 2px 2px 6px rgba(0, 0, 0, 0.28);
    text-align: center;
    z-index: 1;
}

/* This bridges the gap so you can mouse into the tooltip without it disappearing */
.jx-tooltip:before {
    bottom: -20px;
    content: " ";
    display: block;
    height: 20px;
    left: 0;
    position: absolute;
    width: 50px;
}

/* CSS Triangles - see Trevor's post */
.jx-tooltip:after {
    border-left: solid transparent 14px;
    border-right: solid transparent 14px;
    border-top: solid $gray-900 20px;
    bottom: -10px;
    content: " ";
    height: 0;
    left: 50%;
    margin-left: -14px;
    position: absolute;
    width: 0;
    z-index: -1;
}

.jx-wrapper:hover .jx-tooltip {
    opacity: 1;
    pointer-events: auto;
    transform: translateY(0px);
}
</style>
