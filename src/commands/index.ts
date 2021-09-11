import {
    ApplicationCommand,
    InteractionHandler,
} from '@glenstack/cf-workers-discord-bot';
import { command as rollCommand, handler as rollHandler } from './roll';

export const commands: [ApplicationCommand, InteractionHandler][] = [
    [rollCommand, rollHandler],
];
