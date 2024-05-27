import axios from "axios"

export default async function () {
    return useCookie<{
        name: string,
        id: string,
        secret: string,
    }|null>("user")
}
