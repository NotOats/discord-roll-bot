import {
    ApplicationCommand,
    ApplicationCommandOptionType,
    Interaction,
    ApplicationCommandInteractionData,
    ApplicationCommandInteractionDataOption,
    InteractionHandler,
    InteractionResponse,
    InteractionResponseType,
    EmbedField,
} from '@glenstack/cf-workers-discord-bot';
import { createErrorResult } from './utils';

export const command: ApplicationCommand = {
    name: 'roll',
    description: 'Roll some dice!',
    options: [
        {
            name: 'sides',
            description:
                'The number of sides on the die. Example: 6, 20, 100, etc',
            type: ApplicationCommandOptionType.INTEGER,
            required: true,
        },
        {
            name: 'count',
            description: 'The number of dice to roll. Defaults to 1',
            type: ApplicationCommandOptionType.INTEGER,
            required: false,
        },
    ],
};

export const handler: InteractionHandler = async (
    interaction: Interaction,
): Promise<InteractionResponse> => {
    const options = (interaction.data as ApplicationCommandInteractionData)
        .options as ApplicationCommandInteractionDataOption[];

    // Find options
    const sides: number = (
        options.find(
            (opt) => opt.name === 'sides',
        ) as ApplicationCommandInteractionDataOption
    ).value;
    const count: number =
        (options.find((opt) => opt.name === 'count') || {}).value || 1;

    // Validate options
    if (sides > 100) {
        return createErrorResult(
            `Who uses d${sides}?! Please try a sane dice value.`,
        );
    }
    if (count > 20) {
        return createErrorResult(
            'I am but a poor bot with only 20 dice, please try again!',
        );
    }

    // Roll dice
    const fields: EmbedField[] = [];

    for (let i = 1; i <= count; i++) {
        const field: EmbedField = {
            name: i == 1 ? 'Roll 1' : i.toString(),
            value: getRandomIntInclusive(1, sides).toString(),
            inline: true,
        };

        fields.push(field);
    }

    // Return formatted output
    return {
        type: InteractionResponseType.ChannelMessageWithSource,
        data: {
            content: '',
            embeds: [
                {
                    title: `Rolling ${count}d${sides}...`,
                    description: getRandomArrayElement(descriptions),
                    color: 0x00ffff,
                    fields: fields,
                    author: {
                        name: `@${interaction.member.user.username}`,
                        icon_url: `https://cdn.discordapp.com/avatars/${interaction.member.user.id}/${interaction.member.user.avatar}.png`,
                    },
                    footer: {
                        text: getRandomArrayElement(footers),
                    },
                },
            ],
        },
    };
};

function cryptoRandomFloat(): number {
    const randomBuffer = new Uint32Array(1);
    crypto.getRandomValues(randomBuffer);

    return randomBuffer[0] / (0xffffffff + 1);
}

function getRandomIntInclusive(min: number, max: number): number {
    const randomNumber = cryptoRandomFloat();
    //const randomNumber = Math.random();

    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(randomNumber * (max - min + 1)) + min;
}

function getRandomArrayElement(array: string[]): string {
    const random = Math.floor(cryptoRandomFloat() * array.length);
    return array[random];
}

const descriptions: string[] = [
    "Hope this doesn't break the campaign!",
    'I think that one rolled off the table.',
    'Maybe this will do something cool.',
    'Did your head explode?',
    'Are you *still* shopping?',
];

const footers: string[] = [
    'All rolls are legally binding, please see your local GM for more details.',
];
