export const getPagination = (g, size) => {
    let page = g - 1

    const limit = size ? +size : 3
    const from = page ? page * limit : 0
    const to = page ? from + size - 1 : size - 1

    return { from, to }
}

export const getPages = (amount, size) => {
    const pre = Math.round(amount / size)
    return (amount % size == 0 ? pre : pre).toString()
}
// math hehe (kill myself fr)