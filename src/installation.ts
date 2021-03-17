import * as fs from "fs/promises";
import * as path from "path";

/**
 * Information about a install of nodecg-io. Includes things like version, etc.
 */
export type Installation = DevelopmentInstallation | ProductionInstallation;

/**
 * A develop version of nodecg-io that is cloned directly form the git repository.
 */
export interface DevelopmentInstallation {
    dev: true;
    version: "development";
    useSamples: boolean;
}

/**
 * A production install using released tarballs of the packages from npm.
 */
export interface ProductionInstallation {
    dev: false;
    version: string;
    packages: InstalledPackage[];
}

export interface InstalledPackage {
    name: string;
    path: string;
    version: string;
}

function createPath(nodecgIODir: string) {
    return path.join(nodecgIODir, "install.json");
}

/**
 * Reads the informations about a nodecg-io installation, which is located in the install.json inside the nodecg-io directory.
 * @param nodecgIODir the directory in which nodecg-io is installed.
 * @returns a {@link Installation} if a install.json was found, undefined otherwise.
 */
export async function readInstallInfo(nodecgIODir: string): Promise<Installation | undefined> {
    try {
        const content = await fs.readFile(createPath(nodecgIODir));
        return JSON.parse(content.toString());
    } catch (_e) {
        return undefined;
    }
}

/**
 * Updates/Writes the passed install info to disk.
 * @param nodecgIODir the installation directory of nodecg-io.
 * @param install the installation info which should be written.
 */
export async function writeInstallInfo(nodecgIODir: string, install: Installation): Promise<void> {
    const content = JSON.stringify(install, null, 4);
    await fs.writeFile(createPath(nodecgIODir), content);
}