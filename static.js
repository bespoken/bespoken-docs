const express = require('express')

app = express()
app.use(express.static('.vuepress/dist'))
app.listen(3000)