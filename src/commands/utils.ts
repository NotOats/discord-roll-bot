import {
    InteractionResponse,
    InteractionResponseType,
} from '@glenstack/cf-workers-discord-bot';

export function createErrorResult(message: string): InteractionResponse {
    return {
        type: InteractionResponseType.ChannelMessageWithSource,
        data: {
            content: message,
        },
    };
}
