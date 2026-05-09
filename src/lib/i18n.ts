export {
  type Locale,
  localeLabels,
  locales,
} from "@/infrastructure/i18n/config";
export { routing } from "@/infrastructure/i18n/routing";

export async function loadMessages(locale: string) {
  return (await import(`@/infrastructure/i18n/messages/${locale}.json`))
    .default;
}
