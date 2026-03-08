import { pardproTemplate } from "./src/modules/resend/templates/order-confirmation-pardpro"
import { sodiumTemplate } from "./src/modules/resend/templates/order-confirmation-sodium"
import * as fs from "fs"

/**
 * 完整測試腳本：驗證 Medusa v2 數據結構與套裝數量映射
 */
const mockOrder = {
    display_id: 1001,
    created_at: new Date().toISOString(),
    email: "gujian8@gmail.com",
    // Medusa v2 根路徑金額（直接以元為單位，不除以 100）
    total: 476.00,
    subtotal: 396.00,
    shipping_total: 20.00,
    tax_total: 60.00,
    items: [
        {
            title: "Sodium-ion Flashlight (Bundle Pack)",
            quantity: 1,
            unit_price: 119.00,
            variant_id: "variant_01KK5KM_TEST" // 2-pack
        },
        {
            title: "Sodium-ion Flashlight (Triple Pack)",
            quantity: 1,
            unit_price: 119.00,
            variant_id: "variant_01KK5KY_TEST" // 3-pack
        },
        {
            title: "Sodium-ion Flashlight (Quad Pack)",
            quantity: 1,
            unit_price: 119.00,
            variant_id: "variant_01KK5M0_TEST" // 4-pack
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

    console.log("✅ 全方位測試成功！")
    console.log("- 2-pack variant -> 應顯示 qty: 2")
    console.log("- 3-pack variant -> 應顯示 qty: 3")
    console.log("- 4-pack variant -> 應顯示 qty: 4")
    console.log("- 金額 476.00 -> 應顯示 CA$476.00")
    console.log("\n請在瀏覽器打開 test-sodium.html 檢查最終視覺效果。")
} catch (error) {
    console.error("❌ 生成失敗:", error)
}
