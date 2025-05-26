/** @odoo-module */

import { _t } from "@web/core/l10n/translation";

/**
 * Bijouterie Dashboard Helpers
 * Utility functions for bijouterie dashboard functionality
 */

export const BijourterieHelpers = {
    /**
     * Format jewelry production data
     */
    formatProductionData(data) {
        return {
            total: data.length,
            completed: data.filter(item => item.state === 'done').length,
            in_progress: data.filter(item => ['confirmed', 'progress'].includes(item.state)).length,
        };
    },

    /**
     * Calculate jewelry quality metrics
     */
    calculateQualityMetrics(qualityData) {
        const total = qualityData.passed + qualityData.failed;
        return {
            compliance_rate: total > 0 ? (qualityData.passed / total * 100).toFixed(1) : 0,
            rejection_rate: total > 0 ? (qualityData.failed / total * 100).toFixed(1) : 0,
        };
    },

    /**
     * Get jewelry type categories
     */
    getJewelryTypes() {
        return [
            { key: 'ring', label: _t('Bagues') },
            { key: 'necklace', label: _t('Colliers') },
            { key: 'bracelet', label: _t('Bracelets') },
            { key: 'earring', label: _t('Boucles d\'oreilles') },
            { key: 'pendant', label: _t('Pendentifs') },
        ];
    },

    /**
     * Format material stock data
     */
    formatMaterialStock(materials) {
        return materials.map(material => ({
            name: material.name,
            quantity: material.qty_available,
            unit: material.uom_id?.[1] || 'units',
            status: material.qty_available > material.reorder_level ? 'ok' : 'low',
        }));
    },
};
