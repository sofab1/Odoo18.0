/** @odoo-module **/

import { Component, useState, onMounted, onWillUnmount } from "@odoo/owl";
import { registry } from "@web/core/registry";
import { useService } from "@web/core/utils/hooks";

export class AIBijouterieDashboard extends Component {
    static template = "custom_dashboard.AIBijouterieDashboardTemplate";

    setup() {
        this.notification = useService("notification");
        this.rpc = useService("rpc");
        this.state = useState({
            isLoading: true,
            dashboardData: null,
            lastUpdate: new Date().toLocaleTimeString(),
            autoRefresh: false,
            voiceEnabled: false
        });

        onMounted(() => {
            this.loadDashboardData();
            this.initializeAnimations();
        });

        onWillUnmount(() => {
            if (this.refreshInterval) {
                clearInterval(this.refreshInterval);
            }
        });
    }

    async loadDashboardData() {
        try {
            this.state.isLoading = true;

            // Simulate loading delay for better UX
            await new Promise(resolve => setTimeout(resolve, 1500));

            const data = await this.rpc("/custom_dashboard/get_ai_data", {
                dashboard_type: this.props.context?.dashboard_type || 'production'
            });

            this.state.dashboardData = data;
            this.state.lastUpdate = new Date().toLocaleTimeString();
            this.state.isLoading = false;

            this.notification.add("🤖 Dashboard IA chargé avec succès", {
                type: "success",
                sticky: false
            });
        } catch (error) {
            console.error("Erreur chargement dashboard:", error);
            this.state.isLoading = false;

            // Fallback data
            this.state.dashboardData = this.getFallbackData();

            this.notification.add("📊 Dashboard chargé en mode démo", {
                type: "info",
                sticky: false
            });
        }
    }

    getFallbackData() {
        return {
            performance_metrics: {
                ai_score: 87,
                efficiency: 89.5,
                quality_index: 97.8,
                ai_confidence: 85
            },
            ai_insights: [
                {
                    title: "Optimisation Production IA",
                    description: "L'IA identifie 23% d'amélioration possible sur la ligne de polissage",
                    confidence: 89,
                    impact: "high",
                    action: "Réorganiser les postes selon le modèle IA optimisé",
                    savings: "€15,200/mois",
                    icon: "fa-cogs",
                    color: "#4CAF50"
                },
                {
                    title: "Prédiction Qualité Avancée",
                    description: "Risque de défauts détecté dans 72h basé sur l'analyse des patterns",
                    confidence: 76,
                    impact: "medium",
                    action: "Ajuster température et humidité selon recommandations",
                    savings: "2.3% défauts évités",
                    icon: "fa-shield",
                    color: "#FF9800"
                },
                {
                    title: "Optimisation Stock IA",
                    description: "Algorithme suggère réduction de 18% des coûts de stockage",
                    confidence: 92,
                    impact: "high",
                    action: "Implémenter stratégie de réapprovisionnement IA",
                    savings: "€8,900 économisés",
                    icon: "fa-cubes",
                    color: "#2196F3"
                },
                {
                    title: "Maintenance Prédictive",
                    description: "Analyse vibratoire détecte usure prématurée sur équipement #7",
                    confidence: 84,
                    impact: "critical",
                    action: "Programmer maintenance dans 5-7 jours",
                    savings: "Éviter arrêt 48h",
                    icon: "fa-wrench",
                    color: "#F44336"
                }
            ],
            real_time_data: {
                production: 127,
                quality: 97.8,
                efficiency: 89.5,
                status: "Optimal"
            }
        };
    }

    initializeAnimations() {
        // Initialize after DOM is ready
        setTimeout(() => {
            this.setupParticles();
            this.animateMetrics();
        }, 100);
    }

    setupParticles() {
        // Particle system setup would go here
        console.log("Particles initialized");
    }

    animateMetrics() {
        // Animate progress bars and metrics
        const progressElements = document.querySelectorAll('.circular-progress');
        progressElements.forEach(element => {
            const score = element.dataset.score || 85;
            element.style.setProperty('--score', score);
        });
    }

    async refreshData() {
        try {
            this.state.isLoading = true;

            const data = await this.rpc("/custom_dashboard/refresh_ai_data", {});

            if (data.success) {
                this.state.dashboardData = data.data;
                this.state.lastUpdate = new Date().toLocaleTimeString();

                this.notification.add("🤖 Données IA actualisées", {
                    type: "success",
                    sticky: false
                });
            }
        } catch (error) {
            console.error("Erreur refresh:", error);
            // Simulate data update
            this.simulateDataUpdate();

            this.notification.add("📊 Données simulées actualisées", {
                type: "info",
                sticky: false
            });
        } finally {
            this.state.isLoading = false;
        }
    }

    simulateDataUpdate() {
        if (this.state.dashboardData) {
            // Update metrics with random variations
            const metrics = this.state.dashboardData.performance_metrics;
            metrics.ai_score = Math.max(75, Math.min(98, metrics.ai_score + (Math.random() * 6 - 3)));
            metrics.efficiency = Math.max(80, Math.min(95, metrics.efficiency + (Math.random() * 4 - 2)));
            metrics.quality_index = Math.max(94, Math.min(99.5, metrics.quality_index + (Math.random() * 2 - 1)));

            this.state.lastUpdate = new Date().toLocaleTimeString();
        }
    }

    toggleAutoRefresh() {
        if (this.state.autoRefresh) {
            clearInterval(this.refreshInterval);
            this.state.autoRefresh = false;
            this.notification.add("⏸️ Auto-refresh désactivé", { type: "info" });
        } else {
            this.refreshInterval = setInterval(() => {
                this.refreshData();
            }, 30000);
            this.state.autoRefresh = true;
            this.notification.add("▶️ Auto-refresh activé (30s)", { type: "success" });
        }
    }

    toggleVoice() {
        this.state.voiceEnabled = !this.state.voiceEnabled;

        if (this.state.voiceEnabled) {
            this.notification.add("🎤 Commandes vocales activées", { type: "success" });
        } else {
            this.notification.add("🔇 Commandes vocales désactivées", { type: "info" });
        }
    }

    applyInsight(insightId) {
        this.notification.add(`✅ Insight ${insightId} appliqué avec succès`, {
            type: "success",
            sticky: false
        });
    }

    showInsightDetails(insightId) {
        this.notification.add(`📊 Détails de l'insight ${insightId}`, {
            type: "info",
            sticky: false
        });
    }

    navigateToProduction() {
        // Navigate to production dashboard
        window.location.href = '/custom_dashboard/production';
    }

    navigateToQuality() {
        // Navigate to quality dashboard
        window.location.href = '/custom_dashboard/quality';
    }

    navigateToInventory() {
        // Navigate to inventory dashboard
        window.location.href = '/custom_dashboard/inventory';
    }

    navigateToPredictive() {
        // Navigate to predictive dashboard
        window.location.href = '/custom_dashboard/predictive';
    }
}

// Register the component - DISABLED to avoid conflicts with URL actions
// registry.category("actions").add("ai_bijouterie_dashboard", AIBijouterieDashboard);
