import {afterEach, beforeEach, describe, test} from "@jest/globals";

const Command = require('../../../commands/command');
const BotClient = require('../../discord/BotClient');

describe("Tests for command: 'command'", () => {
    let botClient;

    // Before Each: Allows for a clean slate each session
    beforeEach(() => {
        botClient = new BotClient({token: "", prefix: ">"}, null)
    });

    afterEach(() => {
        botClient = null
    })

    test("'command' executes successfully", () => {
            let command = new Command();
            command.execute(botClient, "");
        }
    );
})
