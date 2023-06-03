const razorpay = require('razorpay');
var instance = new razorpay({
    key_id:process.env.key_id,
    key_secret:process.env.key_secret,
});

exports.createOrder = async(req, res, next) => {
    try {
        const amount = req.body.amount;
        
        var options = {
            amount: amount,
            currency:'INR'
        }

        instance.orders.create(options, function(err, order) {
            console.log("ORDER: " + order);

            if(err) {
                return res.status(400).json({ message: err.message, status: 'error' });
            }

            return res.status(201).json({status: 'success', message: 'Order Created.', order});
        });
    } catch (error) {
        return res.status(400).json({message: error.message, status:'error'});
    }
}

