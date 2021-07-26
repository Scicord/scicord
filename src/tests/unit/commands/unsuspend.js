import {afterEach, beforeEach, describe, test} from "@jest/globals";

const Unsuspend = require('../../../commands/unsuspend');
const BotClient = require('../../discord/BotClient');

describe("Tests for command: 'unsuspend'", () => {
    let botClient;

    // Before Each: Allows for a clean slate each session
    beforeEach(() => {
        botClient = new BotClient({token: "", prefix: ""}, null)
    });

    afterEach(() => {
        botClient = null
    })

    test("'Unsuspend' executes successfully", () => {
            let unsuspend = new Unsuspend();
            unsuspend.execute(botClient, "");
        }
    );
})