<div class="grd-parent grd-row-padding grd-grid-12 table-header center-aligned">
    <div id="stockname" class="grd-grid-4">[% l('Time') %]</div>
    <div id="open" class="grd-grid-4">[% l('Price') %]</div>
    <div id="low" class="grd-grid-4">[% l('Change') %]</div>
</div>

[% FOREACH ticker IN ticker_data %]
    [% IF ticker.price %]
    <div class="grd-parent grd-row-padding grd-grid-12 table-body table-body-lines center-aligned">
        <div class="grd-grid-4">[% ticker.time_start %]</div>
        <div class="grd-grid-4">[% ticker.price %]</div>
        <div class="grd-grid-4">
            [% ticker.change_cell %]
        </div>
    </div>
    [% END %]
[% END %]
