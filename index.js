const express = require('express')
const bodyParser = require('body-parser')
const CarRentalPricing = require('./rentalPrice')
const fs = require('fs')

const app = express()
const port = 3000

app.use(bodyParser.urlencoded({ extended: true }))

app.use(express.static('public'))
app.use('/pictures', express.static('images'))

const formHtml = fs.readFileSync('form.html', 'utf8')
const resultHtml = fs.readFileSync('result.html', 'utf8')
const errorHtml = fs.readFileSync('error.html', 'utf8')


const rental = new CarRentalPricing()

app.post('/', (req, res) => {
  const post = req.body

  try {
    const result = rental.price(
      new Date(post.pickupdate),
      new Date(post.dropoffdate),
      String(post.type),
      Number(post.age),
    )    
    res.send(formHtml + resultHtml.replaceAll('$0', result))
  } catch (err) {
    res.send(formHtml + errorHtml.replaceAll('ERROR', err))    
  }
})

app.get('/', (req, res) => {
  res.send(formHtml)
})

// Start the server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`)
})
