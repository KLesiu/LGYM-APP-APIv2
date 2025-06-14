import { Platforms } from "../enums/Platforms";

interface AppConfigInfo {
    minRequiredVersion: string;
    latestVersion: string;
    forceUpdate: boolean;
    updateUrl: string;
    releaseNotes?: string;
}

interface AppConfigInfoWithPlatform extends AppConfigInfo {
    platform: Platforms
}

export {AppConfigInfo,AppConfigInfoWithPlatform}