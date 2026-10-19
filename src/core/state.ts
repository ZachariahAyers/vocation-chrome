import { templates, type TemplateKind } from "../data/templates.ts";

export interface Profile {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    githubUsername: string;
    website: string;
    currentJobTitle: string;
    yearsOfExperience: string;
    personalSummary: string;
    platforms: string[];
    skills: string[];
}

export interface Job {
    contactName: string;
    companyName: string;
    jobTitle: string;
    keywords: string[];
}

export interface TemplateChoice {
    kind: TemplateKind;
    variant: string;
}

export interface Boards {
    /** The local day `done` belongs to, as `Date.toDateString()`. */
    day: string;
    done: string[];
}

export interface State {
    profile: Profile;
    job: Job;
    template: TemplateChoice;
    boards: Boards;
}

export type Section = keyof State;

export const sections = ["profile", "job", "template", "boards"] as const satisfies readonly Section[];

export const today = (now = new Date()): string => now.toDateString();

export function defaultState(now = new Date()): State {
    return {
        profile: {
            firstName: "",
            lastName: "",
            email: "",
            phoneNumber: "",
            githubUsername: "",
            website: "",
            currentJobTitle: "",
            yearsOfExperience: "",
            personalSummary: "",
            platforms: ["Windows", "Mac", "Linux", "iOS", "Android"],
            skills: [],
        },
        job: { contactName: "", companyName: "", jobTitle: "", keywords: [] },
        template: { kind: "Cover", variant: "Default" },
        boards: { day: today(now), done: [] },
    };
}

const isStringArray = (value: unknown): value is string[] =>
    Array.isArray(value) && value.every((item) => typeof item === "string");

/** Keeps only the fields of `saved` that have the same shape as the default's. */
function pickMatching<T extends object>(fallback: T, saved: unknown): T {
    const result = { ...fallback };
    if (typeof saved !== "object" || saved === null) return result;
    for (const key of Object.keys(fallback) as (keyof T)[]) {
        const value = (saved as Partial<T>)[key];
        const expected = fallback[key];
        const matches = Array.isArray(expected) ? isStringArray(value) : typeof value === typeof expected;
        if (matches) result[key] = value as T[keyof T];
    }
    return result;
}

/**
 * Turns whatever storage holds for a section into a valid value: unknown fields are
 * dropped, missing or mistyped ones fall back to the default, an unknown template
 * resets to the cover letter, and a board list from an earlier day starts empty.
 */
export function normalizeSection<K extends Section>(section: K, saved: unknown, now = new Date()): State[K] {
    const fallback = defaultState(now)[section];
    const value = pickMatching(fallback, saved);

    if (section === "template") {
        const choice = value as TemplateChoice;
        const variants: Record<string, string> | undefined = (templates as Record<string, Record<string, string>>)[
            choice.kind
        ];
        if (!variants || !(choice.variant in variants)) return fallback;
    }
    if (section === "boards" && (value as Boards).day !== today(now)) return fallback;

    return value;
}
