module.exports = {
  //---------------------------------------------------------------------
  // Action Name
  //---------------------------------------------------------------------

  name: 'Check Variable Type',

  //---------------------------------------------------------------------
  // Action Section
  //---------------------------------------------------------------------

  section: 'Conditions',

  //---------------------------------------------------------------------
  // Action Subtitle
  //---------------------------------------------------------------------

  subtitle(data, presets) {
    return `${presets.getConditionsText(data)}`;
  },

  //---------------------------------------------------------------------
  // Action Meta Data
  //---------------------------------------------------------------------

  meta: {
    version: '2.2.0',
    preciseCheck: true,
    author: null,
    authorUrl: null,
    downloadUrl: 'https://github.com/DBM-POLSKA/DBM-14/blob/main/bot-files/actions/check_variable_type.js',
  },

  //---------------------------------------------------------------------
  // Action Fields
  //---------------------------------------------------------------------

  fields: ['storage', 'varName', 'comparison', 'branch'],

  //---------------------------------------------------------------------
  // Command HTML
  //---------------------------------------------------------------------

  html(isEvent, data) {
    return `
<retrieve-from-variable allowSlashParams dropdownLabel="Variable" selectId="storage" variableContainerId="varNameContainer" variableInputId="varName"></retrieve-from-variable>

<br><br><br>

<div style="padding-top: 8px; width: 80%;">
		<span class="dbminputlabel">Variable Type to Check</span><br>
		<select id="comparison" class="round">
			<option value="0" selected>Number</option>
			<option value="1">String</option>
			<option value="2">Image</option>
			<option value="3">Member</option>
			<option value="4">Message</option>
			<option value="5">Text Channel</option>
			<option value="6">Voice Channel</option>
			<option value="7">Role</option>
			<option value="8">Server</option>
			<option value="9">Emoji</option>
      <option value="10">Sticker</option>
      <option value="11">Thread Channel</option>
		</select>
</div>

<br>

<hr class="subtlebar">

<br>

<conditional-input id="branch"></conditional-input>`;
  },

  //---------------------------------------------------------------------
  // Action Editor Pre-Init Code
  //---------------------------------------------------------------------

  preInit(data, formatters) {
    return formatters.compatibility_2_0_0_iftruefalse_to_branch(data);
  },

  //---------------------------------------------------------------------
  // Action Editor Init Code
  //---------------------------------------------------------------------

  init() {},

  //---------------------------------------------------------------------
  // Action Bot Function
  //---------------------------------------------------------------------

  action(cache) {
    const data = cache.actions[cache.index];
    const type = parseInt(data.storage, 10);
    const varName = this.evalMessage(data.varName, cache);
    const variable = this.getVariable(type, varName, cache);
    let result = false;
    if (variable) {
      const DiscordJS = this.getDBM().DiscordJS;
      const compare = parseInt(data.comparison, 10);
      switch (compare) {
        case 0:
          result = typeof variable === 'number';
          break;
        case 1:
          result = typeof variable === 'string';
          break;
        case 2:
          result = variable instanceof this.getDBM().JIMP;
          break;
        case 3:
          result = variable instanceof DiscordJS.GuildMember;
          break;
        case 4:
          result = variable instanceof DiscordJS.Message;
          break;
        case 5:
          result =
            variable instanceof DiscordJS.TextChannel ||
            variable instanceof DiscordJS.NewsChannel ||
            variable instanceof DiscordJS.StoreChannel;
          break;
        case 6:
          result = variable instanceof DiscordJS.VoiceChannel;
          break;
        case 7:
          result = variable instanceof DiscordJS.Role;
          break;
        case 8:
          result = variable instanceof DiscordJS.Guild;
          break;
        case 9:
          result = variable instanceof DiscordJS.Emoji || variable instanceof DiscordJS.GuildEmoji;
          break;
        case 10:
          result = variable instanceof DiscordJS.Sticker;
          break;
        case 11:
          result = variable instanceof DiscordJS.ThreadChannel;
          break;
      }
    }
    this.executeResults(result, data?.branch ?? data, cache);
  },

  //---------------------------------------------------------------------
  // Action Bot Mod Init
  //---------------------------------------------------------------------

  modInit(data) {
    this.prepareActions(data.branch?.iftrueActions);
    this.prepareActions(data.branch?.iffalseActions);
  },

  //---------------------------------------------------------------------
  // Action Bot Mod
  //---------------------------------------------------------------------

  mod() {},
};
