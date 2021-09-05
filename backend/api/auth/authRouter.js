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
var router = require("express").Router();
var userModel = require("../users/users-model");
var bcryptjs = require("bcryptjs"); //bcript do the salting
var checkPayloadShape = function (req, res, next) {
    if (!req.body.username || !req.body.password) {
        res.status(401).json({ message: "username and password required" });
    }
    else {
        next();
    }
};
var userMustNotExist = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var users;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, userModel.findBy({ username: req.body.username })];
            case 1:
                users = _a.sent();
                if (users.length !== 0) {
                    res.status(400).json({ message: "user already exists" });
                }
                else {
                    next();
                }
                return [2 /*return*/];
        }
    });
}); };
var userMustExist = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var users;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, userModel.findBy({ username: req.body.username })];
            case 1:
                users = _a.sent();
                if (users.length === 0) {
                    res.status(404).json({ message: "user not found" });
                }
                else {
                    req.user = users[0];
                    next();
                }
                return [2 /*return*/];
        }
    });
}); };
router.post("/register", checkPayloadShape, userMustNotExist, function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, username, password, user, err_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                req.body.password = bcryptjs.hashSync(req.body.password, 14); //run 2^14 times
                _a = req.body, username = _a.username, password = _a.password;
                return [4 /*yield*/, userModel.add({ username: username, password: password })];
            case 1:
                user = _b.sent();
                res.status(201).json(user);
                return [3 /*break*/, 3];
            case 2:
                err_1 = _b.sent();
                next(err_1);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.post("/login", checkPayloadShape, userMustExist, function (req, res, next) {
    try {
        if (bcryptjs.compareSync(req.body.password, req.user.password)) {
            req.session.user = req.user;
            res.status(200).json({ message: "login successful" });
        }
        else {
            res.status(403).json({ message: "invalid credentials" });
        }
    }
    catch (err) {
        next(err);
    }
});
router.get("/logout", function (req, res, next) {
    if (req.session) {
        req.session.destroy(function (err) {
            if (err) {
                res.json("cant log out");
            }
            else {
                res.json("you are logged out");
            }
        });
    }
    else {
        res.json("no session found");
    }
});
module.exports = router;
module.exports = {};
