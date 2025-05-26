/** @odoo-module **/

import { registry } from "@web/core/registry";
import { Component, useState, useEffect } from "@odoo/owl";
import { Layout } from "@web/search/layout";
import { rpc } from "@web/core/network/rpc";

class CustomDashboard extends Component {
    static template = "custom_dashboard.Dashboard";
    static components = { Layout };
    static props = ["*"];
    
    setup() {
        super.setup();
        this.state = useState({
            data: {},
            isLoading: true
        });
        
        useEffect(() => {
            this.loadDashboardData();
        }, () => []);
    }
    
    async loadDashboardData() {
        try {
            const data = await rpc("/custom_dashboard/get_data");
            this.state.data = data;
            this.state.isLoading = false;
        } catch (error) {
            console.error("Failed to load dashboard data:", error);
            this.state.isLoading = false;
        }
    }
    
    get display() {
        return {
            controlPanel: {
                "top-right": false,
                "bottom-right": false
            }
        };
    }
}

registry.category("actions").add("custom_dashboard.main", CustomDashboard);