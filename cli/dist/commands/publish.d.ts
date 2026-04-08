export declare function publishCommand(options: {
    title?: string;
    content?: string;
    file?: string;
    draft?: boolean;
    awaitReview?: boolean;
}): Promise<void>;
