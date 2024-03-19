/* eslint-disable */
const functions = require("firebase-functions");
const axios = require("axios");
const cors = require('cors')({ origin: true });
const openAIKey = functions.config().openai.key;
const OpenAI = require("openai");

const client = new OpenAI({
    apiKey: openAIKey,
});

exports.chatWithOpenAIAssistant = functions.https.onRequest((req, res) => {
    cors(req, res, async () => {
        if (req.method !== "POST") {
            return res.status(405).send('Method Not Allowed');
        }

        const { prompt, threadId } = req.body;

        try {
            const assistant = await client.beta.assistants.create({
                name: "Showmate Movie Assistant",
                instructions: "You are an assistant that will be getting some info from the user who is trying to \
                find movies they want to watch. You will be a part of my web app that uses TMDB API to display movie info, \
                before you recommend movies you should get their genre(s) of choice, some of their other favorite movies, \
                or their favorite actors. You should ask each of these together or in seperate messages before you give results, then provide a json-like format of \
                {'genres': ['genre'], 'movies': ['movies'], 'actors': ['actors']} at the end of your response once you're ready to give those results. \
                If you don't get all three of the criteria, still include all three in the json-like structure, but just leave it blank (Ex. genres: ['']) \
                Please also use double quotes instead of '' for all of what I just mentioned, so I can parse the json in its valid format.\
                Your results response should not acknowledge the json list as it is only for purpose the inner workings of my web app. I will only show \
                the user what you say before that, so end that response with something like: 'Here are some movies I would recommend based on your responses: \
                Please make your responses (not including json info that I'll be using) is under 150 characters since the chatbox is smaller.",
                model: "gpt-4-turbo-preview"
            });


            let thread;
            if(threadId === '') {
                thread = await client.beta.threads.create();
            } else {
                thread = await client.beta.threads.retrieve(threadId);
            }
            

            const message = await client.beta.threads.messages.create(thread.id,
                {
                    role: "user",
                    content: prompt
                }
            );

            let run = await client.beta.threads.runs.create(
                thread.id,
                {
                    assistant_id: assistant.id
                }
            );

            while (['queued', 'in_progress', 'cancelling'].includes(run.status)) {
                await new Promise(resolve => setTimeout(resolve, 2000));
                run = await client.beta.threads.runs.retrieve(
                    run.thread_id,
                    run.id
                );
            }

            let messageList = [];
            if (run.status === 'completed') {
                const messages = await client.beta.threads.messages.list(
                    run.thread_id
                );

                for (const message of messages.data) {
                    messageList.push(message.content[0].text.value);
                }

                const messageObject = {
                    threadId: thread.id,
                    messageList: messageList
                }

                return res.status(200).send(messageObject);
            } else {
                return res.status(500).send(run.status);
            }
        } catch (error) {
            console.error("Error with OpenAI Assistant API", error);
            console.error(error.response ? error.response.data : error.message);
            res.status(500).send("Error processing your request with OpenAI.");
        }
    });

});
