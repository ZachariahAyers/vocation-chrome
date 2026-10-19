/**
 * Up to two letters that stand for a name: the capitals that start its words or
 * camel-case parts ("We Work Remotely" is "WW", "ZipRecruiter" is "ZR"), or the first
 * letter when it has none ("dice" is "D").
 */
export function initials(name: string): string {
    const capitals = name.match(/\p{Lu}/gu) ?? [name.trim().charAt(0).toUpperCase()];
    return capitals.slice(0, 2).join("");
}
