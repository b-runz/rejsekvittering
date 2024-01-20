interface TokenValue{
    token: string;
}

async function fetchToken() : Promise<TokenValue> {
    const rejseplanLoginPage = await fetch('https://selvbetjening.rejsekort.dk/CWS/Home/UserNameLogin')
    const regexPattern = /<input[^>]*name="__RequestVerificationToken"[^>]*value="([^"]*)"[^>]*>/;
    const extractedToken = (await rejseplanLoginPage.text()).match(regexPattern)?.[1] || ""


    return {token: extractedToken}
}

export default async function LoginBox() {
    const token = await fetchToken()
    return(
        <div>
            <p>{token.token}</p>
        </div>
    );
    
}