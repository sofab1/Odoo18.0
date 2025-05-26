/** @odoo-module */

import { _t } from "@web/core/l10n/translation";
import { registry } from "@web/core/registry";
import { Component, useState, onMounted } from "@odoo/owl";
import { useService } from "@web/core/utils/hooks";

console.log("AI Dashboard module loading...");

/**
 * AI-Powered Bijouterie Dashboard Component
 * Simple, beautiful dashboard that displays AI analytics
 */
export class AIBijouterieDashboard extends Component {
    static template = "custom_dashboard.AIBijouterieDashboard";

    setup() {
        this.orm = useService("orm");
        this.notification = useService("notification");

        // Dashboard state
        this.state = useState({
            dashboardType: this.props.action?.context?.dashboard_type || 'production',
            data: {},
            isLoading: true,
            theme: 'light'
        });

        // Load dashboard data on mount
        onMounted(() => {
            this.loadDashboardData();
        });
    }

    /**
     * Load dashboard data based on type
     */
    async loadDashboardData() {
        this.state.isLoading = true;
        try {
            const data = await this.getDashboardData(this.state.dashboardType);
            this.state.data = data;
        } catch (error) {
            console.error("Error loading dashboard data:", error);
            this.notification.add(_t("Erreur lors du chargement des données"), { type: "danger" });
        } finally {
            this.state.isLoading = false;
        }
    }

    /**
     * Get dashboard data based on type
     */
    getDashboardData(type) {
        const dashboardData = {
            production: {
                title: "🏭 AI Production Analytics",
                kpis: [
                    { label: "Bijoux produits aujourd'hui", value: "127", trend: "+12%", color: "success" },
                    { label: "Efficacité IA prédite", value: "89.5%", trend: "+3%", color: "info" },
                    { label: "Prévision demain", value: "134 bijoux", trend: "stable", color: "primary" }
                ],
                insights: [
                    "Optimiser poste polissage (+15% efficacité)",
                    "Augmenter stock or 18k (rupture prévue)",
                    "Former équipe sertissage (qualité ↗)"
                ],
                predictions: {
                    "Risque de retard": "12%",
                    "Qualité prévue": "97.8%",
                    "Maintenance suggérée": "Dans 7 jours"
                }
            },
            quality: {
                title: "🎯 AI Quality Control",
                kpis: [
                    { label: "Taux de conformité", value: "97.8%", trend: "+0.5%", color: "success" },
                    { label: "Défauts détectés", value: "2.2%", trend: "-0.3%", color: "warning" },
                    { label: "Score qualité IA", value: "9.2/10", trend: "+0.1", color: "info" }
                ],
                insights: [
                    "Corrélation matière première: 89%",
                    "Meilleure performance: Équipe A",
                    "Optimisation suggérée: +3% qualité"
                ],
                predictions: {
                    "Risque défauts demain": "1.8%",
                    "Impact température": "Moyen",
                    "Recommandation IA": "Surveiller humidité"
                }
            },
            inventory: {
                title: "📦 AI Stock Optimizer",
                kpis: [
                    { label: "Or 18k (grammes)", value: "1,250", trend: "stable", color: "warning" },
                    { label: "Argent 925 (grammes)", value: "3,400", trend: "+200", color: "success" },
                    { label: "Diamants (pièces)", value: "156", trend: "-12", color: "danger" }
                ],
                insights: [
                    "Rupture or 18k prévue: 12 jours",
                    "Demande diamants: +15% (Noël)",
                    "Rotation optimale: -8% coûts"
                ],
                predictions: {
                    "Économies possibles": "€3,200",
                    "Réapprovisionnement": "5 articles",
                    "Niveau optimal": "89%"
                }
            },
            predictive: {
                title: "🔮 AI Predictive Analytics",
                kpis: [
                    { label: "Production prévue (7j)", value: "890 bijoux", trend: "+5%", color: "success" },
                    { label: "Chiffre d'affaires", value: "€125,000", trend: "+8%", color: "info" },
                    { label: "Confiance IA", value: "87%", trend: "stable", color: "primary" }
                ],
                insights: [
                    "Nouveau marché: Bijoux personnalisés (+25%)",
                    "Optimisation énergétique: -12% coûts",
                    "Formation IA équipe: +18% efficacité"
                ],
                predictions: {
                    "Action prioritaire": "Maintenance préventive",
                    "Investissement suggéré": "€15,000",
                    "ROI estimé": "23%"
                }
            },
            voice: {
                title: "🗣️ AI Voice Commands",
                kpis: [
                    { label: "Commandes disponibles", value: "8", trend: "stable", color: "info" },
                    { label: "Précision reconnaissance", value: "94%", trend: "+2%", color: "success" },
                    { label: "Temps de réponse", value: "0.8s", trend: "-0.1s", color: "primary" }
                ],
                insights: [
                    "Dites 'Afficher production' pour voir la production",
                    "Dites 'Afficher stock' pour voir l'inventaire",
                    "Dites 'Mode sombre' pour changer le thème"
                ],
                predictions: {
                    "Commandes populaires": "Afficher production",
                    "Amélioration suggérée": "Ajouter plus de langues",
                    "Statut": "Actif"
                }
            }
        };

        return dashboardData[type] || dashboardData.production;
    }

    /**
     * Toggle theme
     */
    toggleTheme() {
        this.state.theme = this.state.theme === 'light' ? 'dark' : 'light';
        document.body.classList.toggle('theme-dark');
    }

    /**
     * Refresh dashboard data
     */
    async refreshData() {
        await this.loadDashboardData();
        this.notification.add(_t("Données actualisées"), { type: "success" });
    }
}

// Register the AI dashboard component - DISABLED to avoid conflicts with URL actions
// console.log("Registering ai_bijouterie_dashboard action...");
// registry.category("actions").add("ai_bijouterie_dashboard", AIBijouterieDashboard);
// console.log("AI Dashboard action registered successfully!");
