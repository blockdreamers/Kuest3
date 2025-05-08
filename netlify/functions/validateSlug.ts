import { Handler } from "@netlify/functions";

const handler: Handler = async (event) => {
  try {
    if (event.httpMethod !== "POST") {
      return {
        statusCode: 405,
        body: JSON.stringify({ error: "Method not allowed" }),
      };
    }

    const { slug } = JSON.parse(event.body || "{}");

    if (!slug) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing slug" }),
      };
    }

    const response = await fetch(`https://pro-api.coinmarketcap.com/v1/cryptocurrency/info?slug=${slug}`, {
      headers: {
        "X-CMC_PRO_API_KEY": process.env.CMC_API_KEY!,
      },
    });

    const data = await response.json();

    if (data.status.error_code !== 0 || !data.data || Object.keys(data.data).length === 0) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: "Invalid slug" }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ valid: true }),
    };
  } catch (err) {
    console.error("🔴 validateSlug Error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Internal server error" }),
    };
  }
};

export { handler };
