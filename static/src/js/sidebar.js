odoo.define('dash_backend_theme.SidebarMenu', [], function (require) {
    "use strict";

    var { ensureJQuery } = require("@web/core/ensure_jquery");

    ensureJQuery().then(() => {
        let collapseShowns = []
        $(document).on("click", ".apps_toggle", function(event){
            const mediaQuery = window.matchMedia('(max-width: 575.98px)');
            if (mediaQuery.matches) {
                $(".sidebar").toggleClass('show');
            }
            else {
                $(".sidebar").toggleClass('active');
                $(".o_action_manager").toggleClass('active');
                $(".apps_toggle").toggleClass('active');

                if ($(".sidebar").hasClass('active'))
                    window.collapseList.forEach(collapse => {
                        if (collapse._isShown()) {
                            collapse.hide();
                        }
                    });
            }

            const e = window.matchMedia('(min-width: 1600px)');
            if (e.matches) {
                setTimeout(()=>{
                    const currentWidth = $(".o_form_sheet_bg").width()
                    $(".o_control_panel").width(currentWidth + 66);
                    $('.o_content').css('background', 'unset');
                }, 300)
            } else {
                $('.o_control_panel').css('width', 'initial');
            }
        });

        $(document).on("click", ".sidebar", function(event){
            const mediaQuery = window.matchMedia('(max-width: 575.98px)');
            if (event.offsetX > 250 && mediaQuery.matches) {
                $(".sidebar").toggleClass('show');
            }
        });

        $(document).on("click", ".sidebar a", function(event){
            var menu = $(".sidebar a");
            var $this = $(this);

            menu.removeClass("active");
            $this.addClass("active");
        });

        $(document).on("mouseenter", ".sidebar", function(event){
            if ($('.apps_toggle').hasClass('active')) {
                collapseShowns.forEach(collapse => {collapse.show();})
            }
        });

        $(document).on("mouseleave", ".sidebar", function(event){
            if ($('.apps_toggle').hasClass('active'))
                collapseShowns.forEach(collapse => collapse.hide())
        });

        $(document).on("click", ".child_menus", function(event) {
            const mediaQuery = window.matchMedia('(max-width: 575.98px)');
            if (mediaQuery.matches) {
                setTimeout(()=> {
                    $(".sidebar").toggleClass('show');
                }, 200)
            }
        });

        $(document).on("click", ".sidebar_panel .sidebar .sidebar_menu .parentmenu a", function(event){
            if ($('.apps_toggle').is(":visible"))
            {
                $(".sidebar_menu").toggleClass('active');
                $(".apps_toggle").toggleClass('active');
            }
        });

        $(document).on("click", ".header-sub-menus .nav-item a", function(event){
            var allMenus = $(".nav-link");
            allMenus.removeClass("active");

            var parent = this.closest('.header-sub-menus');
            var currMenu = parent.previousElementSibling;
            $(currMenu).addClass("active");
        });

        $(document).ready(()=> {
            const collapseElements = document.querySelectorAll('.collapse');
            const collapseList = [...collapseElements].map(collapseEl => new Collapse(collapseEl, { toggle: false }));
            window.collapseList = collapseList
            collapseElements.forEach((element) => {
                element.addEventListener('shown.bs.collapse', event => {
                    collapseShowns = []
                    for (var collapse of collapseList){
                        if (collapse._isShown()) {
                            if (collapseShowns.indexOf(collapse) == -1){
                                collapseShowns.push(collapse);
                            }
                        }
                    }
                })
            })
        })
    })


});