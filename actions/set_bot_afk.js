module.exports = {
  //---------------------------------------------------------------------
  // Action Name
  //---------------------------------------------------------------------

  name: 'Set Bot AFK Status',

  //---------------------------------------------------------------------
  // Action Section
  //---------------------------------------------------------------------

  section: 'Bot Client Control',

  //---------------------------------------------------------------------
  // Action Subtitle
  //---------------------------------------------------------------------

  subtitle(data, presets) {
    return `${data.afk === '0' ? 'AFK' : 'Not AFK'}`;
  },

  //---------------------------------------------------------------------
  // Action Meta Data
  //---------------------------------------------------------------------

  meta: {
    version: '2.2.0',
    preciseCheck: true,
    author: null,
    authorUrl: null,
    downloadUrl: 'https://github.com/DBM-POLSKA/DBM-14/blob/main/bot-files/actions/set_bot_afk.js',
  },

  //---------------------------------------------------------------------
  // Action Fields
  //---------------------------------------------------------------------

  fields: ['afk'],

  //---------------------------------------------------------------------
  // Command HTML
  //---------------------------------------------------------------------

  html(isEvent, data) {
    return `
<div style="float: left; width: 80%;">
	<span class="dbminputlabel">AFK Status</span><br>
	<select id="afk" class="round">
		<option value="0" selected>AFK</option>
		<option value="1">Not AFK</option>
	</select>
</div>`;
  },

  //---------------------------------------------------------------------
  // Action Editor Init Code
  //---------------------------------------------------------------------

  init() {},

  //---------------------------------------------------------------------
  // Action Bot Function
  //---------------------------------------------------------------------

  action(cache) {
    const botClient = this.getDBM().Bot.bot.user;
    const data = cache.actions[cache.index];
    const afk = parseInt(data.afk, 10);

    const presenceOptions = {
      status: afk === 0 ? 'idle' : 'online',
      activities: [
        {
          name: afk === 0 ? 'AFK' : 'Active',
          type: 'WATCHING',
        },
      ],
    };

    botClient.setPresence(presenceOptions);

    this.callNextAction(cache);
  },
  //---------------------------------------------------------------------
  // Action Bot Mod
  //---------------------------------------------------------------------

  mod() {},
};
