module.exports = {
  // ---------------------------------------------------------------------
  // Action Name
  // ---------------------------------------------------------------------

  name: 'Create Sticker',

  // ---------------------------------------------------------------------
  // Action Section
  // ---------------------------------------------------------------------

  section: 'Emoji/Sticker Control',

  // ---------------------------------------------------------------------
  // Action Subtitle
  // ---------------------------------------------------------------------

  subtitle(data, presets) {
    return `${data.stickerName}`;
  },

  // ---------------------------------------------------------------------
  // Action Storage Function
  // ---------------------------------------------------------------------

  variableStorage(data, varType) {
    if (parseInt(data.storage2, 10) !== varType) return;
    return [data.varName2, 'Sticker'];
  },

  // ---------------------------------------------------------------------
  // Action Meta Data
  // ---------------------------------------------------------------------

  meta: {
    version: '2.2.0',
    preciseCheck: true,
    author: null,
    authorUrl: null,
    downloadUrl: 'https://github.com/DBM-POLSKA/DBM-14/blob/main/bot-files/actions/create_sticker.js',
  },

  // ---------------------------------------------------------------------
  // Action Fields
  // ---------------------------------------------------------------------

  fields: ['stickerName', 'description', 'tag', 'storage', 'varName', 'storage2', 'varName2'],

  // ---------------------------------------------------------------------
  // Command HTML
  // ---------------------------------------------------------------------

  html(isEvent, data) {
    return `
<div>
	<span class="dbminputlabel">Sticker Name</span><br>
	<input id="stickerName" class="round" type="text">
</div>

<br>

<retrieve-from-variable dropdownLabel="Source Image" selectId="storage" variableContainerId="varNameContainer" variableInputId="varName"></retrieve-from-variable>

<br><br><br>

<div>
  <span class="dbminputlabel">Sticker Tag</span><br>
  <input id="tag" class="round" type="text" placeholder="A standard emoji name. This is required.">
</div>

<br>

<div>
	<span class="dbminputlabel">Sticker Description</span><br>
	<input id="description" class="round" type="text" placeholder="Leave empty for none">
</div>

<br><br>

<hr class="subtlebar" style="margin-top: 0px;">

<br>

<store-in-variable allowNone style="padding-top: 8px;" selectId="storage2" variableInputId="varName2" variableContainerId="varNameContainer2"></store-in-variable>`;
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
    const server = cache.server;
    if (!server) return this.callNextAction(cache);

    const varName = this.evalMessage(data.varName, cache);
    const image = this.getVariable(parseInt(data.storage, 10), varName, cache);
    const { Images } = this.getDBM();

    let buffer;
    try {
      buffer = Images.createBuffer(image);
    } catch {
      return this.displayError(data, cache);
    }

    const tag = this.evalMessage(data.tag, cache);
    const description = this.evalMessage(data.description, cache);

    server.stickers
      .create(buffer, this.evalMessage(data.stickerName, cache), tag, {
        description,
      })
      .then((sticker) => {
        const varName2 = this.evalMessage(data.varName2, cache);
        const storage = parseInt(data.storage, 10);
        this.storeValue(sticker, storage, varName2, cache);
        this.callNextAction(cache);
      })
      .catch((err) => this.displayError(data, cache, err));
  },

  // ---------------------------------------------------------------------
  // Action Bot Mod
  // ---------------------------------------------------------------------

  mod() {},
};
