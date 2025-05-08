import supabase from "./supabase";

// 프로젝트 중복 체크 (project_info 테이블에 이미 존재하는 slug인지 확인)
export const isSlugDuplicate = async (slug: string): Promise<boolean> => {
  const { data, error } = await supabase
    .from("project_info")
    .select("slug")
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    console.error("❌ Supabase 중복 체크 오류:", error.message);
    return false;
  }

  return !!data;
};

// 실제 제출 처리 (listing_applications 테이블에 저장)
export const submitToServer = async (form: any, token: string) => {
  if (!form.slug) {
    throw new Error("Slug is missing.");
  }

  const { data, error } = await supabase.from("listing_applications").insert([
    {
      name: form.name,
      name_ko: form.nameKo,
      slug: form.slug,
      website: form.website,
      twitter: form.twitter,
      discord: form.discord,
      telegram: form.telegram,
      email: form.email,
      contact_email: form.contactEmail,
      chart_url: form.chartUrl,
      whitepaper: form.whitepaper,
      description: form.description,
      status: "pending", // ✅ 기본 상태값 추가
    },
  ]);

  if (error) {
    console.error("❌ Supabase Insert Error:", error.message);
    throw new Error("DB 저장에 실패했습니다.");
  }

  return data;
};
