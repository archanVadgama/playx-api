// global.ts
import * as log from "./utility/logger.js";
import * as helper from "./utility/helper.js";
import * as response from "./utility/response-code.js";
// Assign to global object
global.logHttp = log.logHttp;
global.apiResponse = helper.apiResponse;
global.getHashPassword = helper.getHashPassword;
global.verifyPassword = helper.verifyPassword;
global.safeJson = helper.safeJson;
global.generateUUID = helper.generateUUID;
const ResponseCategory = response.ResponseCategory;
global.ResponseCategory = ResponseCategory;
//# sourceMappingURL=global.js.map
