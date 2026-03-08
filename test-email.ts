import { pardproTemplate } from "./src/modules/resend/templates/order-confirmation-pardpro"
import { sodiumTemplate } from "./src/modules/resend/templates/order-confirmation-sodium"
import * as fs from "fs"

/**
 * 模擬 Medusa v2 BigNumber 對象
 */
const createBigNumber = (val: number | string) => ({
    value: String(val),
    precision: 20,
    toNumber: () => Number(val)
})

/**
 * 完整測試腳本：模擬 Medusa v2 真實數據結構（含 BigNumber 與 Summary）
 */
const mockOrder = {
    display_id: 1001,
    id: "order_01",
    created_at: new Date().toISOString(),
    email: "gujian8@gmail.com",
    // Medusa v2 根欄位（有時為 0，有時為對象）
    subtotal: createBigNumber(396),
    shipping_total: createBigNumber(20),
    tax_total: createBigNumber(60),
    total: createBigNumber(476),
    // Medusa v2 Summary 關聯
    summary: {
        subtotal: createBigNumber(396),
        shipping_total: createBigNumber(20),
        tax_total: createBigNumber(60),
        total: createBigNumber(476),
        current_order_total: createBigNumber(476),
    },
    items: [
        {
            title: "Sodium-ion Flashlight (4-pack)",
            quantity: 1,
            unit_price: createBigNumber(119),
            variant_id: "variant_01KK5M0ABC"
        },
        {
            title: "Backup Battery Pack",
            quantity: 2,
            unit_price: createBigNumber(59),
            variant_id: "variant_battery_01"
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

fs.writeFileSync("test-sodium.html", htmlSodium)
fs.writeFileSync("test-pardpro.html", htmlPardpro)

console.log("-----------------------------------------")
console.log("✅ 測試文件已重新生成（含 BigNumber 模擬）：")
console.log("1. test-sodium.html")
console.log("2. test-pardpro.html")
console.log("-----------------------------------------")
console.log("請在瀏覽器刷新查看效果。")
