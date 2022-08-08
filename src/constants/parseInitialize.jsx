import Parse from "parse/dist/parse.min.js";
import Keys from "../keys.json";

Parse.initialize(Keys.parse.appId, Keys.parse.javascriptKey);
Parse.serverURL = "https://parseapi.back4app.com";

export default Parse;
