module.exports = {
  // ---------------------------------------------------------------------
  // Action Name
  // ---------------------------------------------------------------------

  name: 'Remove Buttons and Selects',

  // ---------------------------------------------------------------------
  // Action Section
  // ---------------------------------------------------------------------

  section: 'Messaging',

  // ---------------------------------------------------------------------
  // Action Subtitle
  // ---------------------------------------------------------------------

  subtitle(data, presets) {
    return `${presets.getMessageText(data.storage, data.varName)}`;
  },

  // ---------------------------------------------------------------------
  // Action Meta Data
  // ---------------------------------------------------------------------

  meta: {
    version: '2.2.0',
    preciseCheck: true,
    author: null,
    authorUrl: null,
    downloadUrl: 'https://github.com/DBM-POLSKA/DBM-14/blob/main/bot-files/actions/remove_buttons_select.js',
  },

  // ---------------------------------------------------------------------
  // Action Fields
  // ---------------------------------------------------------------------

  fields: ['storage', 'varName', 'type', 'searchValue'],

  // ---------------------------------------------------------------------
  // Command HTML
  // ---------------------------------------------------------------------

  html(isEvent, data) {
    return `
<message-input dropdownLabel="Source Message" selectId="storage" variableContainerId="varNameContainer" variableInputId="varName"></message-input>

<br><br><br><br>

<div style="float: left; width: calc(50% - 12px);">
  <span class="dbminputlabel">Components to Remove</span><br>
  <select id="type" class="round" onchange="glob.onButtonSelectTypeChange(this)">
    <option value="all" selected>All Buttons and Select Menus</option>
    <option value="allButtons">All Buttons</option>
    <option value="allSelects">All Select Menus</option>
    <option value="sourceButton">Source Button</option>
    <option value="sourceSelect">Source Select Menu</option>
    <option value="findButton">Specific Button</option>
    <option value="findSelect">Specific Select Menu</option>
  </select>
</div>

<div id="nameContainer" style="float: right; width: calc(50% - 12px);">
  <span class="dbminputlabel">Component Label/ID</span><br>
  <input id="searchValue" class="round" type="text">
</div>`;
  },

  // ---------------------------------------------------------------------
  // Action Editor Init Code
  // ---------------------------------------------------------------------

  init() {
    const { glob } = this;

    glob.onButtonSelectTypeChange = function (event) {
      const input = document.getElementById('nameContainer');
      input.style.display = event.value === 'findButton' || event.value === 'findSelect' ? null : 'none';
    };

    glob.onButtonSelectTypeChange(document.getElementById('type'));
  },

  // ---------------------------------------------------------------------
  // Action Bot Function
  // ---------------------------------------------------------------------

  async action(cache) {
    const data = cache.actions[cache.index];
    const message = await this.getMessageFromData(data.storage, data.varName, cache);

    const type = data.type;

    let sourceButton = null;
    if (cache.interaction && cache.interaction.isButton()) {
      sourceButton = cache.interaction.customId;
    }

    let sourceSelect = null;
    if (cache.interaction && cache.interaction.isSelectMenu()) {
      sourceSelect = cache.interaction.customId;
    }

    let components = null;

    let searchValue = null;

    const messageId = message.id;
    if (type === 'all') {
      components = [];
      this.clearAllTemporaryInteractions(messageId);
    } else if (message?.components) {
      const { ActionRowBuilder } = this.getDBM().DiscordJS;
      const oldComponents = message.components;
      const newComponents = [];

      for (let i = 0; i < oldComponents.length; i++) {
        const compData = oldComponents[i];
        const comps = compData instanceof ActionRowBuilder ? compData.toJSON() : compData;
        const newComps = [];

        for (let j = 0; j < comps.components.length; j++) {
          const comp = comps.components[j];
          let deleted = false;
          const id = comp.custom_id ?? comp.customId;

          switch (type) {
            case 'allButtons': {
              if (comp.type !== 2 || comp.type === 'BUTTON') newComps.push(comp);
              else deleted = true;
              break;
            }
            case 'allSelects': {
              if (comp.type !== 3 || comp.type === 'SELECT_MENU') newComps.push(comp);
              else deleted = true;
              break;
            }
            case 'sourceButton': {
              if (id !== sourceButton) newComps.push(comp);
              else deleted = true;
              break;
            }
            case 'sourceSelect': {
              if (id !== sourceSelect) newComps.push(comp);
              else deleted = true;
              break;
            }
            case 'findButton':
            case 'findSelect': {
              if (searchValue === null) searchValue = this.evalMessage(data.searchValue, cache);
              if (id !== searchValue && comp.label !== searchValue) newComps.push(comp);
              else deleted = true;
              break;
            }
          }

          if (deleted) {
            this.clearTemporaryInteraction(messageId, id);
          }
        }

        comps.components = newComps;
        if (newComps.length > 0) newComponents.push(comps);
      }
      components = newComponents;
    }

    if (components) {
      if (Array.isArray(message)) {
        this.callListFunc(message, 'edit', [{ components }]).then(() => this.callNextAction(cache));
      } else if (
        cache.interaction?.message?.id === message?.id &&
        cache.interaction?.update &&
        !cache.interaction?.replied
      ) {
        cache.interaction
          .update({ components })
          .then(() => this.callNextAction(cache))
          .catch((err) => this.displayError(data, cache, err));
      } else if (message?.edit) {
        message
          .edit({ components })
          .then(() => this.callNextAction(cache))
          .catch((err) => this.displayError(data, cache, err));
      } else {
        if (message.components) {
          message.components = components;
        }
        this.callNextAction(cache);
      }
    } else {
      this.callNextAction(cache);
    }
  },

  // ---------------------------------------------------------------------
  // Action Bot Mod
  // ---------------------------------------------------------------------

  mod() {},
};
