export const getPagination = (g, size) => {
    let page = g - 1

    const limit = size ? +size : 3
    const from = page ? page * limit : 0
    const to = page ? from + size - 1 : size - 1

    return { from, to }
}

export const getPages = (amount, size) => {
    const pre = amount / size
    return amount % size == 0 ? pre : pre + 1
}
// math hehe (kill myself fr)