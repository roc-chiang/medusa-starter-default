import { shipmentSodiumTemplate } from "./src/modules/resend/templates/shipment-confirmation-sodium"
import { shipmentPardproTemplate } from "./src/modules/resend/templates/shipment-confirmation-pardpro"
import * as fs from "fs"

const mockOrder = {
    display_id: 1001,
    id: "order_01",
    currency_code: "cad",
    shipping_address: {
        first_name: "peng",
        last_name: "jiang",
        address_1: "870 Rivderside Dr",
        city: "port Coquitlam",
        province: "ca-bc",
        postal_code: "V3B 7T3",
        country_code: "ca"
    }
}

const trackingNumber = "ABC123456789"
const shippingCompany = "Canada Post"

const htmlSodium = shipmentSodiumTemplate(mockOrder, trackingNumber, shippingCompany)
const htmlPardpro = shipmentPardproTemplate(mockOrder, trackingNumber, shippingCompany)

fs.writeFileSync("test-shipment-sodium.html", htmlSodium)
fs.writeFileSync("test-shipment-pardpro.html", htmlPardpro)

console.log("-----------------------------------------")
console.log("✅ Shipment Test Files Generated:")
console.log("1. test-shipment-sodium.html")
console.log("2. test-shipment-pardpro.html")
console.log("-----------------------------------------")
