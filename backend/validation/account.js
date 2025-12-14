const zod = require('zod');

const balanceTransferSchema = zod.object({
    to: zod.string(),
    amount: zod.number()
})

module.exports = {
    balanceTransferSchema
}