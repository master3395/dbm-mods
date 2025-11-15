module.exports = {
  // ---------------------------------------------------------------------
  // Action Name
  // ---------------------------------------------------------------------

  name: 'Archive Thread',

  // ---------------------------------------------------------------------
  // Action Section
  // ---------------------------------------------------------------------

  section: 'Channel Control',

  // ---------------------------------------------------------------------
  // Action Subtitle
  // ---------------------------------------------------------------------

  subtitle(data, presets) {
    return `${data.archive === 'true' ? 'Archive' : 'Unarchive'} Thread: "${presets.getChannelText(
      data.thread,
      data.threadVarName,
    )}"`;
  },

  // ---------------------------------------------------------------------
  // Action Meta Data
  // ---------------------------------------------------------------------

  meta: {
    version: '2.2.0',
    preciseCheck: true,
    author: null,
    authorUrl: null,
    downloadUrl: 'https://github.com/DBM-POLSKA/DBM-14/blob/main/bot-files/actions/archive_thread.js',
  },

  // ---------------------------------------------------------------------
  // Action Fields
  // ---------------------------------------------------------------------

  fields: ['thread', 'threadVarName', 'archive'],

  // ---------------------------------------------------------------------
  // Command HTML
  // ---------------------------------------------------------------------

  html(isEvent, data) {
    return `
<thread-channel-input dropdownLabel="Source Thread" selectId="thread" variableContainerId="varNameContainer" variableInputId="threadVarName"></thread-channel-input>

<br><br><br><br>

<div style="float: left; width: calc(50% - 12px);">
  <span class="dbminputlabel">New Thread State</span><br>
  <select id="archive" class="round">
    <option value="true" selected>Archive</option>
    <option value="false">Unarchive</option>
  </select>
</div>
<div style="float: right; width: calc(50% - 12px);">
  <span class="dbminputlabel">Reason</span>
  <input id="reason" placeholder="Optional" class="round" type="text">
</div>`;
  },

  // ---------------------------------------------------------------------
  // Action Editor Init Code
  // ---------------------------------------------------------------------

  init() {},

  // ---------------------------------------------------------------------
  // Action Bot Function
  // ---------------------------------------------------------------------

  async action(cache) {
    const data = cache.actions[cache.index];
    const thread = await this.getChannelFromData(data.thread, data.threadVarName, cache);

    const reason = this.evalMessage(data.reason, cache);
    const archive = data.archive === 'true';

    if (Array.isArray(thread)) {
      this.callListFunc(thread, 'setArchived', [archive, reason]).then(() => this.callNextAction(cache));
    } else if (thread?.setArchived) {
      thread
        .setArchived(archive, reason)
        .then((threadChannel) => this.callNextAction(cache))
        .catch((err) => this.displayError(data, cache, err));
    } else {
      this.callNextAction(cache);
    }
  },

  // ---------------------------------------------------------------------
  // Action Bot Mod
  // ---------------------------------------------------------------------

  mod() {},
};
