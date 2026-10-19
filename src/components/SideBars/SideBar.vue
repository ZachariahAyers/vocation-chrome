<template>
    <transition name="fade">
        <div v-show="getSideBarVisible" class="jx-sidebar-container">
            <transition name="collapse">
                <div v-show="getSideBarVisible" class="jx-sidebar-content">
                    <component :is="sideBarContent" class="jx-fixed-container"></component>
                </div>
            </transition>
            <div class="jx-sidebar-overlay" @click="handleSideBarClose"></div>
        </div>
    </transition>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import { SIDEBAR_JOB_BOARD, SIDEBAR_PERSONAL, SIDEBAR_TEMPLATES } from "../../constants/constants";
import Personal from "./Personal/Personal";
import JobBoard from "./JobBoard/JobBoard";
import Templates from "./Templates/Templates";

export default {
    name: "SideBar",
    components: { Personal, JobBoard, Templates },
    data: () => ({
        SIDEBAR_JOB_BOARD,
        SIDEBAR_PERSONAL,
        SIDEBAR_TEMPLATES
    }),
    props: ["id", "title"],
    computed: {
        ...mapGetters(["getSideBarVisible", "getSideBarId"]),
        sideBarContent() {
            switch (this.getSideBarId) {
                case SIDEBAR_PERSONAL:
                    return "Personal";
                case SIDEBAR_JOB_BOARD:
                    return "JobBoard";
                case SIDEBAR_TEMPLATES:
                    return "Templates";
                default:
                    return "";
            }
        }
    },
    methods: {
        ...mapActions(["updateSideBarVisible", "updateActiveButton", "toggleSideBarVisible"]),
        handleSideBarClose() {
            this.toggleSideBarVisible();
            this.updateActiveButton(null);
        }
    }
};
</script>

<style lang="scss" scoped>
@import "../../scss/theme";

$sidebar-base: 240;
$sidebar-width: $sidebar-base + px;
$sidebar-interior: $sidebar-base - 5 + px;

.jx-sidebar-container {
    width: 100vw;
    height: 100vh;
    position: fixed;
    margin: 0;
    left: 0;
    top: 0;
    display: flex;
    pointer-events: all;
    z-index: 1001 !important;
}

.jx-sidebar-content {
    width: $sidebar-width;
    background: $gray-100;
    box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.4);
    overflow-y: scroll;
    z-index: 1001 !important;
    padding: 10px 10px 60px 15px;
    box-sizing: content-box;
}

.jx-sidebar-overlay {
    height: 100%;
    flex: 1;
    background: rgba(0, 0, 0, 0.4);
    z-index: 1001 !important;
}

.jx-fixed-container {
    width: $sidebar-interior;
    height: 100%;
    margin: 0;
}

.collapse-enter-active,
.collapse-leave-active {
    transition: width 0.5s;
}

.collapse-enter,
.collapse-leave-to {
    width: 0;
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.2s;
}

.fade-enter,
.fade-leave-to {
    opacity: 0;
}
</style>
