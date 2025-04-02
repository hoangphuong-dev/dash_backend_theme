/** @odoo-module **/

import {patch} from "@web/core/utils/patch";
import { ControlPanel } from "@web/search/control_panel/control_panel";
import { useBus } from "@web/core/utils/hooks";
import { ensureJQuery } from '@web/core/ensure_jquery';
import {
    onMounted,
    onWillStart,
    useState
} from "@odoo/owl";


patch(ControlPanel.prototype, {

    setup() {
        super.setup();
        this.state = useState({ ...this.state, customQuery: false });
        onMounted(this.onMounted);
        onWillStart(this.onWillStart)
        if (this.env.searchModel)
            useBus(this.env.searchModel, "update", this.searchUpdated);
    },

    async onWillStart() {
        await ensureJQuery();
    },
    onMounted() {
        let link = $('.control-filter-item')
        link.removeClass('active');
        if (this.env.searchModel && this.env.searchModel.query.length > 0) {
            const itemFilter = this.env.searchModel.query[0]
            let found = false
            for (const item of link.toArray()) {
                if (item.getAttribute('data') == itemFilter.searchItemId) {
                    $(item).addClass('active');
                    found = true
                }
            }
            this.state.customQuery = !found;
            if (!found) {
                setTimeout(()=> {
                    $('.custom-query').addClass('active');
                }, 100)
            }
        } else {
            $(link[0]).addClass('active');
        }

    },

    searchUpdated() {
        let query = this.env.searchModel.query;
        let link = $('.control-filter-item');
        $('.control-filter-item').removeClass('active');
        if (query.length > 0) {
            let found = false;
            for (const q of query) {
                found = false
                for (const item of this.filterItems) {
                    if (item.id == q.searchItemId) {
                        link.toArray().forEach((linkItem) => {
                            if (linkItem.getAttribute('data') == q.searchItemId)
                                $(linkItem).addClass('active');
                        })
                        found = true
                        break;
                    }
                }
            }
            this.state.customQuery = !found;
            if (!found) {
                setTimeout(()=> {
                    $('.custom-query').addClass('active');
                }, 100)
            }
        } else {
            this.state.customQuery = false;
            $('.control-filter-item').removeClass('active');
            $(link[0]).addClass('active');
        }
    },

    get filterItems() {
        if (this.env.searchModel) {
            let searchItems = [
                {id: 'all', description: 'All'}
            ]
            let items = this.env.searchModel?.getSearchItems((searchItem) =>
                ["filter"].includes(searchItem.type)
            );
            if (items.length > 0) {
                return searchItems.concat(items);
            }else
                return []
        } else
            return [];
    },

    get isSplitViewAvailable() {
        return typeof this.onSplitViewClicked == 'function';
    },

    onFilterSelected(ev, itemId) {
        this.env.searchModel?.clearQuery();
        if (itemId != 'all') {
            this.env.searchModel?.toggleSearchItem(itemId);
        }
    }
});