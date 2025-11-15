module.exports = {
  // ---------------------------------------------------------------------
  // Action Name
  // ---------------------------------------------------------------------

  name: 'Set Role Icon',

  // ---------------------------------------------------------------------
  // Action Section
  // ---------------------------------------------------------------------

  section: 'Role Control',

  // ---------------------------------------------------------------------
  // Action Subtitle
  // ---------------------------------------------------------------------

  subtitle(data, presets) {
    return `Set Icon of ${presets.getRoleText(data.role, data.roleVarName)} to ${presets.getVariableText(
      data.image,
      data.imageVarName,
    )}`;
  },

  // ---------------------------------------------------------------------
  // Action Meta Data
  // ---------------------------------------------------------------------

  meta: {
    version: '2.2.0',
    preciseCheck: true,
    author: null,
    authorUrl: null,
    downloadUrl: 'https://github.com/DBM-POLSKA/DBM-14/blob/main/bot-files/actions/set_role_icon.js',
  },

  // ---------------------------------------------------------------------
  // Action Fields
  // ---------------------------------------------------------------------

  fields: ['role', 'roleVarName', 'image', 'imageVarName', 'reason'],

  // ---------------------------------------------------------------------
  // Command HTML
  // ---------------------------------------------------------------------

  html(isEvent, data) {
    return `
<div>
  <p>
    <u>Note:</u><br>
    Role icons only work in servers with a high enough boost level. If you are having issues, please ensure you are able to set role icons yourself before attempting with the bot.
  </p>
</div>

<br>

<hr class="subtlebar">

<br>

<role-input dropdownLabel="Source Role" selectId="role" variableContainerId="varNameContainer" variableInputId="roleVarName"></role-input>

<br><br><br><br>

<retrieve-from-variable dropdownLabel="Source Image/Emoji" selectId="image" variableContainerId="varNameContainer2" variableInputId="imageVarName"></retrieve-from-variable>

<br><br><br><br>

<span class="dbminputlabel">Reason</span>
<input id="reason" placeholder="Optional" class="round" type="text">`;
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
    const reason = this.evalMessage(data.reason, cache);
    const role = await this.getRoleFromData(data.role, data.roleVarName, cache);

    const imageStorage = parseInt(data.image, 10);
    const imageVarName = this.evalMessage(data.imageVarName, cache);
    let imageOrEmoji = this.getVariable(imageStorage, imageVarName, cache);

    const Images = this.getDBM().Images;
    const DiscordJS = this.getDBM().DiscordJS;

    if (Images.isImage(imageOrEmoji)) {
      imageOrEmoji = await Images.createBuffer(imageOrEmoji);
    } else if (imageOrEmoji instanceof DiscordJS.Emoji) {
      // do nothing, setIcon accepts Emoji class
    } else if (typeof imageOrEmoji === 'string') {
      if (imageOrEmoji.startsWith('http')) {
        imageOrEmoji = await Images.getImage(imageOrEmoji);
      } else {
        // otherwise, the string could be Emoji-resolvable, so do nothing
      }
    }

    if (Array.isArray(role)) {
      this.callListFunc(role, 'setIcon', [imageOrEmoji, reason]).then(() => this.callNextAction(cache));
    } else if (role?.setIcon) {
      role
        .setIcon(imageOrEmoji, reason)
        .then(() => this.callNextAction(cache))
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
