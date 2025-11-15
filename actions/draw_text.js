module.exports = {
  // ---------------------------------------------------------------------
  // Action Name
  // ---------------------------------------------------------------------

  name: 'Draw Text on Image',

  // ---------------------------------------------------------------------
  // Action Section
  // ---------------------------------------------------------------------

  section: 'Image Editing',

  // ---------------------------------------------------------------------
  // Action Subtitle
  // ---------------------------------------------------------------------

  subtitle(data, presets) {
    return `${data.text}`;
  },

  // ---------------------------------------------------------------------
  // Action Meta Data
  // ---------------------------------------------------------------------

  meta: {
    version: '2.2.0',
    preciseCheck: true,
    author: null,
    authorUrl: null,
    downloadUrl: 'https://github.com/DBM-POLSKA/DBM-14/blob/main/bot-files/actions/draw_text.js',
  },

  // ---------------------------------------------------------------------
  // Action Fields
  // ---------------------------------------------------------------------

  fields: ['storage', 'varName', 'x', 'y', 'font', 'width', 'text'],

  // ---------------------------------------------------------------------
  // Command HTML
  // ---------------------------------------------------------------------

  html(isEvent, data) {
    return `
<retrieve-from-variable dropdownLabel="Source Image" selectId="storage" variableContainerId="varNameContainer" variableInputId="varName"></retrieve-from-variable>

<br><br><br>

<div style="float: left; width: calc(50% - 12px);">
	<span class="dbminputlabel">Local Font URL (.fnt)</span><br>
	<input id="font" class="round" type="text" value="fonts/Asimov.fnt"><br>
	<span class="dbminputlabel">X Position</span><br>
	<input id="x" class="round" type="text" value="0"><br>
</div>
<div style="float: right; width: calc(50% - 12px);">
	<span class="dbminputlabel">Max Width</span><br>
	<input id="width" class="round" type="text" placeholder="Leave blank for none!"><br>
	<span class="dbminputlabel">Y Position</span><br>
	<input id="y" class="round" type="text" value="0"><br>
</div>

<br><br><br>

<div>
	<span class="dbminputlabel">Text</span><br>
	<textarea id="text" rows="5" placeholder="Insert text here..." style="white-space: nowrap; resize: none;"></textarea>
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
    const Images = this.getDBM().Images;
    const data = cache.actions[cache.index];
    const storage = parseInt(data.storage, 10);
    const varName = this.evalMessage(data.varName, cache);
    const image = this.getVariable(storage, varName, cache);
    if (!image) {
      this.callNextAction(cache);
      return;
    }
    const fontName = this.evalMessage(data.font, cache);
    const x = parseInt(this.evalMessage(data.x, cache), 10);
    const y = parseInt(this.evalMessage(data.y, cache), 10);
    const width = data.width ? parseInt(this.evalMessage(data.width, cache), 10) : null;
    const text = this.evalMessage(data.text, cache);
    Images.getFont(fontName)
      .then(
        function (font) {
          if (width) {
            image.print(font, x, y, text, width);
          } else {
            image.print(font, x, y, text);
          }
          this.callNextAction(cache);
        }.bind(this),
      )
      .catch((err) => this.displayError(data, cache, err));
  },

  // ---------------------------------------------------------------------
  // Action Bot Mod
  // ---------------------------------------------------------------------

  mod() {},
};
