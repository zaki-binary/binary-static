<div id="asset-tabs" class='has-tabs'>
    <ul>
        [% FOREACH market IN fullinfo %]
        <li>
            <a href="#[% market.tabid %]">[% market.name %]</a>
        </li>
        [% END %]
    </ul>
    <div class='grd-row-padding'>
        [% FOREACH market IN fullinfo %]
        <div id="[% market.tabid %]">
            <div class='grd-parent grd-grid-12'>
            [% FOREACH submarket IN market.submarkets %]
                <div class="grd-grid-12 grd-row-padding center-aligned table-header">
                    [% submarket.name %]
                </div>

                [%- IF market.code == 'random' -%]
                    [% first_column = 0 -%]
                [%- ELSE -%]
                    [% first_column = 1 %]
                [%- END -%]

                <div class="grd-parent grd-grid-12 table-header grd-row-padding">

                    <div class="grd-grid-2"></div>

                    [%- IF market.code == 'random' -%]

                        [% first_column = 0 %]
                        <div class="grd-grid-1">[% categories.item(0) %]</div>
                        <div class="grd-grid-1">[% categories.item(1) %]</div>

                        [%- FOREACH category IN [2..5] -%]
                            <div class="grd-grid-2">[% categories.item(category) %]</div>
                        [%- END %]

                    [%- ELSE -%]

                        [% first_column = 1 %]

                        <div class="grd-grid-2">[% categories.item(1) %]</div>
                        [%- FOREACH category IN [2..5] -%]
                            <div class="grd-grid-2">[% categories.item(category) %]</div>
                        [%- END %]

                    [%- END -%]

                    </div>

                [% FOREACH underlying IN submarket.underlyings %]

                    <div class="grd-parent grd-grid-12 table-body table-body-lines grd-row-padding clear">
                    <div class="grd-grid-2 grd-no-gutter">
                        <strong>[% underlying.name %]</strong>
                    </div>

                    [% FOREACH column IN [first_column..5] -%]

                        [% grid_width = 2 %]
                        [% IF market.code == 'random' && column < 2 %]
                            [% grid_width = 1 %]
                        [% END %]

                        [% IF underlying.contract_categories.first.place == column %]
                            [% category = underlying.contract_categories.shift %]
                            <div class="grd-grid-[% grid_width %]">
                            [%- IF category.expiries.formatted -%]
                                <a class="pjaxload" href="[% request.url_for(category.link_page, category.link_params) %]">
                                    [% category.expiries.formatted %]
                                </a>
                            [%- ELSE -%]
                                [% category.link_params.time = category.expiries.min %]
                                <a class="pjaxload" href="[% request.url_for(category.link_page, category.link_params) %]">
                                    [% category.expiries.min %] - [%  category.expiries.max %]
                                </a>
                            [%- END %]
                            </div>
                        [% ELSE %]
                            <div class="grd-grid-[% grid_width %]"></div>
                        [% END %]
                    [% END %]
                    </div>
                [% END %]
            [% END %]
            </div>
        </div>
        [% END %]
    </div>
</div>
