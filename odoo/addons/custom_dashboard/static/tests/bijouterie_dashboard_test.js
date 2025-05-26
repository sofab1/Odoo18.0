/** @odoo-module */

import { describe, expect, test } from "@odoo/hoot";
import { BijourterieHelpers } from "../src/assets/bijouterie_helpers";

describe("Bijouterie Dashboard", () => {
    test("formatProductionData should correctly format production data", () => {
        const testData = [
            { state: 'done' },
            { state: 'confirmed' },
            { state: 'progress' },
            { state: 'done' },
        ];
        
        const result = BijourterieHelpers.formatProductionData(testData);
        
        expect(result.total).toBe(4);
        expect(result.completed).toBe(2);
        expect(result.in_progress).toBe(2);
    });

    test("calculateQualityMetrics should calculate correct percentages", () => {
        const qualityData = { passed: 95, failed: 5 };
        const result = BijourterieHelpers.calculateQualityMetrics(qualityData);
        
        expect(result.compliance_rate).toBe("95.0");
        expect(result.rejection_rate).toBe("5.0");
    });

    test("getJewelryTypes should return all jewelry categories", () => {
        const types = BijourterieHelpers.getJewelryTypes();
        
        expect(types.length).toBe(5);
        expect(types[0].key).toBe('ring');
        expect(types[1].key).toBe('necklace');
    });

    test("formatMaterialStock should format material data correctly", () => {
        const materials = [
            { 
                name: 'Gold', 
                qty_available: 100, 
                reorder_level: 50,
                uom_id: [1, 'grams']
            },
            { 
                name: 'Silver', 
                qty_available: 25, 
                reorder_level: 50,
                uom_id: [2, 'grams']
            }
        ];
        
        const result = BijourterieHelpers.formatMaterialStock(materials);
        
        expect(result[0].status).toBe('ok');
        expect(result[1].status).toBe('low');
        expect(result[0].unit).toBe('grams');
    });
});
