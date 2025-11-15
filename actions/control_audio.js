module.exports = {
  // ---------------------------------------------------------------------
  // Action Name
  // ---------------------------------------------------------------------

  name: 'Control Audio',

  // ---------------------------------------------------------------------
  // Action Section
  // ---------------------------------------------------------------------

  section: 'Audio Control',

  // ---------------------------------------------------------------------
  // Action Subtitle
  // ---------------------------------------------------------------------

  subtitle(data, presets) {
    const actions = ['Stop Playing', 'Pause Audio', 'Resume Audio'];
    return `${actions[parseInt(data.action, 10)]}`;
  },

  // ---------------------------------------------------------------------
  // Action Meta Data
  // ---------------------------------------------------------------------

  meta: {
    version: '2.2.0',
    preciseCheck: true,
    author: null,
    authorUrl: null,
    downloadUrl: 'https://github.com/DBM-POLSKA/DBM-14/blob/main/bot-files/actions/control_audio.js',
  },

  // ---------------------------------------------------------------------
  // Action Fields
  // ---------------------------------------------------------------------

  fields: ['action'],

  // ---------------------------------------------------------------------
  // Command HTML
  // ---------------------------------------------------------------------

  html(isEvent, data) {
    return `
<div style="float: left; width: 80%;">
	<span class="dbminputlabel">Audio Action</span><br>
	<select id="action" class="round">
		<option value="0" selected>Stop Playing</option>
		<option value="1">Pause Audio</option>
		<option value="2">Resume Audio</option>
	</select>
</div>`;
  },

  // ---------------------------------------------------------------------
  // Action Editor Init Code
  // ---------------------------------------------------------------------

  init() {},

  // ---------------------------------------------------------------------
  // Action Bot Function
  // ---------------------------------------------------------------------

  action(cache) {
    const data = cache.actions[cache.index];
    const { Audio } = this.getDBM();
    const server = cache.server;
    const subscription = server && Audio.subscriptions.get(server.id);
    if (!subscription) return this.callNextAction(cache);
    const action = parseInt(data.action, 10);
    switch (action) {
      case 0:
        subscription.stop();
        break;
      case 1:
        subscription.audioPlayer.pause();
        break;
      case 2:
        subscription.audioPlayer.unpause();
        break;
    }
    this.callNextAction(cache);
  },

  // ---------------------------------------------------------------------
  // Action Bot Mod
  // ---------------------------------------------------------------------

  mod() {},
};
