2022-08-06: v1.0.0
- Inital changelog setup

2022-08-06: v1.1.0
- Changed command user parameter to generic function to resolve either member, member Name or member snowflake (with option to default to message author)
- Created resolve function for channel and role as well, to be used later

2022-08-16: v1.1.0
- Add leaderboard ranking in userstats

2022-08-17: v1.2.0
- Better user resolve on mentions
- Allow bot mention to run commands
- Better channel / role resolve on mentions

2022-08-26: v1.3.0
- better incorporation of slash command (guild filter + permissions)
- battle ping (replacement for carl tag)

2022-08-31: v2.0.0
- complete overhaul to discordjs v14
- fixes for rumble slash

2022-09-01: v2.0.0
- change addLog to save guild/channel
- extra try catches

2022-09-19 v2.1.0:
- Rumble Royale Shop parsing

2022-09-28 v2.1.0:
- Support for global commands instead of creating them per guild
  (Nice benefit of having the "Supports Commands" Badge)

2022-10-04 v2.2.0:
- Creation of teams to add tournament points
  * /team [add|remove|adduser|removeuser|view]
  * /points [add|leaderboard|view]
  * /tournament [leaderboard|team]

2022-11-07 v2.2.0:
- /points [remove]
- /team [reset|resetpoints]
- Shop availability for RRU

2022-11-09 v2.2.0:
- Limit battle ping subscription to 1 year to avoid overflows

2022-11-14 v2.3.0:
- Ping list => timer expired through DM
  Settable through -settings pingexpirationdm [0|1]