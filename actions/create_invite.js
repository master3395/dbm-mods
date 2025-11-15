module.exports = {
  //---------------------------------------------------------------------
  // Action Name
  //---------------------------------------------------------------------

  name: 'Create Invite',

  //---------------------------------------------------------------------
  // Action Section
  //---------------------------------------------------------------------

  section: 'Channel Control',

  //---------------------------------------------------------------------
  // Action Subtitle
  //---------------------------------------------------------------------

  subtitle(data, presets) {
    return `Invite to ${presets.getChannelText(data.channel, data.varName)}`;
  },

  //---------------------------------------------------------------------
  // Action Storage Function
  //---------------------------------------------------------------------

  variableStorage(data, varType) {
    const type = parseInt(data.storage, 10);
    if (type !== varType) return;
    return [data.varName2, 'Text'];
  },

  //---------------------------------------------------------------------
  // Action Meta Data
  //---------------------------------------------------------------------

  meta: {
    version: '2.2.0',
    preciseCheck: true,
    author: null,
    authorUrl: null,
    downloadUrl: 'https://github.com/DBM-POLSKA/DBM-14/blob/main/bot-files/actions/create_invite.js',
  },

  //---------------------------------------------------------------------
  // Action Fields
  //---------------------------------------------------------------------

  fields: ['channel', 'varName', 'maxUses', 'lifetime', 'tempInvite', 'unique', 'storage', 'varName2', 'reason'],

  //---------------------------------------------------------------------
  // Command HTML
  //---------------------------------------------------------------------

  html(isEvent, data) {
    return `
<channel-input dropdownLabel="Source Channel" selectId="channel" variableContainerId="varNameContainer" variableInputId="varName"></channel-input>

<br><br><br>

<div style="padding-top: 8px;">
	<div style="float: left; width: calc(70% - 12px);">
		<span class="dbminputlabel">Max Uses</span><br>
		<input id="maxUses" class="round" type="text" placeholder="Leave blank for infinite uses!"><br>
		<span class="dbminputlabel">Invite Lifetime (in seconds)</span><br>
		<input id="lifetime" class="round" type="text" placeholder="Leave blank to last forever!"><br>
	</div>
	<div style="float: right; width: calc(30% - 12px);">
		<span class="dbminputlabel">Temporary Invite</span><br>
		<select id="tempInvite" class="round">
			<option value="true">Yes</option>
			<option value="false" selected>No</option>
		</select><br>
		<span class="dbminputlabel">Is Unique</span><br>
		<select id="unique" class="round">
			<option value="true" selected>Yes</option>
			<option value="false">No</option>
		</select>
	</div>
</div>

<br><br><br><br><br><br><br>

<hr class="subtlebar">

<br>

<div>
  <span class="dbminputlabel">Reason</span><br>
  <input id="reason" placeholder="Optional" class="round" type="text">
</div>

<br>

<store-in-variable allowNone selectId="storage" variableInputId="varName2" variableContainerId="varNameContainer2"></store-in-variable>`;
  },

  //---------------------------------------------------------------------
  // Action Editor Init Code
  //---------------------------------------------------------------------

  init() {},

  //---------------------------------------------------------------------
  // Action Bot Function
  //---------------------------------------------------------------------

  async action(cache) {
    const data = cache.actions[cache.index];
    const channel = await this.getChannelFromData(data.channel, data.varName, cache);
    const reason = this.evalMessage(data.reason, cache);

    const options = {};
    if (data.maxUses) {
      options.maxUses = parseInt(this.evalMessage(data.maxUses, cache), 10);
    } else {
      options.maxUses = 0;
    }
    if (data.lifetime) {
      options.maxAge = parseInt(this.evalMessage(data.lifetime, cache), 10);
    } else {
      options.maxAge = 0;
    }
    if (options.maxAge > 86400) options.maxAge = 86400;
    if (reason) options.reason = reason;
    options.temporary = data.temporary === 'true';
    options.unique = data.unique === 'true';

    if (Array.isArray(channel)) {
      this.callListFunc(channel, 'createInvite', [options]).then((invite) => {
        const varName2 = this.evalMessage(data.varName2, cache);
        const storage2 = parseInt(data.storage, 10);
        this.storeValue(invite.url, storage2, varName2, cache);
        this.callNextAction(cache);
      });
    } else if (channel?.createInvite) {
      channel
        .createInvite(options)
        .then((invite) => {
          const varName2 = this.evalMessage(data.varName2, cache);
          const storage2 = parseInt(data.storage, 10);
          this.storeValue(invite.url, storage2, varName2, cache);
          this.callNextAction(cache);
        })
        .catch((err) => this.displayError(data, cache, err));
    } else {
      this.callNextAction(cache);
    }
  },

  //---------------------------------------------------------------------
  // Action Bot Mod
  //---------------------------------------------------------------------

  mod() {},
};
