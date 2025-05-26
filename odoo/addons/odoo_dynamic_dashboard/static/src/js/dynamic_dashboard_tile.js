/** @odoo-module **/
import { _t } from "@web/core/l10n/translation";
import { ConfirmationDialog } from "@web/core/confirmation_dialog/confirmation_dialog";
const { Component, xml, useRef, onMounted } = owl;

export class DynamicDashboardTile extends Component {
    setup() {
        this.tileRef = useRef("tile");
        this.doAction = this.props.doAction?.doAction;
        this.dialog = this.props.dialog;
        this.orm = this.props.orm;

        onMounted(() => this.refreshValue());
        this.interval = setInterval(() => this.refreshValue(), 60000);
    }

    async refreshValue() {
        try {
            if (this.props.widget.model_name && this.orm) {
                const result = await this.orm.call(this.props.widget.model_name, "get_query", [
                    this.props.widget.domain || [],
                    this.props.widget.operation,
                    this.props.widget.measured_field_id,
                ]);
                this.props.widget.value = result[0]?.value || "—";
                this.render();
            }
        } catch (err) {
            console.warn("Failed to refresh KPI value", err);
        }
    }

    async getConfiguration(ev) {
        if (!this.doAction) return;
        ev.stopPropagation();
        ev.preventDefault();
        await this.doAction({
            type: "ir.actions.act_window",
            res_model: "dashboard.block",
            res_id: this.props.widget.id,
            view_mode: "form",
            views: [[false, "form"]],
        });
    }

    async removeTile(ev) {
        if (!this.dialog || !this.orm) return;
        ev.stopPropagation();
        ev.preventDefault();
        this.dialog.add(ConfirmationDialog, {
            title: _t("Delete Confirmation"),
            body: _t("Are you sure you want to delete this item?"),
            confirmLabel: _t("Yes"),
            cancelLabel: _t("No"),
            confirm: async () => {
                await this.orm.unlink("dashboard.block", [this.props.widget.id]);
                location.reload();
            },
        });
    }

    async getRecords() {
        if (!this.doAction || !this.props.widget.model_name) return;
        await this.doAction({
            type: "ir.actions.act_window",
            res_model: this.props.widget.model_name,
            view_mode: "list",
            views: [[false, "list"]],
            domain: this.props.widget.domain,
        });
    }
}

DynamicDashboardTile.template = xml`
    <div class="resize-drag tile rounded shadow-sm" t-ref="tile"
        t-on-dblclick="getRecords"
        t-att-data-id="this.props.widget.id"
        t-att-data-x="this.props.widget.data_x"
        t-att-data-y="this.props.widget.data_y"
        t-att-style="'transform: translate('+ this.props.widget.translate_x +', '+ this.props.widget.translate_y +'); width:' + this.props.widget.width + '; height:' + this.props.widget.height + ';'"
        style="background: linear-gradient(135deg, #4e73df 0%, #224abe 100%); color: white;">

        <div class="d-flex justify-content-between align-items-start p-3">
            <div>
                <h4 class="m-0 fw-bold" t-esc="this.props.widget.name"/>
                <span class="small opacity-75">KPI</span>
            </div>
            <div class="btn-group">
                <button class="btn btn-sm btn-light-hover" t-on-click="(ev) => this.getConfiguration(ev)">
                    <i class="fa fa-cog" title="Config"/>
                </button>
                <button class="btn btn-sm btn-light-hover" t-on-click="(ev) => this.removeTile(ev)">
                    <i class="fa fa-times" title="Delete"/>
                </button>
            </div>
        </div>

        <div class="d-flex flex-column align-items-center justify-content-center p-3" style="height: calc(100% - 60px);">
            <h2 class="fw-bold mb-0" style="font-size: 2.5rem;">
                <t t-esc="this.props.widget.value || '—'"/>
            </h2>
            <div class="progress mt-2 w-75" style="height: 8px;">
                <div class="progress-bar" role="progressbar" style="width: 75%;" aria-valuenow="75" aria-valuemin="0" aria-valuemax="100"></div>
            </div>
            <div class="small mt-2">
                <i class="fa fa-arrow-up text-success"></i>
                <span>12% depuis le mois dernier</span>
            </div>
        </div>
    </div>`;


