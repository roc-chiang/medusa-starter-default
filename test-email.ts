import { pardproTemplate } from "./src/modules/resend/templates/order-confirmation-pardpro"
import { sodiumTemplate } from "./src/modules/resend/templates/order-confirmation-sodium"
import * as fs from "fs"

/**
 * 完整測試腳本：驗證 Medusa v2 根欄位金額與精確 Variant 數量映射
 */
const mockOrder = {
    display_id: 1001,
    id: "order_01",
    created_at: new Date().toISOString(),
    email: "gujian8@gmail.com",
    // Medusa v2 根欄位金額
    subtotal: 396,
    shipping_total: 20,
    tax_total: 60,
    total: 476,
    items: [
        {
            title: "Sodium-ion Flashlight (4-pack)",
            quantity: 1,
            unit_price: 119,
            variant_id: "variant_01KK5M0ABC" // 應被判定為 4 包，總價 476
        },
        {
            title: "Backup Battery Pack",
            quantity: 2,
            unit_price: 59,
            variant_id: "variant_battery_01" // 應顯示數量 2，且總價 118
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

// 生成 HTML 並保存
const htmlSodium = sodiumTemplate(mockOrder)
const htmlPardpro = pardproTemplate(mockOrder)

fs.writeFileSync("test-email-sodium.html", htmlSodium)
fs.writeFileSync("test-email-pardpro.html", htmlPardpro)

console.log("-----------------------------------------")
console.log("✅ 測試文件已生成：")
console.log("1. test-email-sodium.html (Sodium 模板)")
console.log("2. test-email-pardpro.html (Pardpro 模板)")
console.log("-----------------------------------------")
console.log("預期結果：")
console.log("- Flashlight: qty 4, Total CA$476.00")
console.log("- Battery: qty 2, Total CA$118.00")
console.log("- Summary: Subtotal $396.00, Total $476.00")
console.log("-----------------------------------------")
"
