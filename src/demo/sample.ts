import { defaultState, type State } from "../core/state.ts";

/** A fictional, complete application so the demo opens on useful output. */
export function sampleState(now = new Date()): State {
    const sample = defaultState(now);
    Object.assign(sample.profile, {
        firstName: "Maya",
        lastName: "Chen",
        email: "maya.chen@example.com",
        phoneNumber: "555-0142",
        githubUsername: "maya-chen",
        website: "https://maya.example",
        currentJobTitle: "Product Engineer",
        yearsOfExperience: "7",
        personalSummary:
            "I build thoughtful web products with a focus on clear interfaces, resilient systems, and accessible experiences.",
        platforms: ["Web", "iOS", "Android"],
        skills: ["TypeScript", "Vue", "Node.js", "Accessibility"],
    });
    Object.assign(sample.job, {
        contactName: "Sam Rivera",
        companyName: "Riverbend Tools",
        jobTitle: "Staff Frontend Engineer",
        keywords: ["design systems", "TypeScript", "accessibility"],
    });
    return sample;
}
