/** @odoo-module **/

import { Component, useState, onMounted, onWillUnmount } from "@odoo/owl";
import { useService } from "@web/core/utils/hooks";
import { _t } from "@web/core/l10n/translation";

/**
 * Modern Dashboard Component
 * Enhanced version with modern UI and animations
 */
export class ModernDashboard extends Component {
    static template = "odoo_dynamic_dashboard.ModernDashboardGrid";

    setup() {
        this.orm = useService("orm");
        this.notification = useService("notification");
        this.dialog = useService("dialog");

        // Dashboard state
        this.state = useState({
            dashboard: null,
            blocks: [],
            isLoading: true,
            isFullscreen: false,
            theme: 'light',
            refreshInterval: null,
            lastRefresh: null
        });

        // Initialize dashboard
        onMounted(() => {
            this.initializeDashboard();
            this.setupAutoRefresh();
            this.setupKeyboardShortcuts();
        });

        onWillUnmount(() => {
            this.cleanup();
        });
    }

    /**
     * Initialize the modern dashboard
     */
    async initializeDashboard() {
        try {
            this.state.isLoading = true;
            
            // Load dashboard data
            await this.loadDashboardData();
            
            // Initialize animations
            this.initializeAnimations();
            
            // Setup responsive handlers
            this.setupResponsiveHandlers();
            
        } catch (error) {
            console.error("Dashboard initialization failed:", error);
            this.notification.add(_t("Erreur lors de l'initialisation du tableau de bord"), {
                type: "danger"
            });
        } finally {
            this.state.isLoading = false;
        }
    }

    /**
     * Load dashboard data from backend
     */
    async loadDashboardData() {
        try {
            const dashboardId = this.props.dashboardId || 1;
            
            // Load dashboard configuration
            const dashboard = await this.orm.read("dashboard.dashboard", [dashboardId], [
                "name", "description", "layout", "theme", "refresh_interval"
            ]);
            
            if (dashboard.length > 0) {
                this.state.dashboard = dashboard[0];
            }
            
            // Load dashboard blocks
            const blocks = await this.orm.searchRead("dashboard.block", 
                [["dashboard_id", "=", dashboardId]], 
                ["name", "type", "width", "height", "data_x", "data_y", "background_color", "text_color"]
            );
            
            this.state.blocks = blocks;
            this.state.lastRefresh = new Date();
            
        } catch (error) {
            console.error("Failed to load dashboard data:", error);
            throw error;
        }
    }

    /**
     * Refresh dashboard data
     */
    async refreshData() {
        try {
            // Add loading animation
            this.addRefreshAnimation();
            
            await this.loadDashboardData();
            
            this.notification.add(_t("Tableau de bord actualisé"), {
                type: "success"
            });
            
        } catch (error) {
            this.notification.add(_t("Erreur lors de l'actualisation"), {
                type: "danger"
            });
        } finally {
            this.removeRefreshAnimation();
        }
    }

    /**
     * Toggle fullscreen mode
     */
    toggleFullscreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
            this.state.isFullscreen = true;
        } else {
            document.exitFullscreen();
            this.state.isFullscreen = false;
        }
    }

    /**
     * Setup auto-refresh functionality
     */
    setupAutoRefresh() {
        const interval = this.state.dashboard?.refresh_interval || 0;
        
        if (interval > 0) {
            this.state.refreshInterval = setInterval(() => {
                this.refreshData();
            }, interval * 1000);
        }
    }

    /**
     * Setup keyboard shortcuts
     */
    setupKeyboardShortcuts() {
        document.addEventListener('keydown', this.handleKeyboardShortcuts.bind(this));
    }

    /**
     * Handle keyboard shortcuts
     */
    handleKeyboardShortcuts(event) {
        // Ctrl/Cmd + R: Refresh dashboard
        if ((event.ctrlKey || event.metaKey) && event.key === 'r') {
            event.preventDefault();
            this.refreshData();
        }
        
        // F11: Toggle fullscreen
        if (event.key === 'F11') {
            event.preventDefault();
            this.toggleFullscreen();
        }
        
        // Escape: Exit fullscreen
        if (event.key === 'Escape' && this.state.isFullscreen) {
            this.toggleFullscreen();
        }
    }

    /**
     * Initialize modern animations
     */
    initializeAnimations() {
        // Staggered animation for dashboard blocks
        const blocks = document.querySelectorAll('.o_dashboard_block');
        blocks.forEach((block, index) => {
            block.style.animationDelay = `${index * 0.1}s`;
            block.classList.add('animate-in');
        });

        // Parallax effect for background
        this.setupParallaxEffect();
    }

    /**
     * Setup parallax background effect
     */
    setupParallaxEffect() {
        const dashboard = document.querySelector('.o_dynamic_dashboard');
        if (dashboard) {
            window.addEventListener('scroll', () => {
                const scrolled = window.pageYOffset;
                const rate = scrolled * -0.5;
                dashboard.style.transform = `translateY(${rate}px)`;
            });
        }
    }

    /**
     * Setup responsive handlers
     */
    setupResponsiveHandlers() {
        window.addEventListener('resize', this.handleResize.bind(this));
        this.handleResize(); // Initial call
    }

    /**
     * Handle window resize
     */
    handleResize() {
        const width = window.innerWidth;
        
        // Adjust layout based on screen size
        if (width < 768) {
            this.setMobileLayout();
        } else if (width < 1200) {
            this.setTabletLayout();
        } else {
            this.setDesktopLayout();
        }
    }

    /**
     * Set mobile layout
     */
    setMobileLayout() {
        const content = document.querySelector('.o_dashboard_content');
        if (content) {
            content.classList.add('mobile-layout');
            content.classList.remove('tablet-layout', 'desktop-layout');
        }
    }

    /**
     * Set tablet layout
     */
    setTabletLayout() {
        const content = document.querySelector('.o_dashboard_content');
        if (content) {
            content.classList.add('tablet-layout');
            content.classList.remove('mobile-layout', 'desktop-layout');
        }
    }

    /**
     * Set desktop layout
     */
    setDesktopLayout() {
        const content = document.querySelector('.o_dashboard_content');
        if (content) {
            content.classList.add('desktop-layout');
            content.classList.remove('mobile-layout', 'tablet-layout');
        }
    }

    /**
     * Add refresh animation
     */
    addRefreshAnimation() {
        const refreshBtn = document.querySelector('.o_dashboard_refresh');
        if (refreshBtn) {
            refreshBtn.classList.add('refreshing');
            refreshBtn.disabled = true;
        }
    }

    /**
     * Remove refresh animation
     */
    removeRefreshAnimation() {
        const refreshBtn = document.querySelector('.o_dashboard_refresh');
        if (refreshBtn) {
            refreshBtn.classList.remove('refreshing');
            refreshBtn.disabled = false;
        }
    }

    /**
     * Cleanup resources
     */
    cleanup() {
        // Clear auto-refresh interval
        if (this.state.refreshInterval) {
            clearInterval(this.state.refreshInterval);
        }
        
        // Remove event listeners
        document.removeEventListener('keydown', this.handleKeyboardShortcuts);
        window.removeEventListener('resize', this.handleResize);
        window.removeEventListener('scroll', this.setupParallaxEffect);
    }

    /**
     * Export dashboard as PDF
     */
    async exportToPDF() {
        try {
            this.notification.add(_t("Génération du PDF en cours..."), {
                type: "info"
            });
            
            // Implementation for PDF export
            // This would integrate with a PDF generation service
            
        } catch (error) {
            this.notification.add(_t("Erreur lors de l'export PDF"), {
                type: "danger"
            });
        }
    }

    /**
     * Share dashboard via email
     */
    async shareViaEmail() {
        try {
            // Implementation for email sharing
            // This would open a dialog for email configuration
            
        } catch (error) {
            this.notification.add(_t("Erreur lors du partage"), {
                type: "danger"
            });
        }
    }
}