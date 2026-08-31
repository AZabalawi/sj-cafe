"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { CheckCircleIcon } from "@/components/icons";
import { useCart } from "@/lib/cart";
import { useLanguage } from "@/lib/i18n";
import { business } from "@/data/business";
import { filsToAedLabel } from "@/lib/money";
import { isValidUaeMobile, isNonEmpty } from "@/lib/validation";
import { submitOrder, type OrderType } from "@/lib/orders";

type FormErrors = Partial<Record<"name" | "mobile" | "carModel" | "carPlate", string>>;

export default function CheckoutPage() {
  const { lines, subtotalFils, totalFils, clearCart } = useCart();
  const { language, t } = useLanguage();
  const router = useRouter();

  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [orderType, setOrderType] = useState<OrderType>("pickup");
  const [carModel, setCarModel] = useState("");
  const [carPlate, setCarPlate] = useState("");
  const [note, setNote] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const submittedRef = useRef(false);

  useEffect(() => {
    if (lines.length === 0 && !submittedRef.current) {
      router.replace("/cart");
    }
  }, [lines.length, router]);

  if (lines.length === 0) return null;

  const validate = (): boolean => {
    const next: FormErrors = {};
    if (!isNonEmpty(name)) next.name = t("errorNameRequired");
    if (!isValidUaeMobile(mobile)) next.mobile = t("errorPhoneInvalid");
    if (orderType === "car-pickup") {
      if (!isNonEmpty(carModel)) next.carModel = t("errorCarDetailsRequired");
      if (!isNonEmpty(carPlate)) next.carPlate = t("errorCarDetailsRequired");
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    const order = await submitOrder({
      customer: { name: name.trim(), mobile: mobile.trim() },
      orderType,
      car: orderType === "car-pickup" ? { model: carModel.trim(), plate: carPlate.trim() } : undefined,
      note: note.trim() || undefined,
      items: lines,
      subtotalFils,
      totalFils,
    });
    submittedRef.current = true;
    clearCart();
    router.push(`/order/${order.reference}`);
  };

  const inputClass =
    "w-full rounded-2xl border border-brand-line bg-white px-4 py-3.5 text-sm text-brand-ink outline-none transition-shadow focus:border-brand-blue/40 focus:ring-4 focus:ring-brand-blue/10";
  const errorClass = "mt-1 text-xs font-medium text-red-600";

  return (
    <>
      <SiteHeader />
      <main className="flex-1 pb-10">
        <div className="mx-auto max-w-2xl px-4 pt-8 sm:px-6">
          <h1 className="mb-6 font-heading text-2xl font-bold text-brand-ink">{t("checkoutTitle")}</h1>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-semibold text-brand-ink">{t("customerName")}</span>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t("namePlaceholder")}
                className={inputClass}
              />
              {errors.name && <span className={errorClass}>{errors.name}</span>}
            </label>

            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-semibold text-brand-ink">{t("mobileNumber")}</span>
              <input
                type="tel"
                dir="ltr"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                placeholder={t("mobilePlaceholder")}
                className={`${inputClass} text-start`}
              />
              {errors.mobile && <span className={errorClass}>{errors.mobile}</span>}
            </label>

            <div className="flex flex-col gap-1.5">
              <span className="text-sm font-semibold text-brand-ink">{t("orderType")}</span>
              <div className="flex gap-2">
                {(["pickup", "car-pickup"] as const).map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setOrderType(type)}
                    className={`flex-1 rounded-2xl border px-4 py-3.5 text-sm font-semibold transition-all ${
                      orderType === type
                        ? "border-brand-navy bg-brand-navy text-white shadow-sm"
                        : "border-brand-line bg-white text-brand-ink hover:bg-brand-blue-light"
                    }`}
                  >
                    {type === "pickup" ? t("pickup") : t("carPickup")}
                  </button>
                ))}
              </div>
            </div>

            {orderType === "car-pickup" && (
              <div className="flex flex-col gap-4 rounded-2xl bg-brand-cream p-4">
                <label className="flex flex-col gap-1.5">
                  <span className="text-sm font-semibold text-brand-ink">{t("carModel")}</span>
                  <input
                    type="text"
                    value={carModel}
                    onChange={(e) => setCarModel(e.target.value)}
                    placeholder={t("carModelPlaceholder")}
                    className={inputClass}
                  />
                  {errors.carModel && <span className={errorClass}>{errors.carModel}</span>}
                </label>
                <label className="flex flex-col gap-1.5">
                  <span className="text-sm font-semibold text-brand-ink">{t("plateNumber")}</span>
                  <input
                    type="text"
                    value={carPlate}
                    onChange={(e) => setCarPlate(e.target.value)}
                    placeholder={t("plateNumberPlaceholder")}
                    className={inputClass}
                  />
                  {errors.carPlate && <span className={errorClass}>{errors.carPlate}</span>}
                </label>
              </div>
            )}

            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-semibold text-brand-ink">{t("noteOptional")}</span>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={2}
                placeholder={t("notePlaceholder")}
                className={`${inputClass} resize-none`}
              />
            </label>

            <div className="flex flex-col gap-3 rounded-3xl bg-brand-cream p-5">
              <h2 className="font-heading text-sm font-bold text-brand-ink">{t("orderSummary")}</h2>
              <ul className="flex flex-col gap-1.5 text-sm text-brand-muted">
                {lines.map((line) => (
                  <li key={line.slug} className="flex items-center justify-between gap-2">
                    <span className="truncate">
                      {line.qty}× {language === "ar" ? line.nameAr : line.nameEn}
                    </span>
                    <span className="shrink-0 font-medium text-brand-ink">
                      {filsToAedLabel(line.priceFils * line.qty)} {business.currency.label[language]}
                    </span>
                  </li>
                ))}
              </ul>
              <div className="flex items-center justify-between border-t border-brand-line/70 pt-2 text-sm text-brand-muted">
                <span>{t("subtotal")}</span>
                <span className="font-semibold text-brand-ink">
                  {filsToAedLabel(subtotalFils)} {business.currency.label[language]}
                </span>
              </div>
              <div className="flex items-center justify-between text-base font-bold text-brand-ink">
                <span>{t("total")}</span>
                <span>
                  {filsToAedLabel(totalFils)} {business.currency.label[language]}
                </span>
              </div>
              <div className="flex items-center gap-2 border-t border-brand-line/70 pt-3 text-sm font-semibold text-brand-navy">
                <CheckCircleIcon className="h-4 w-4" />
                {t("paymentMethod")}: {t("cashAtRestaurant")}
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="flex w-full items-center justify-center rounded-full bg-brand-navy px-6 py-4 text-base font-bold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 active:scale-[0.98] disabled:opacity-60"
            >
              {t("placeOrder")}
            </button>

            <Link href="/cart" className="text-center text-sm font-semibold text-brand-muted hover:text-brand-navy">
              {t("backToCart")}
            </Link>
          </form>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
