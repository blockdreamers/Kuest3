import { useEffect, useState } from "react";
import styles from "@/pages/ListingApplication.module.css";
import { extractSlug, validateSlugWithCMC } from "@/lib/validateSlug";
import { isSlugDuplicate, submitToServer } from "@/lib/submitToServer";
import { toast } from "react-hot-toast";

const ListingApplication = () => {
  const [form, setForm] = useState({
    name: "",
    nameKo: "",
    slug: "",
    website: "",
    twitter: "",
    discord: "",
    telegram: "",
    email: "",
    contactEmail: "",
    chartUrl: "",
    whitepaper: "",
    description: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const siteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const rawSlug = form.slug;
      const extractedSlug = extractSlug(rawSlug);
      console.log("🔍 Extracted slug:", extractedSlug);

      if (!extractedSlug) {
        toast.error("❗ 유효하지 않은 CoinMarketCap URL입니다.");
        setIsSubmitting(false);
        return;
      }

      form.slug = extractedSlug;

      const isValid = await validateSlugWithCMC(extractedSlug);
      console.log("✅ CMC slug 유효성 검사:", isValid);
      if (!isValid) {
        toast.error("❌ 존재하지 않는 프로젝트입니다.");
        setIsSubmitting(false);
        return;
      }

      const isDuplicate = await isSlugDuplicate(extractedSlug);
      console.log("⚠️ 중복 검사:", isDuplicate);
      if (isDuplicate) {
        toast.error("⚠️ 이미 등록된 프로젝트입니다.");
        setIsSubmitting(false);
        return;
      }

      const token = (window as any).grecaptcha?.getResponse();
      if (!token) {
        toast.error("🛡️ reCAPTCHA를 완료해주세요.");
        setIsSubmitting(false);
        return;
      }

      console.log("📨 제출 데이터:", form);
      await submitToServer(form, token);

      toast.success("🎉 지원이 완료되었습니다!");
      (window as any).grecaptcha?.reset();
      setForm({
        name: "",
        nameKo: "",
        slug: "",
        website: "",
        twitter: "",
        discord: "",
        telegram: "",
        email: "",
        contactEmail: "",
        chartUrl: "",
        whitepaper: "",
        description: "",
      });
    } catch (err) {
      console.error("❌ 제출 오류:", err);
      toast.error("서버 오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if ((window as any).grecaptcha && siteKey) {
        (window as any).grecaptcha.render("recaptcha-container", {
          sitekey: siteKey,
        });
        clearInterval(interval);
      }
    }, 500);
    return () => clearInterval(interval);
  }, [siteKey]);

  return (
    <div className={styles.wrapper}>
      <h1 className={styles.title}>📄 Kuest3 리스팅 신청</h1>

      <div className={styles.container}>
        <h2 className={styles.heading}>🚀 Kuest3와 함께 해주세요</h2>
        <form onSubmit={handleSubmit} className={styles.form}>
          {[
            { label: "프로젝트 영문명", name: "name", required: true },
            { label: "프로젝트 한글명", name: "nameKo", required: true },
            { label: "코인마켓캡 URL", name: "slug", required: true },
            { label: "공식 웹사이트", name: "website" },
            { label: "공식 트위터", name: "twitter" },
            { label: "공식 디스코드", name: "discord" },
            { label: "연락 텔레그램 핸들", name: "telegram" },
            { label: "공식 이메일", name: "email" },
            { label: "연락용 이메일", name: "contactEmail" },
            { label: "TradingView 차트 URL", name: "chartUrl" },
            { label: "백서 (Whitepaper) URL", name: "whitepaper" },
          ].map(({ label, name, required }) => (
            <div key={name} className={styles.formGroup}>
              <label className={styles.label}>
                {label}
                {required && " *"}
              </label>
              <input
                className={styles.input}
                name={name}
                value={form[name as keyof typeof form]}
                onChange={handleChange}
                required={required}
              />
            </div>
          ))}

          <div className={styles.formGroup}>
            <label className={styles.label}>간단한 설명</label>
            <textarea
              className={styles.textarea}
              name="description"
              rows={4}
              value={form.description}
              onChange={handleChange}
            />
          </div>

          <div className={styles.formGroup}>
            <div id="recaptcha-container" className={styles.recaptchaBox} />
          </div>

          <button type="submit" className={styles.submitButton} disabled={isSubmitting}>
            ✅ {isSubmitting ? "제출 중..." : "제출하기"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ListingApplication;
