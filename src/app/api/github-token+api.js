export async function POST(request) {
    try {
        const { code, redirectUri } = await request.json();

        if (!code || !redirectUri) {
            return Response.json(
                { error: "Missing authorization code or redirect URI." },
                { status: 400 }
            );
        }

        const clientId = process.env.GITHUB_CLIENT_ID;
        const clientSecret = process.env.GITHUB_CLIENT_SECRET;

        if (!clientId || !clientSecret) {
            return Response.json(
                { error: "GitHub server configuration is missing." },
                { status: 500 }
            );
        }

        const response = await fetch(
            "https://github.com/login/oauth/access_token",
            {
                method: "POST",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    client_id: clientId,
                    client_secret: clientSecret,
                    code,
                    redirect_uri: redirectUri
                })
            }
        );

        const data = await response.json();

        if (!response.ok || !data.access_token) {
            return Response.json(
                {
                    error:
                        data.error_description ||
                        "GitHub token exchange failed."
                },
                { status: 400 }
            );
        }

        return Response.json({
            accessToken: data.access_token
        });

    } catch (error) {
        console.error("GitHub token error:", error);

        return Response.json(
            { error: "GitHub authentication failed." },
            { status: 500 }
        );
    }
}