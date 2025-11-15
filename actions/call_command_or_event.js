module.exports = {
  //---------------------------------------------------------------------
  // Action Name
  //---------------------------------------------------------------------

  name: 'Call Command/Event',

  //---------------------------------------------------------------------
  // Action Section
  //---------------------------------------------------------------------

  section: 'Other Stuff',

  //---------------------------------------------------------------------
  // Action Subtitle
  //---------------------------------------------------------------------

  subtitle(data, presets) {
    return `Call Command/Event ID "${data.source}"`;
  },

  //---------------------------------------------------------------------
  // Action Meta Data
  //---------------------------------------------------------------------

  meta: {
    version: '2.2.0',
    preciseCheck: true,
    author: null,
    authorUrl: null,
    downloadUrl: 'https://github.com/DBM-POLSKA/DBM-14/blob/main/bot-files/actions/call_command_or_event.js',
  },

  //---------------------------------------------------------------------
  // Action Fields
  //---------------------------------------------------------------------

  fields: ['source', 'type'],

  //---------------------------------------------------------------------
  // Command HTML
  //---------------------------------------------------------------------

  html(isEvent, data) {
    return `
<div style="width: 85%;">
	<span class="dbminputlabel">Command/Event</span><br>
	<select id="source" class="round">
		<optgroup id="commands" label="Commands"></optgroup>
		<optgroup id="events" label="Events"></optgroup>
	</select><br>
	<span class="dbminputlabel">Call Type</span><br>
	<select id="type" class="round">
		<option value="true" selected>Wait for Completion</option>
		<option value="false">Run Simultaneously</option>
	</select>
</div>`;
  },

  //---------------------------------------------------------------------
  // Action Editor Init Code
  //---------------------------------------------------------------------

  init() {
    const { glob, document } = this;

    const $cmds = glob.$cmds;
    const coms = document.getElementById('commands');
    coms.innerHTML = '';
    for (let i = 0; i < $cmds.length; i++) {
      if ($cmds[i]) {
        coms.innerHTML += `<option value="${$cmds[i]._id}">${$cmds[i].name}</option>\n`;
      }
    }

    const $evts = glob.$evts;
    const evet = document.getElementById('events');
    evet.innerHTML = '';
    for (let i = 0; i < $evts.length; i++) {
      if ($evts[i]) {
        evet.innerHTML += `<option value="${$evts[i]._id}">${$evts[i].name}</option>\n`;
      }
    }
  },

  //---------------------------------------------------------------------
  // Action Bot Function
  //---------------------------------------------------------------------

  action(cache) {
    const data = cache.actions[cache.index];
    const Files = this.getDBM().Files;

    const id = data.source;
    let actions;
    const allData = Files.data.commands.concat(Files.data.events);
    for (let i = 0; i < allData.length; i++) {
      if (allData[i]?._id === id) {
        actions = allData[i].actions;
        break;
      }
    }

    if (!actions) {
      this.callNextAction(cache);
      return;
    }

    const waitForCompletion = data.type === 'true';
    let callback = null;
    if (waitForCompletion) {
      callback = () => this.callNextAction(cache);
    }
    this.executeSubActions(actions, cache, callback);
    if (!waitForCompletion) {
      this.callNextAction(cache);
    }
  },

  //---------------------------------------------------------------------
  // Action Bot Mod
  //---------------------------------------------------------------------

  mod() {},
};
