module.exports = {
  // ---------------------------------------------------------------------
  // Action Name
  // ---------------------------------------------------------------------

  name: 'Add Member Role',

  // ---------------------------------------------------------------------
  // Action Section
  // ---------------------------------------------------------------------

  section: 'Member Control',

  // ---------------------------------------------------------------------
  // Action Subtitle
  // ---------------------------------------------------------------------

  subtitle(data, presets) {
    return `${presets.getMemberText(data.member, data.varName2)} - ${presets.getRoleText(data.role, data.varName)}`;
  },

  // ---------------------------------------------------------------------
  // Action Meta Data
  // ---------------------------------------------------------------------

  meta: {
    version: '2.2.0',
    preciseCheck: true,
    author: 'Shadow',
    authorUrl: 'https://github.com/DBM-POLSKA',
    downloadUrl: 'https://github.com/DBM-POLSKA/DBM-14/blob/main/bot-files/actions/add_member_role.js',
  },

  // ---------------------------------------------------------------------
  // Action Fields
  // ---------------------------------------------------------------------

  fields: ['member', 'varName2', 'role', 'varName', 'reason', 'server', 'varName3', 'selectServerManually'],

  // ---------------------------------------------------------------------
  // Command HTML
  // ---------------------------------------------------------------------

  html(isEvent, data) {
    return `
  <help-icon dialogTitle="[Add Member Role] Server" dialogWidth="640" dialogHeight="300">
  <div style="padding: 16px;">
    <div style="background-color:rgba(0, 0, 0, 0.41); border: 2px solid rgba(255, 255, 255, 0.5); padding: 10px; border-radius: 5px; margin-bottom: 10px;">
      <u><b><span style="font-size: 15px;">Select Server Manually</span></b></u><br>
      <div style="display: flex; gap: 20px;">  
        <ul style="flex: 1; padding-left: 20px; margin: 0;">
          <li>This option should be enabled when the action is used outside the server, e.g. in private messages.</li>
          <li>When this action is used on a server, this option can be unchecked (then the server will be set automatically).</li>
        </ul>
      </div>
    </div>
  </div>
</help-icon>

<div id="sourceServerContainer">
<server-input dropdownLabel="Source Server" selectId="server" variableContainerId="varNameContainer3" variableInputId="varName3"></server-input>
</div>
<br><br><br>
<dbm-checkbox id="selectServerManually" label="Select Server Manually"></dbm-checkbox>

<br>
<hr class="subtlebar" style="margin-top: 4px; margin-bottom: 4px; width: 100%;">

<br>

<role-input dropdownLabel="Source Role" selectId="role" variableContainerId="varNameContainer" variableInputId="varName"></role-input>

<br><br><br>

<member-input style="padding-top: 8px;" dropdownLabel="Member" selectId="member" variableContainerId="varNameContainer2" variableInputId="varName2"></member-input>

<br><br><br><br>

<div style="padding-top: 8px;">
  <span class="dbminputlabel">Reason</span>
  <input id="reason" placeholder="Optional" class="round" type="text">
</div>


<style>
  .dimmed {
    opacity: 0.5;
    pointer-events: none;
  }
</style>
`;
  },

  // ---------------------------------------------------------------------
  // Action Editor Init Code
  //
  // When the HTML is first applied to the action editor, this code
  // is also run. This helps add modifications or setup reactionary
  // functions for the DOM elements.
  // ---------------------------------------------------------------------

  init() {
    const selectServerManually = document.getElementById('selectServerManually');
    const sourceServerContainer = document.getElementById('sourceServerContainer');
    const updateServerState = () => {
      if (selectServerManually.value !== true) {
        sourceServerContainer.classList.add('dimmed');
      } else {
        sourceServerContainer.classList.remove('dimmed');
      }
    };
    selectServerManually.addEventListener('change', updateServerState);
    updateServerState();
  },

  // ---------------------------------------------------------------------
  // Action Bot Function
  //
  // This is the function for the action within the Bot's Action class.
  // Keep in mind event calls won't have access to the "msg" parameter,
  // so be sure to provide checks for variable existence.
  // ---------------------------------------------------------------------

  async action(cache) {
    const data = cache.actions[cache.index];
    const reason = this.evalMessage(data.reason, cache);

    let server = cache.server;
    if (data.selectServerManually) {
      const serverId = this.evalMessage(data.varName3, cache);
      server = this.getDBM().Bot.bot.guilds.cache.get(serverId);
    }

    if (!server) {
      console.warn('[Add Member Role] Server not found.');
      return this.callNextAction(cache);
    }

    const role = await this.getRoleFromData(data.role, data.varName, {
      ...cache,
      server,
    });
    const member = await this.getMemberFromData(data.member, data.varName2, {
      ...cache,
      server,
    });

    if (Array.isArray(member)) {
      this.callListFunc(
        member.map((m) => m.roles),
        'add',
        [role, reason],
      )
        .then(() => this.callNextAction(cache))
        .catch((err) => this.displayError(data, cache, err));
    } else if (member?.roles) {
      member.roles
        .add(role, reason)
        .then(() => this.callNextAction(cache))
        .catch((err) => this.displayError(data, cache, err));
    } else {
      this.callNextAction(cache);
    }
  },

  // ---------------------------------------------------------------------
  // Action Bot Mod
  //
  // Upon initialization of the bot, this code is run. Using the bot's
  // DBM namespace, one can add/modify existing functions if necessary.
  // In order to reduce conflicts between mods, be sure to alias
  // functions you wish to overwrite.
  // ---------------------------------------------------------------------

  mod() {},
};
