require('jest-sinon');
import assert from 'assert';
import {afterEach, beforeEach, describe, jest, test} from "@jest/globals";

const Unsuspend = require('../../../commands/unsuspend');
const BotClient = require('../../discord/BotClient');

describe("Tests for command: 'unsuspend'", () => {
    let botClient;

    // Before Each: Allows for a clean slate each session
    beforeEach(() => {
        botClient = new BotClient({token: "", prefix: ">"}, null)
    });

    afterEach(() => {
        botClient = null
    })

    test("'>suspend help' is called successfully", () => {
            let unsuspend = new Unsuspend();

            let MockFunction = jest.fn(send => send("dog"));
            let message = {
                "content": ">suspend help",
                "channel": new MockFunction()
            }

            unsuspend.execute(botClient, message);
            console.log(mock.mock.instances);
        }
    );
})