import { Price_Description } from '../models/bookingModel.js'

export const priceDescription = async (req, res) => {
    try {
        console.log('request: ', req.body)
        const add_payload = req.body
        const insert_resp = await Price_Description(add_payload)
        if (insert_resp) {
            return res.status(201).json(insert_resp)
        }
        return res.status(400).json({ message: 'Not able to insert record', status: false })
    } catch (error) {
        console.log('Error in Bookings Controller: ' + error.message)
        return res.status(500).json({ message: 'Server Error' })
    }
}

