require("dotenv").config();
import server = require("./api/server");
const port = process.env.PORT || "1234";


server.listen(port,()=>console.log(`server is listening at port ${port}`));