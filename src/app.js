"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.typeOrmConfig = void 0;
var feathers_1 = require("@feathersjs/feathers");
require("@feathersjs/transport-commons");
var express_1 = require("@feathersjs/express");
var socketio_1 = require("@feathersjs/socketio");
var node_instagram_1 = require("node-instagram");
var dotenv = require("dotenv");
dotenv.config();
exports.typeOrmConfig = {
    clientid: process.env.clientid,
    clientsecret: process.env.clientsecret,
    accesstoken: process.env.accesstoken
};
var instagram = new node_instagram_1["default"]({
    clientId: 'clientid',
    clientSecret: 'clientsecret',
    accessToken: 'accesstoken'
});
// You can use callbacks or promises
// Get information about the owner of the access_token.
function start() {
    return __awaiter(this, void 0, void 0, function () {
        var data;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, instagram.get('users/self')];
                case 1:
                    data = _a.sent();
                    console.log(data);
                    return [2 /*return*/];
            }
        });
    });
}
// Handle errors 
instagram
    .get('tags/paris')
    .then(function (data) {
    console.log(data);
})["catch"](function (err) {
    // An error occured
    console.log(err);
});
// A messages service that allows to create new
// and return all existing messages
var MessageService = /** @class */ (function () {
    function MessageService() {
        this.messages = [];
    }
    MessageService.prototype.find = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                // Just return all our messages
                return [2 /*return*/, this.messages];
            });
        });
    };
    MessageService.prototype.create = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var message;
            return __generator(this, function (_a) {
                message = {
                    id: this.messages.length,
                    text: data.text
                };
                // Add new message to the list
                this.messages.push(message);
                return [2 /*return*/, message];
            });
        });
    };
    return MessageService;
}());
// Creates an ExpressJS compatible Feathers application
var app = express_1["default"](feathers_1["default"]());
// Express middleware to parse HTTP JSON bodies
app.use(express_1["default"].json());
// Express middleware to parse URL-encoded params
app.use(express_1["default"].urlencoded({ extended: true }));
// Express middleware to to host static files from the current folder
app.use(express_1["default"].static(__dirname));
// Add REST API support
app.configure(express_1["default"].rest());
// Configure Socket.io real-time APIs
app.configure(socketio_1["default"]());
// Register our messages service
app.use('/messages', new MessageService());
// Express middleware with a nicer error handler
app.use(express_1["default"].errorHandler());
// Add any new real-time connection to the `everybody` channel
app.on('connection', function (connection) {
    return app.channel('everybody').join(connection);
});
// Publish all events to the `everybody` channel
app.publish(function (data) { return app.channel('everybody'); });
// Start the server
app.listen(5500).on('listening', function () {
    return console.log('Feathers server listening on localhost:5500');
});
// For good measure let's create a message
// So our API doesn't look so empty
app.service('messages').create({
    text: 'Hello world from the server'
});
