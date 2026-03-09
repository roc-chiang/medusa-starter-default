import { Resend } from "resend";
import * as fs from "fs";
import * as path from "path";
import { sodiumTemplate } from "../src/modules/resend/templates/order-confirmation-sodium";
import { pardproTemplate } from "../src/modules/resend/templates/order-confirmation-pardpro";
import { shipmentSodiumTemplate } from "../src/modules/resend/templates/shipment-confirmation-sodium";
import { shipmentPardproTemplate } from "../src/modules/resend/templates/shipment-confirmation-pardpro";

/**
 * 模擬 Medusa v2 BigNumber 對象
 */
const createBigNumber = (val: number | string) => ({
    value: String(val),
    precision: 20,
    toNumber: () => Number(val)
});

const TEST_EMAIL = "gujian8@gmail.com";
const RESEND_API_KEY = process.env.RESEND_API_KEY;

/**
 * 模擬訂單數據 (CAD)
 */
const mockOrderCAD = {
    display_id: 1001,
    id: "order_01",
    created_at: new Date().toISOString(),
    email: TEST_EMAIL,
    currency_code: "cad",
    item_subtotal: createBigNumber(386),
    shipping_subtotal: createBigNumber(20),
    tax_total: createBigNumber(48.72),
    total: createBigNumber(454.72),
    subtotal: createBigNumber(406),
    shipping_total: createBigNumber(20),
    summary: {
        subtotal: createBigNumber(406),
        shipping_total: createBigNumber(20),
        tax_total: createBigNumber(48.72),
        total: createBigNumber(454.72),
        current_order_total: createBigNumber(454.72),
    },
    items: [
        {
            title: "Sodium-ion Flashlight",
            quantity: 1,
            unit_price: createBigNumber(372),
            variant_id: "variant_01KK5KYABC" // 3-pack
        }
    ],
    shipping_address: {
        first_name: "peng",
        last_name: "jiang",
        address_1: "870 Rivderside Dr",
        city: "port Coquitlam",
        province: "ca-bc",
        postal_code: "V3B 7T3",
        country_code: "ca"
    }
};

/**
 * 模擬訂單數據 (USD)
 */
const mockOrderUSD = { ...mockOrderCAD, currency_code: "usd" };

/**
 * 驗證欄位完整性
 */
function validateFields(order: any, type: 'order' | 'shipment') {
    const common = ["id", "display_id", "email", "currency_code", "shipping_address"];
    const orderFields = [...common, "item_subtotal", "shipping_subtotal", "tax_total", "total", "items"];
    const fields = type === 'order' ? orderFields : common;

    fields.forEach(f => {
        if (order[f] === undefined) throw new Error(`[VALIDATION FAILED] Missing field: ${f}`);
    });
}

async function runTests() {
    console.log("🚀 Starting Email Template Tests...");

    const outputDir = path.join(__dirname, "../test-output");
    if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);

    const testCases = [
        {
            name: "order-sodium",
            html: sodiumTemplate(mockOrderCAD),
            subject: "Order Confirmation - Sodium (CAD)",
            brand: "sodium"
        },
        {
            name: "order-pardpro",
            html: pardproTemplate(mockOrderUSD),
            subject: "Order Confirmation - PardPro (USD)",
            brand: "pardpro"
        },
        {
            name: "shipment-sodium",
            html: shipmentSodiumTemplate(mockOrderCAD, "CAD-TRACK-123"),
            subject: "Shipment Notification - Sodium",
            brand: "sodium"
        },
        {
            name: "shipment-pardpro",
            html: shipmentPardproTemplate(mockOrderUSD, "USD-TRACK-456"),
            subject: "Shipment Notification - PardPro",
            brand: "pardpro"
        }
    ];

    // 1. 生成 HTML 與 驗證
    for (const test of testCases) {
        validateFields(mockOrderCAD, test.name.includes('order') ? 'order' : 'shipment');
        const filePath = path.join(outputDir, `${test.name}.html`);
        fs.writeFileSync(filePath, test.html);
        console.log(`✅ Generated: ${test.name}.html`);
    }

    // 2. 發送真實郵件 (如有 API KEY)
    if (RESEND_API_KEY) {
        console.log("📧 Sending real test emails via Resend (with 1s delay)...");
        const resend = new Resend(RESEND_API_KEY);
        const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

        for (const test of testCases) {
            // 避免觸發 Resend 免費版的頻率限制 (2 req/sec)
            await sleep(1000);

            const { data, error } = await resend.emails.send({
                from: test.brand === 'sodium' ? "Sodium <info@pardpro.ca>" : "Pardpro <info@pardpro.ca>",
                to: TEST_EMAIL,
                subject: `[TEST] ${test.subject}`,
                html: test.html
            });

            if (error) {
                console.error(`❌ Failed to send ${test.name}:`, error.message);
            } else {
                console.log(`✅ Sent ${test.name} (ID: ${data?.id})`);
            }
        }
    } else {
        console.log("ℹ️ Skipping real email sending (RESEND_API_KEY not set)");
    }

    console.log("\n✨ All tests completed. Check test-output/ for HTML files.");
}

runTests().catch(console.error);
