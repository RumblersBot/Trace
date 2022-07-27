# Trace
The Rumblers Assistant Computer Entity

# ENV file

Create a .env file in the root with the following parameters:
- DISCORD_TOKEN=YOUR_DISCORD_BOT_TOKEN
- MONGODB_URL=host.instance.mongodb.net
- MONGODB_DB=DBName
- MONGODB_USER=DBUser
- MONGODB_PASS=DBPassword

# DEV file

If you want to run the bot in test mode, you can create .dev file containing the alternate prefix the dev mode bot will use.
I use this to run the bot in dev mode while simultaneous running the bot live as well. 
It will also only listen to commands from the bot owner.

# Install As Service
I run the bot on windows. I have installed it using node-windows. The install is done with 
```
node InstallAsService.js
```

# New commands
To create a new command, you choose which category it uses. Next you create a `.js` file in the `/src/commands/<category>` directory.
I usually copy the `ping` command to get started.
Next update the necessary info:
- name: the command name `eg. name: "NewCommand"`
- aliases: Array with aliases `eg. aliases: ["nc"]`
- category: Category name `eg. category: "server"`
- permissions: Add a number as found in `/src/data/permission_config.json`. Can be removed if not needed. `eg. permissions: -1`
- description: a command description `eg. description: "My new command"`
- usage: parameter description to show in help. Can be removed if not needed. `eg. usage: "<mandatory parameter> [optional parameter]"`