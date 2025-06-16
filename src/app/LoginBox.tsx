import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { checkCookie, cookiefyString, login, stringifyCookie } from '@/lib/RejseplanRequest';

interface TokenValue {
    token: string;
}

interface UsernamePassword {
    Username: string;
    Password: string;
    RequestVerificationToken: string;
}

export default async function LoginBox() {

    async function performLogin(formData: FormData) {
        'use server'
        const username = formData.get("Username")?.toString()!
        const password = formData.get("Password")?.toString()!
        const rkCookie = await login(username, password)
        const cookieStore = await cookies()
        cookieStore.set('rklogin', await stringifyCookie(rkCookie))
        redirect('/trips')
    }

    const cookieStore = await cookies()
    if (cookieStore.has('rklogin')) {
        const cookie = await cookiefyString(cookieStore.get('rklogin')?.value!)
        if (await checkCookie(cookie)) {
            return redirect('/trips')
        }
    }
    // const token = await fetchToken()
    return (
        <div className="bg-white p-8 rounded shadow-md w-96">
            <h1 className="text-2xl font-semibold mb-6">Login</h1>
            <form action={performLogin} method="POST">
                {/* <input name="__RequestVerificationToken" type="hidden" value={token.token} /> */}
                <input id="ReturnUrl" name="ReturnUrl" type="hidden" value="" />
                <div className="mb-4">
                    <label htmlFor="username" className="block text-gray-600 text-sm font-medium mb-2">
                        Username
                    </label>
                    <input type="text" id="Username" name="Username" className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500" />
                </div>
                <div className="mb-4">
                    <label htmlFor="password" className="block text-gray-600 text-sm font-medium mb-2">
                        Password
                    </label>
                    <input type="password" id="Password" name="Password" className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500" />
                </div>
                <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:shadow-outline-blue">
                    Login
                </button>
                {/* <label>{token.token}</label> */}
            </form>
        </div>
    );

}