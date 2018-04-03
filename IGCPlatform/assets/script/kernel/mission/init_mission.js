
window.igc_mission = {}

const require_connect_mission = require("connect_mission");
igc_mission.connect = new require_connect_mission();

const require_logon_mission = require("logon_mission");
igc_mission.logon = new require_logon_mission();
