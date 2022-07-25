const HangManGame = require("../../classes/hangmangame")

module.exports = {
    name: "hangman",
    aliases: ["hm"],
    category: "games",
    permissions: 20,
    description: "Start a hangman game",
    run: async ({client, message}) => {
        let result = await client.functions.get("functions").fetch('https://api.wordnik.com/v4/words.json/randomWord?hasDictionaryDef=true&includePartOfSpeech=noun&minCorpusCount=8000&maxCorpusCount=-1&minDictionaryCount=3&maxDictionaryCount=-1&minLength=6&maxLength=12&api_key=a2a73e7b926c924fad7001ca3111acd55af2ffabf50eb4ae5', null)
        
        //convert to object we can work with
        let json = await result.json()

        var msg = await message.reply("Starting game...")        

        new HangManGame().newGame(json.word.toLowerCase(), message, client, false)
        await msg.delete();
    }
}