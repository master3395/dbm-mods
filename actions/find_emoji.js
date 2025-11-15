module.exports = {
  //---------------------------------------------------------------------
  // Action Name
  //---------------------------------------------------------------------

  name: 'Find Custom Emoji',

  //---------------------------------------------------------------------
  // Action Display Name
  //---------------------------------------------------------------------

  displayName: 'Find Custom Emoji/Sticker',

  //---------------------------------------------------------------------
  // Action Section
  //---------------------------------------------------------------------

  section: 'Emoji/Sticker Control',

  //---------------------------------------------------------------------
  // Action Subtitle
  //---------------------------------------------------------------------

  subtitle(data, presets) {
    const infoTexts = ['Emoji ID', 'Emoji Name', 'Sticker ID', 'Sticker Name'];
    const info = parseInt(data.info, 10);
    return `Find ${info >= 2 ? 'Sticker' : 'Emoji'} by ${infoTexts[info]} (${data.find})`;
  },

  //---------------------------------------------------------------------
  // Action Storage Function
  //---------------------------------------------------------------------

  variableStorage(data, varType) {
    const type = parseInt(data.storage, 10);
    if (type !== varType) return;
    const info = parseInt(data.info, 10);
    return [data.varName, info >= 2 ? 'Sticker' : 'Emoji'];
  },

  //---------------------------------------------------------------------
  // Action Meta Data
  //---------------------------------------------------------------------

  meta: {
    version: '2.2.0',
    preciseCheck: true,
    author: null,
    authorUrl: null,
    downloadUrl: 'https://github.com/DBM-POLSKA/DBM-14/blob/main/bot-files/actions/find_emoji.js',
  },

  //---------------------------------------------------------------------
  // Action Fields
  //---------------------------------------------------------------------

  fields: ['info', 'find', 'storage', 'varName'],

  //---------------------------------------------------------------------
  // Command HTML
  //---------------------------------------------------------------------

  html(isEvent, data) {
    return `
<div>
	<div style="float: left; width: calc(45% - 12px);">
		<span class="dbminputlabel">Source Field</span><br>
		<select id="info" class="round">
			<option value="0" selected>Emoji ID</option>
			<option value="1">Emoji Name</option>
      <option value="2">Sticker ID</option>
      <option value="3">Sticker Name</option>
		</select>
	</div>
	<div style="float: right; width: calc(55% - 12px);">
		<span class="dbminputlabel">Search Value</span><br>
		<input id="find" class="round" type="text">
	</div>
</div>

<br><br><br>

<store-in-variable style="padding-top: 8px;" dropdownLabel="Store In" selectId="storage" variableContainerId="varNameContainer" variableInputId="varName" selectWidth="40%" variableInputWidth="55%"></store-in-variable>`;
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
    const bot = this.getDBM().Bot.bot;
    const server = cache.server;

    const info = parseInt(data.info, 10);
    const find = this.evalMessage(data.find, cache);

    let result;
    switch (info) {
      case 0:
        result = bot.emojis.cache.get(find);
        break;
      case 1:
        result = bot.emojis.cache.find((e) => e.name === find);
        break;
      case 2:
        if (server) {
          result = server.stickers.cache.get(find);
        }
        if (result === undefined) {
          try {
            result = await bot.fetchSticker(find);
          } catch (err) {
            this.displayError(data, cache, err);
          }
        }
      case 3:
        if (server) {
          result = server.stickers.cache.find((s) => s.name === find);
        }
      default:
        break;
    }

    if (result !== undefined) {
      const storage = parseInt(data.storage, 10);
      const varName = this.evalMessage(data.varName, cache);
      this.storeValue(result, storage, varName, cache);
    }
    this.callNextAction(cache);
  },

  //---------------------------------------------------------------------
  // Action Bot Mod
  //---------------------------------------------------------------------

  mod() {},
};
