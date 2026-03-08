import { z } from "zod";
export declare const listModelsSchema: z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>;
export declare const listStylesSchema: z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>;
export declare const buildPromptSchema: z.ZodObject<{
    subject: z.ZodString;
    style: z.ZodOptional<z.ZodEnum<[string, ...string[]]>>;
    lighting: z.ZodOptional<z.ZodEnum<[string, ...string[]]>>;
    camera: z.ZodOptional<z.ZodEnum<[string, ...string[]]>>;
    mood: z.ZodOptional<z.ZodEnum<[string, ...string[]]>>;
    color: z.ZodOptional<z.ZodEnum<[string, ...string[]]>>;
    quality_tags: z.ZodOptional<z.ZodArray<z.ZodEnum<[string, ...string[]]>, "many">>;
}, "strip", z.ZodTypeAny, {
    subject: string;
    style?: string | undefined;
    lighting?: string | undefined;
    camera?: string | undefined;
    mood?: string | undefined;
    color?: string | undefined;
    quality_tags?: string[] | undefined;
}, {
    subject: string;
    style?: string | undefined;
    lighting?: string | undefined;
    camera?: string | undefined;
    mood?: string | undefined;
    color?: string | undefined;
    quality_tags?: string[] | undefined;
}>;
export declare const generateImageSchema: z.ZodObject<{
    prompt: z.ZodString;
    model: z.ZodDefault<z.ZodString>;
    width: z.ZodDefault<z.ZodNumber>;
    height: z.ZodDefault<z.ZodNumber>;
    enhance: z.ZodDefault<z.ZodBoolean>;
    seed: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    prompt: string;
    model: string;
    width: number;
    height: number;
    enhance: boolean;
    seed?: number | undefined;
}, {
    prompt: string;
    model?: string | undefined;
    width?: number | undefined;
    height?: number | undefined;
    enhance?: boolean | undefined;
    seed?: number | undefined;
}>;
export declare const generateVideoSchema: z.ZodObject<{
    prompt: z.ZodString;
    model: z.ZodDefault<z.ZodString>;
    aspect_ratio: z.ZodDefault<z.ZodEnum<["1:1", "16:9", "9:16"]>>;
    duration: z.ZodOptional<z.ZodNumber>;
    seed: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    prompt: string;
    model: string;
    aspect_ratio: "1:1" | "16:9" | "9:16";
    seed?: number | undefined;
    duration?: number | undefined;
}, {
    prompt: string;
    model?: string | undefined;
    seed?: number | undefined;
    aspect_ratio?: "1:1" | "16:9" | "9:16" | undefined;
    duration?: number | undefined;
}>;
export declare const generateAudioSchema: z.ZodObject<{
    prompt: z.ZodString;
    model: z.ZodDefault<z.ZodEnum<["elevenlabs", "elevenmusic"]>>;
    voice: z.ZodDefault<z.ZodEnum<["alloy", "echo", "fable", "onyx", "nova", "shimmer"]>>;
}, "strip", z.ZodTypeAny, {
    prompt: string;
    model: "elevenlabs" | "elevenmusic";
    voice: "alloy" | "echo" | "fable" | "onyx" | "nova" | "shimmer";
}, {
    prompt: string;
    model?: "elevenlabs" | "elevenmusic" | undefined;
    voice?: "alloy" | "echo" | "fable" | "onyx" | "nova" | "shimmer" | undefined;
}>;
export declare const checkBalanceSchema: z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>;
export declare const generateBatchSchema: z.ZodObject<{
    prompts: z.ZodArray<z.ZodObject<{
        prompt: z.ZodString;
        model: z.ZodDefault<z.ZodString>;
        width: z.ZodOptional<z.ZodDefault<z.ZodNumber>>;
        height: z.ZodOptional<z.ZodDefault<z.ZodNumber>>;
        seed: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        prompt: string;
        model: string;
        width?: number | undefined;
        height?: number | undefined;
        seed?: number | undefined;
    }, {
        prompt: string;
        model?: string | undefined;
        width?: number | undefined;
        height?: number | undefined;
        seed?: number | undefined;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    prompts: {
        prompt: string;
        model: string;
        width?: number | undefined;
        height?: number | undefined;
        seed?: number | undefined;
    }[];
}, {
    prompts: {
        prompt: string;
        model?: string | undefined;
        width?: number | undefined;
        height?: number | undefined;
        seed?: number | undefined;
    }[];
}>;
export declare function handleListModels(): {
    content: {
        type: "text";
        text: string;
    }[];
};
export declare function handleListStyles(): {
    content: {
        type: "text";
        text: string;
    }[];
};
export declare function handleBuildPrompt(args: z.infer<typeof buildPromptSchema>): {
    content: {
        type: "text";
        text: string;
    }[];
};
export declare function handleGenerateImage(args: z.infer<typeof generateImageSchema>): Promise<{
    content: {
        type: "text";
        text: string;
    }[];
    isError: boolean;
} | {
    content: {
        type: "text";
        text: string;
    }[];
    isError?: undefined;
}>;
export declare function handleGenerateVideo(args: z.infer<typeof generateVideoSchema>): Promise<{
    content: {
        type: "text";
        text: string;
    }[];
    isError: boolean;
} | {
    content: {
        type: "text";
        text: string;
    }[];
    isError?: undefined;
}>;
export declare function handleGenerateAudio(args: z.infer<typeof generateAudioSchema>): Promise<{
    content: {
        type: "text";
        text: string;
    }[];
    isError: boolean;
} | {
    content: {
        type: "text";
        text: string;
    }[];
    isError?: undefined;
}>;
export declare function handleCheckBalance(): Promise<{
    content: {
        type: "text";
        text: string;
    }[];
    isError?: undefined;
} | {
    content: {
        type: "text";
        text: string;
    }[];
    isError: boolean;
}>;
export declare function handleGenerateBatch(args: z.infer<typeof generateBatchSchema>): Promise<{
    content: {
        type: "text";
        text: string;
    }[];
}>;
