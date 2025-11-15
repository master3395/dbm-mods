module.exports = {
  // ---------------------------------------------------------------------
  // Action Name
  // ---------------------------------------------------------------------

  name: 'Add Reaction',

  // ---------------------------------------------------------------------
  // Action Section
  // ---------------------------------------------------------------------

  section: 'Messaging',

  // ---------------------------------------------------------------------
  // Action Subtitle
  // ---------------------------------------------------------------------

  subtitle(data, presets) {
    return `Add Reaction to ${presets.getMessageText(data.storage, data.varName)}`;
  },

  // ---------------------------------------------------------------------
  // Action Meta Data
  // ---------------------------------------------------------------------

  meta: {
    version: '2.2.0',
    preciseCheck: true,
    author: null,
    authorUrl: null,
    downloadUrl: 'https://github.com/DBM-POLSKA/DBM-14/blob/main/bot-files/actions/add_reaction.js',
  },

  // ---------------------------------------------------------------------
  // Action Fields
  // ---------------------------------------------------------------------

  fields: ['storage', 'varName', 'emoji', 'varName2', 'varName3'],

  // ---------------------------------------------------------------------
  // Command HTML
  // ---------------------------------------------------------------------

  html(isEvent, data) {
    return `
<message-input dropdownLabel="Source Message" selectId="storage" variableContainerId="varNameContainer" variableInputId="varName"></message-input>

<br><br><br>

<div style="padding-top: 8px;">
	<div style="float: left; width: 35%;">
		<span class="dbminputlabel">Source Emoji</span><br>
		<select id="emoji" name="second-list" class="round" onchange="glob.onChange1(this)">
			<option value="4" selected>Direct Emoji</option>
			<option value="0">Custom Emoji</option>
			<option value="1">Temp Variable</option>
			<option value="2">Server Variable</option>
			<option value="3">Global Variable</option>
		</select>
	</div>
	<div id="varNameContainer2" style="float: right; width: 60%;">
		<span id="extName" class="dbminputlabel">Emoji (right-click -> Insert Emoji)</span><br>
		<input id="varName2" class="round" type="text">
	</div>
	<div id="varNameContainer3" style="float: right; width: 60%; display: none;">
		<span class="dbminputlabel">Variable Name</span><br>
		<input id="varName3" class="round" type="text" list="variableList2">
	</div>
</div>`;
  },

  // ---------------------------------------------------------------------
  // Action Editor Init Code
  // ---------------------------------------------------------------------

  init() {
    const { glob, document } = this;

    glob.onChange1 = function (event) {
      const value = parseInt(event.value, 10);
      const varNameInput = document.getElementById('extName');
      if (value === 0) {
        varNameInput.innerHTML = 'Emoji Name';
        document.getElementById('varNameContainer3').style.display = 'none';
        document.getElementById('varNameContainer2').style.display = null;
      } else if (value === 4) {
        varNameInput.innerHTML = 'Emoji  (right-click -> Insert Emoji)';
        document.getElementById('varNameContainer3').style.display = 'none';
        document.getElementById('varNameContainer2').style.display = null;
      } else {
        glob.onChangeBasic(event, 'varNameContainer3');
        document.getElementById('varNameContainer3').style.display = null;
        document.getElementById('varNameContainer2').style.display = 'none';
      }
    };

    glob.onChange1(document.getElementById('emoji'));
  },

  // ---------------------------------------------------------------------
  // Action Bot Function
  // ---------------------------------------------------------------------

  async action(cache) {
    const data = cache.actions[cache.index];
    const message = await this.getMessageFromData(data.storage, data.varName, cache);

    const type = parseInt(data.emoji, 10);
    let emoji;
    if (type === 4) {
      emoji = this.evalMessage(data.varName2, cache);
    } else if (type === 0) {
      emoji = this.getDBM().Bot.bot.emojis.cache.find((e) => e.name === this.evalMessage(data.varName2, cache));
    } else {
      emoji = this.getVariable(type, this.evalMessage(data.varName3, cache), cache);
    }

    if (Array.isArray(message)) {
      this.callListFunc(message, 'react', [emoji])
        .then(() => this.callNextAction(cache))
        .catch((err) => this.displayError(data, cache, err));
    } else if (emoji && message?.react) {
      message
        .react(emoji)
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
