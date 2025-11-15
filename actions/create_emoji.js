module.exports = {
  //---------------------------------------------------------------------
  // Action Name
  //---------------------------------------------------------------------

  name: 'Create Emoji',

  //---------------------------------------------------------------------
  // Action Section
  //---------------------------------------------------------------------

  section: 'Emoji/Sticker Control',

  //---------------------------------------------------------------------
  // Action Subtitle
  //---------------------------------------------------------------------

  subtitle(data, presets) {
    return `${data.emojiName}`;
  },

  //---------------------------------------------------------------------
  // Action Storage Function
  //---------------------------------------------------------------------

  variableStorage(data, varType) {
    const type = parseInt(data.storage2, 10);
    if (type !== varType) return;
    return [data.varName2, 'Emoji'];
  },

  //---------------------------------------------------------------------
  // Action Meta Data
  //---------------------------------------------------------------------

  meta: {
    version: '2.2.0',
    preciseCheck: true,
    author: null,
    authorUrl: null,
    downloadUrl: 'https://github.com/DBM-POLSKA/DBM-14/blob/main/bot-files/actions/create_emoji.js',
  },

  //---------------------------------------------------------------------
  // Action Fields
  //---------------------------------------------------------------------

  fields: ['emojiName', 'storage', 'varName', 'storage2', 'varName2'],

  //---------------------------------------------------------------------
  // Command HTML
  //---------------------------------------------------------------------

  html(isEvent, data) {
    return `
<div>
	<span class="dbminputlabel">Emoji Name</span><br>
	<input id="emojiName" class="round" type="text">
</div>

<br>

<retrieve-from-variable dropdownLabel="Source Image" selectId="storage" variableContainerId="varNameContainer" variableInputId="varName"></retrieve-from-variable>

<br><br><br><br>

<hr class="subtlebar" style="margin-top: 0px;">

<br>

<store-in-variable allowNone style="padding-top: 8px;" selectId="storage2" variableInputId="varName2" variableContainerId="varNameContainer2"></store-in-variable>`;
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
    const guild = cache.guild;
    if (!guild?.emojis) return this.callNextAction(cache);

    const type = parseInt(data.storage, 10);
    const varName = this.evalMessage(data.varName, cache);
    const image = this.getVariable(type, varName, cache);
    const { Images } = this.getDBM();

    let buffer;
    try {
      buffer = Images.createBuffer(image);
    } catch {
      return this.displayError(data, cache);
    }

    guild.emojis
      .create({
        image: buffer,
        name: this.evalMessage(data.emojiName, cache),
      })

      .then((emoji) => {
        const varName2 = this.evalMessage(data.varName2, cache);
        const storage = parseInt(data.storage, 10);
        this.storeValue(emoji, storage, varName2, cache);
        this.callNextAction(cache);
      })
      .catch((err) => this.displayError(data, cache, err));
  },

  //---------------------------------------------------------------------
  // Action Bot Mod
  //---------------------------------------------------------------------

  mod() {},
};
