<template>
    <div class="demo-shell">
        <header class="topbar">
            <div class="identity">
                <span class="wordmark" aria-hidden="true">V</span>
                <div>
                    <p class="eyebrow">Vocation</p>
                    <h1>Application workspace</h1>
                </div>
            </div>
            <div class="utility">
                <a href="https://ayers.repair/opensource/">Open Source</a>
                <a href="https://github.com/ZachariahAyers/vocation-chrome">Source</a>
                <span>Your edits stay in this browser.</span>
            </div>
        </header>

        <main class="workspace">
            <section class="card letter-card">
                <div class="section-heading">
                    <span>01</span>
                    <div>
                        <p>Live document</p>
                        <h2>Letter and role</h2>
                    </div>
                </div>
                <TemplatesPanel :copy-to-clipboard="copyWithBrowserClipboard" />
            </section>

            <aside class="card profile-card">
                <div class="section-heading">
                    <span>02</span>
                    <div>
                        <p>Candidate</p>
                        <h2>Profile</h2>
                    </div>
                </div>
                <ProfilePanel />
            </aside>

            <section class="card checklist-card">
                <div class="section-heading">
                    <span>03</span>
                    <div>
                        <p>Today</p>
                        <h2>Job-board round</h2>
                    </div>
                    <strong>{{ state.boards.done.length }} of {{ jobBoards.length }} complete</strong>
                </div>
                <JobBoardPanel />
            </section>
        </main>
    </div>
</template>

<script setup lang="ts">
import JobBoardPanel from "../content/components/JobBoardPanel.vue";
import ProfilePanel from "../content/components/ProfilePanel.vue";
import TemplatesPanel from "../content/components/TemplatesPanel.vue";
import { state } from "../content/store.ts";
import { jobBoards } from "../data/job-boards.ts";
import { copyWithBrowserClipboard } from "./adapters.ts";
</script>

<style lang="scss">
* {
    box-sizing: border-box;
}

html {
    min-width: 320px;
    background: $demo-cream;
}

body {
    margin: 0;
    background: linear-gradient(90deg, transparent 0 49.9%, $demo-cream-dark 50%, transparent 50.1%), $demo-cream;
    color: $demo-green-dark;
    font-family: $font;
}

button,
input,
select,
textarea {
    font: inherit;
}

.demo-shell {
    width: min(1480px, 100%);
    margin: 0 auto;
    padding: 24px;
}

.topbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 24px;
    margin-bottom: 24px;
    padding: 14px 18px;
    border: 1px solid $demo-green;
    background: $demo-paper;
    box-shadow: 5px 5px 0 $demo-green-dark;
}

.identity {
    display: flex;
    align-items: center;
    gap: 14px;
}

.wordmark {
    display: grid;
    width: 48px;
    height: 48px;
    place-items: center;
    background: $demo-green;
    color: $demo-paper;
    font-size: 28px;
    font-weight: 700;
}

.eyebrow,
.section-heading p {
    margin: 0 0 3px;
    color: $demo-brass;
    font-family: $font;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.13em;
    text-transform: uppercase;
}

h1,
h2 {
    margin: 0;
    font-weight: 500;
}

h1 {
    font-size: clamp(24px, 3vw, 38px);
}

h2 {
    font-size: 24px;
}

.utility {
    display: flex;
    align-items: center;
    gap: 14px;
    color: $demo-green;
    font-family: $font;
    font-size: 12px;
}

.utility a {
    padding: 6px 9px;
    border: 1px solid $demo-green;
    color: $demo-green;
    font-weight: 700;
    text-decoration: none;
}

.utility a:hover,
.utility a:focus-visible {
    background: $demo-green;
    color: $demo-paper;
}

.workspace {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(280px, 340px);
    gap: 24px;
    align-items: start;
}

.card {
    padding: 22px;
    border: 1px solid $demo-green;
    background: $demo-paper;
    box-shadow: 5px 5px 0 $demo-green-dark;
}

.profile-card {
    grid-column: 2;
    grid-row: 1 / span 2;
}

.letter-card {
    grid-column: 1;
}

.section-heading {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 22px;
    padding-bottom: 14px;
    border-bottom: 1px solid $demo-cream-dark;
}

.section-heading > span {
    color: $demo-brass;
    font-family: $font;
    font-size: 12px;
}

.section-heading strong {
    margin-left: auto;
    color: $demo-green;
    font-family: $font;
    font-size: 12px;
}

.demo-shell .input,
.demo-shell .tags-box,
.demo-shell .template-variant,
.demo-shell .preview {
    border-color: $demo-cream-dark;
    background: $demo-paper;
    color: $demo-green-dark;
}

.demo-shell .input:focus,
.demo-shell .tags-box:focus-within {
    border-color: $demo-green;
    outline-color: $demo-green;
    box-shadow: 0 0 0 1px $demo-green;
}

.demo-shell .label,
.demo-shell .tags-label {
    color: $demo-green;
}

.demo-shell .input:focus ~ .label,
.demo-shell .input--filled ~ .label {
    background: $demo-paper;
}

.demo-shell .tag,
.demo-shell .template-kind:hover,
.demo-shell .template-kind:focus-visible,
.demo-shell .template-kind--active,
.demo-shell .copy:hover,
.demo-shell .copy:focus-visible {
    background: $demo-green;
    color: $demo-paper;
}

.demo-shell .template-kind,
.demo-shell .copy {
    border-color: $demo-green;
    background: $demo-paper;
    color: $demo-green;
}

.demo-shell .templates .template-kind.template-kind--active {
    background: $demo-green;
    color: $demo-paper;
}

.demo-shell .value {
    background: $demo-green-light;
    color: $demo-green-dark;
}

.demo-shell .value--missing {
    background: $demo-cream-dark;
}

.letter-card .templates {
    display: grid;
    grid-template-columns: minmax(190px, 250px) minmax(0, 1fr);
    gap: 12px 22px;
}

.letter-card .templates > * {
    grid-column: 1;
}

.letter-card .templates .preview {
    grid-column: 2;
    grid-row: 1 / span 8;
    min-height: 650px;
    max-height: 72vh;
    padding: 30px clamp(24px, 5vw, 70px);
    border: 1px solid $demo-cream-dark;
    box-shadow: 0 2px 14px $shadow;
    font-family: $font;
    font-size: 15px;
    line-height: 1.75;
}

.letter-card .templates .copy {
    grid-column: 2;
    grid-row: 9;
}

.letter-card .templates hr {
    width: 100%;
    border: 0;
    border-top: 1px solid $demo-cream-dark;
}

.checklist-card {
    grid-column: 1;
}

.checklist-card .boards {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 10px;
    padding: 0;
}

.checklist-card .board {
    width: 100%;
    margin: 0;
}

.checklist-card .board-link {
    border-color: $demo-green;
    background: $demo-paper;
    color: $demo-green;
    box-shadow: none;
}

.checklist-card .board-link:hover,
.checklist-card .board-link:focus-visible {
    background: $demo-green;
    color: $demo-paper;
}

.checklist-card .board-done {
    background: $demo-brass;
    color: $demo-brass;
}

@media (max-width: 980px) {
    .workspace {
        grid-template-columns: 1fr;
    }

    .letter-card,
    .profile-card,
    .checklist-card {
        grid-column: 1;
        grid-row: auto;
    }

    .letter-card .templates {
        display: flex;
    }

    .letter-card .templates .preview {
        min-height: 500px;
        max-height: none;
    }

    .checklist-card .boards {
        grid-template-columns: repeat(2, minmax(0, 1fr));
    }
}

@media (max-width: 600px) {
    .demo-shell {
        padding: 12px;
    }

    .topbar {
        align-items: flex-start;
        flex-direction: column;
    }

    .utility {
        align-items: flex-start;
        flex-wrap: wrap;
    }

    .card {
        padding: 16px;
    }

    .checklist-card .section-heading {
        flex-wrap: wrap;
    }

    .checklist-card .section-heading strong {
        width: 100%;
        margin-left: 30px;
    }

    .checklist-card .boards {
        grid-template-columns: 1fr;
    }

    .letter-card .templates .preview {
        min-height: 420px;
        padding: 22px 18px;
    }
}
</style>
