const server = require("./app")
const { connectDb } = require("./config/database")

const port = process.env.PORT || 4000

if (require.main === module) {
  connectDb().then(() => {
    server.listen(port, () => {
      console.log(`server is running on ${port}`)
    })
  }).catch((err) => {
    console.log("mongodb error", err)
    process.exit(1)
  })
}

module.exports = server
