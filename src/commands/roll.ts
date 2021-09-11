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

function getRandomIntInclusive(min: number, max: number): number {
    const randomBuffer = new Uint32Array(1);

    crypto.getRandomValues(randomBuffer);

    const randomNumber = randomBuffer[0] / (0xffffffff + 1);

    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(randomNumber * (max - min + 1)) + min;
}

function createErrorResult(message: string): InteractionResponse {
    return {
        type: InteractionResponseType.ChannelMessageWithSource,
        data: {
            content: message,
        },
    };
}

export const handler: InteractionHandler = async (
    interaction: Interaction,
): Promise<InteractionResponse> => {
    const options = (interaction.data as ApplicationCommandInteractionData)
        .options as ApplicationCommandInteractionDataOption[];

    const roll: number = (
        options.find(
            (opt) => opt.name === 'roll',
        ) as ApplicationCommandInteractionDataOption
    ).value;
    const count: number =
        (options.find((opt) => opt.name === 'count') || {}).value || 1;

    if (roll > 100) {
        return createErrorResult(
            `Who uses d${roll}?! Please try a sane dice value.`,
        );
    }
    if (count > 20) {
        return createErrorResult('I only have 20 dice, please try again!');
    }

    const fields: EmbedField[] = [];

    for (let i = 1; i <= count; i++) {
        const field: EmbedField = {
            name: i == 1 ? 'Roll 1' : i.toString(),
            value: getRandomIntInclusive(1, roll).toString(),
            inline: true,
        };

        fields.push(field);
    }

    return {
        type: InteractionResponseType.ChannelMessageWithSource,
        data: {
            content: '',
            embeds: [
                {
                    title: "Hope this doesn't break your campaign!",
                    color: 0x00ffff,
                    fields: fields,
                    author: {
                        name: `@${interaction.member.user.username}`,
                        icon_url: `https://cdn.discordapp.com/avatars/${interaction.member.user.id}/${interaction.member.user.avatar}.png`,
                    },
                    footer: {
                        text: 'All rolls are legally binding, please see your local GM for more details.',
                    },
                },
            ],
        },
    };
};
