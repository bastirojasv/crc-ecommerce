const express = require('express');
const port = process.env.PORT || 3000;
const app = express();

app.use(express.static("public/dist"))

app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, '/../../public/dist/index.html'));
})

app.listen(port, function() {
  console.log(`Server is running at port ${port}`);
});
