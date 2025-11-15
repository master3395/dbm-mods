module.exports = {
  //---------------------------------------------------------------------
  // Action Name
  //---------------------------------------------------------------------

  name: 'Loop Through All Servers',

  //---------------------------------------------------------------------
  // Action Section
  //---------------------------------------------------------------------

  section: 'Lists and Loops',

  //---------------------------------------------------------------------
  // Action Subtitle
  //---------------------------------------------------------------------

  subtitle(data, presets) {
    return `Loop through every server and run ${data.actions?.length ?? 0} actions.`;
  },

  //---------------------------------------------------------------------
  // Action Meta Data
  //---------------------------------------------------------------------

  meta: {
    version: '2.2.0',
    preciseCheck: true,
    author: null,
    authorUrl: null,
    downloadUrl: 'https://github.com/DBM-POLSKA/DBM-14/blob/main/bot-files/actions/loop_through_all_servers.js',
  },

  //---------------------------------------------------------------------
  // Action Fields
  //---------------------------------------------------------------------

  fields: ['type', 'actions'],

  //---------------------------------------------------------------------
  // Command HTML
  //---------------------------------------------------------------------

  html(isEvent, data) {
    return `
<span class="dbminputlabel">Call Type</span><br>
<select id="type" class="round">
  <option value="true" selected>Wait for Completion</option>
  <option value="false">Process Simultaneously</option>
</select>

<br><br>

<action-list-input id="actions" height="calc(100vh - 300px)"></action-list-input>`;
  },

  //---------------------------------------------------------------------
  // Action Editor Pre-Init Code
  //---------------------------------------------------------------------

  preInit(data, formatters) {
    return formatters.compatibility_2_0_3_loopevent_to_actions(data);
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
    const bot = this.getDBM().Bot.bot;

    const actions = data.actions;
    if (!actions || actions.length <= 0) {
      this.callNextAction(cache);
      return;
    }

    const waitForCompletion = data.type === 'true';

    const servers = [...bot.guilds.cache.values()];
    const act = actions[0];
    if (act && this.exists(act.name)) {
      const looper = (i) => {
        if (!servers[i]) {
          if (waitForCompletion) this.callNextAction(cache);
          return;
        }

        this.executeSubActions(actions, cache, () => looper(i + 1));
      };

      looper(0);

      if (!waitForCompletion) this.callNextAction(cache);
    } else {
      this.callNextAction(cache);
    }
  },

  //---------------------------------------------------------------------
  // Action Bot Mod Init
  //---------------------------------------------------------------------

  modInit(data) {
    this.prepareActions(data.actions);
  },

  //---------------------------------------------------------------------
  // Action Bot Mod
  //---------------------------------------------------------------------

  mod() {},
};
