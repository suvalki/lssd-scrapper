

export const routerParser = (url: string, protectedRoutes: string[]) =>
    protectedRoutes.map((path) => {
        return {match: !!new RegExp(path.replace("!", "")).exec(url), deny: !path.startsWith("!")}
    }).filter((path, index, array) => {
        if (path.match && path.deny && !array.some((path) => path.match && !path.deny)) return true
        else if (path.match && !path.deny) return true
    })


export const hasProtectedRouter = (url: string, protectedRoutes: string[]) => protectedRoutes.some(path => new RegExp(path).exec(url))