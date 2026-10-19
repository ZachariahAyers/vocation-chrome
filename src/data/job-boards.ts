import type { Component } from "vue";
import IconAngelList from "../assets/icons/IconAngelList.vue";
import IconCrunchBoard from "../assets/icons/IconCrunchBoard.vue";
import IconDice from "../assets/icons/IconDice.vue";
import IconFlexJobs from "../assets/icons/IconFlexJobs.vue";
import IconGlassDoor from "../assets/icons/IconGlassDoor.vue";
import IconIdealist from "../assets/icons/IconIdealist.vue";
import IconIndeed from "../assets/icons/IconIndeed.vue";
import IconLabtuit from "../assets/icons/IconLabtuit.vue";
import IconLinkedIn from "../assets/icons/IconLinkedIn.vue";
import IconMonster from "../assets/icons/IconMonster.vue";
import IconSimplyHired from "../assets/icons/IconSimplyHired.vue";
import IconTheMuse from "../assets/icons/IconTheMuse.vue";
import IconVentureLoop from "../assets/icons/IconVentureLoop.vue";
import IconWayUp from "../assets/icons/IconWayUp.vue";
import IconWeWorkRemotely from "../assets/icons/IconWeWorkRemotely.vue";
import IconZipRecruiter from "../assets/icons/IconZipRecruiter.vue";
import IconUnderdog from "../assets/icons/IconUnderdog.vue";

export interface JobBoard {
    name: string;
    url: string;
    icon: Component;
}

export const jobBoards: JobBoard[] = [
    {
        name: "Wellfound",
        url: "https://wellfound.com/",
        icon: IconAngelList,
    },
    {
        name: "CrunchBoard",
        url: "https://www.crunchboard.com/",
        icon: IconCrunchBoard,
    },
    {
        name: "Dice",
        url: "https://www.dice.com/",
        icon: IconDice,
    },
    {
        name: "Flex Jobs",
        url: "https://www.flexjobs.com/",
        icon: IconFlexJobs,
    },
    {
        name: "GlassDoor",
        url: "https://www.glassdoor.com/",
        icon: IconGlassDoor,
    },
    {
        name: "Idealist",
        url: "https://www.idealist.org",
        icon: IconIdealist,
    },
    {
        name: "Indeed",
        url: "https://www.indeed.com/",
        icon: IconIndeed,
    },
    {
        name: "Labtuit",
        url: "https://www.labtuit.com/",
        icon: IconLabtuit,
    },
    {
        name: "LinkedIn",
        url: "https://www.linkedin.com/",
        icon: IconLinkedIn,
    },
    {
        name: "Monster",
        url: "https://www.monster.com/",
        icon: IconMonster,
    },
    {
        name: "SimplyHired",
        url: "https://www.simplyhired.com/",
        icon: IconSimplyHired,
    },
    {
        name: "The Muse",
        url: "https://www.themuse.com/",
        icon: IconTheMuse,
    },
    {
        name: "UnderDog",
        url: "https://underdog.io/",
        icon: IconUnderdog,
    },
    {
        name: "VentureLoop",
        url: "https://www.ventureloop.com/ventureloop/home.php",
        icon: IconVentureLoop,
    },
    {
        name: "WayUp",
        url: "https://www.wayup.com/",
        icon: IconWayUp,
    },
    {
        name: "We Work Remotely",
        url: "https://weworkremotely.com/",
        icon: IconWeWorkRemotely,
    },
    {
        name: "ZipRecruiter",
        url: "https://www.ziprecruiter.com/",
        icon: IconZipRecruiter,
    },
];
