import {text} from "stream/consumers";


const functions = {
    upperCase: (text:string) => text.toUpperCase()
}
export const replacer = ({ data, content }: { data: {}; content: string }) => {
    try {
        return content.replace(/[{][a-zA-z.0-9()]+[}]/gm, (match) => {
            let key = match.replace(/[{}]/g, "");
            const rawValue = key

            if (key.includes("(") && key.includes(")")) {
                key = key.replace(/[a-zA-z.0-9]+[(]/g, "");
                key = key.replace(/[)]/g, "");
            }

            let result = key.split(".").reduce((o: any, i, index, array) => {
                if (index === 0) {
                    try {
                        if (array.length === 1 && !data[i as keyof typeof data][0])
                            return match;
                        o[i] = data[i as keyof typeof data] || match;
                    } catch (err) {
                        return match;
                    }
                } else {
                    if (o[i] && !o[0]) {
                        o[i] = o[i];
                    } else {
                        return match;
                    }
                }
                if (!o[0]) {
                    return o[i];
                }
            }, []);

            // functions

            Object.keys(functions).forEach((func) => {
                if (rawValue.startsWith(func)) {
                    console.log(rawValue)
                    result = functions[func as keyof typeof functions](result)
                }
            })

            return result

        });
    }
    catch (err) {
        return content
    }
}
