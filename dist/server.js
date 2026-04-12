"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const port = 3002;
app_1.app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
