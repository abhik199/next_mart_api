const app = require("./app");
const PORT = process.env.PORT || 3200;

app.listen(PORT, () => console.log(`Server is On Port ${PORT}`));
