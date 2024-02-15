const denyFields = {
    user: ["password"],
    forumAccounts: ["password"]
}
export const sanitizer = (type: keyof typeof denyFields, data: Record<string, any>) => {
    const result = data
    for (const field of denyFields[type]) {
        delete result[field]
    }
    return result
}