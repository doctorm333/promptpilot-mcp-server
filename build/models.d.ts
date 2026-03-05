export interface Model {
    id: string;
    name: string;
    type: "image" | "video" | "audio";
    free: boolean;
    description: string;
    price?: string;
    aspectRatios?: string[];
    voices?: string[];
    supportsImageInput?: boolean;
}
export declare const models: Model[];
export declare function getModelsByType(type: "image" | "video" | "audio"): Model[];
export declare function getModel(id: string): Model | undefined;
