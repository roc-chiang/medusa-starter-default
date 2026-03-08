import { pardproTemplate } from "./src/modules/resend/templates/order-confirmation-pardpro"
import { sodiumTemplate } from "./src/modules/resend/templates/order-confirmation-sodium"
import * as fs from "fs"

/**
 * 測試資料：模擬 Medusa v2 真實訂單數據
 * 1. 金額：直接從 root 讀取 (total, subtotal, etc.)，不除以 100
 * 2. 數量：根據 variant_id 映射
 */
const mockOrder = {
    display_id: 1001,
    created_at: new Date().toISOString(),
    email: "gujian8@gmail.com",
    // Medusa v2 根路徑金額 (直接以「元」為單位)
    total: 476.00,
    subtotal: 396.00,
    shipping_total: 20.00,
    tax_total: 60.00,
    items: [
        {
            title: "Sodium-ion Flashlight (Bundle)",
            quantity: 1, // 後端原始數量為 1
            unit_price: 119.00,
            variant_id: "variant_01KK5M0ABC" // 測試 4-pack 映射
        }
    ],
    shipping_address: {
        first_name: "peng",
        last_name: "jiang",
        address_1: "870 Rivderside Dr",
        city: "port Coquitlam",
        province: "ca-bc",
        postal_code: "V3B 7T3",
        phone: "778-861-6918"
    }
}

try {
    const sodiumHtml = sodiumTemplate(mockOrder)
    const pardproHtml = pardproTemplate(mockOrder)

    fs.writeFileSync("test-sodium.html", sodiumHtml)
    fs.writeFileSync("test-pardpro.html", pardproHtml)

    console.log("✅ 測試 HTML 已生成！")
    console.log("- Sodium: test-sodium.html")
    console.log("- Pardpro: test-pardpro.html")
    console.log("\n驗證清單：")
    console.log("1. 金額是否顯示為 CA$476.00 (而非 4.76)？")
    console.log("2. 數量是否顯示為 qty: 4 (根據 variant_id 映射)？")
    console.log("3. 佈局是否在瀏覽器中顯示美觀且穩定？")
} catch (error) {
    console.error("❌ 生成失敗:", error)
}
