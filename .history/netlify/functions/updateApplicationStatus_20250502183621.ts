import { Handler } from "@netlify/functions";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const handler: Handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const { id, status } = JSON.parse(event.body || "{}");

  if (!id || !["pending", "rejected", "registered"].includes(status)) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Invalid ID or status" }),
    };
  }

  const { error } = await supabase
    .from("listing_applications")
    .update({ status })
    .eq("id", id);

  if (error) {
    console.error("❌ 상태 업데이트 실패:", error.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "DB 업데이트 실패" }),
    };
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ success: true }),
  };
};

export { handler };
