import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata = {
  title: "特定商取引法に基づく表記 | かんたんTeX",
  description: "かんたんTeXの特定商取引法に基づく表記ページです。",
};

const ROWS = [
  { label: "販売業者",       value: <img src="/tokusho-name.png" alt="" style={{ height: '18px' }} /> },
  { label: "所在地",         value: "請求があれば遅滞なく開示します" },
  { label: "電話番号",       value: "請求があれば遅滞なく開示します" },
  { label: "メールアドレス", value: "notebizhack@gmail.com" },
  { label: "サービス名",     value: "かんたんTeX" },
  { label: "サービスURL",    value: "https://latex.viztechlab.com" },
  { label: "販売価格",       value: "Basicプラン：¥500（税込）／月" },
  { label: "支払方法",       value: "クレジットカード（Stripe経由）" },
  { label: "支払時期",       value: "申込時に課金。以降毎月自動更新" },
  { label: "サービス提供時期", value: "決済完了後、即時利用可能" },
  { label: "解約・キャンセル", value: "マイページよりいつでも解約可能。解約後は当月末まで利用可能。日割り返金は行いません" },
  { label: "返金について",   value: "サービスの性質上、原則として返金には応じておりません。ただし、システム障害等により継続的にサービスが利用できない場合はこの限りではありません" },
  { label: "動作環境",       value: "最新バージョンのChrome・Safari・Firefox・Edge" },
  { label: "料金の改定",     value: "料金を変更する場合は、30日前までにサービス内またはメールにてお知らせします" },
];

export default function Tokusho() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#FFFFFF",
        color: "#1A1A1A",
        fontFamily: "system-ui, -apple-system, sans-serif",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Header />

      <main style={{ flex: 1, maxWidth: "720px", width: "100%", margin: "0 auto", padding: "56px 40px" }}>
        <h1 style={{ fontSize: "28px", fontWeight: "700", marginBottom: "40px", color: "#1A1A1A" }}>
          特定商取引法に基づく表記
        </h1>

        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            fontSize: "15px",
            lineHeight: "1.8",
            color: "#1A1A1A",
          }}
        >
          <tbody>
            {ROWS.map(({ label, value }) => (
              <tr key={label} style={{ borderBottom: "1px solid #E5E5E5" }}>
                <th
                  style={{
                    width: "200px",
                    padding: "16px 12px 16px 0",
                    textAlign: "left",
                    fontWeight: "600",
                    verticalAlign: "top",
                    whiteSpace: "nowrap",
                    color: "#1A1A1A",
                  }}
                >
                  {label}
                </th>
                <td
                  style={{
                    padding: "16px 0 16px 12px",
                    color: "#555",
                    verticalAlign: "top",
                  }}
                >
                  {value}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <p style={{ fontSize: "13px", color: "#aaa", marginTop: "48px" }}>制定日：2026年5月3日</p>
      </main>

      <Footer />
    </div>
  );
}
