export declare const styleMappings: Record<string, string>;
export declare const lightingMappings: Record<string, string>;
export declare const cameraMappings: Record<string, string>;
export declare const moodMappings: Record<string, string>;
export declare const colorMappings: Record<string, string>;
export declare const qualityTagMappings: Record<string, string>;
export declare function buildPrompt(options: {
    subject: string;
    style?: string;
    lighting?: string;
    camera?: string;
    mood?: string;
    color?: string;
    quality_tags?: string[];
}): string;
